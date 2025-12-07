import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PointEvaluation from "@/models/PointEvaluation";
import { pillarsConfig } from "@/components/crm/point-evaluation/types/constant";
import { Pillar, Category, FactorConfig } from "@/components/crm/point-evaluation/types/constant.types";
import { Types } from "mongoose";

export async function PATCH(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { firmId, pillarId, categoryId, factorKey, value } = body;

        if (!firmId || !pillarId || !categoryId || !factorKey || value === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (!Types.ObjectId.isValid(firmId)) {
            return NextResponse.json({ error: "Invalid Firm ID format" }, { status: 400 });
        }

        // 1. Find the max value from config
        const pillar = pillarsConfig.find((p: Pillar) => p.id === pillarId);
        if (!pillar) return NextResponse.json({ error: "Invalid pillar ID" }, { status: 400 });

        const category = pillar.categories.find((c: Category) => c.id === categoryId);
        if (!category) return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });

        const factorConfig = category.factors[factorKey] as FactorConfig;
        if (!factorConfig) return NextResponse.json({ error: "Invalid factor key" }, { status: 400 });

        const numericValue = Number(value);
        if (isNaN(numericValue)) {
            return NextResponse.json({ error: "Value must be a number" }, { status: 400 });
        }

        if (numericValue < 0 || numericValue > factorConfig.max) {
            return NextResponse.json({
                error: `Value ${numericValue} exceeds maximum allowed ${factorConfig.max} for ${factorConfig.label}`
            }, { status: 400 });
        }

        // 2. Fetch the current document to calculate full scores
        const evaluation = await PointEvaluation.findOne({ firmId: new Types.ObjectId(firmId) });

        if (!evaluation) {
            return NextResponse.json({ error: "Evaluation not found" }, { status: 404 });
        }

        // 3. Update the specific value in the retrieved object
        // 3. Update the specific value in the retrieved object
        const scores = evaluation.scores as unknown as Record<string, Record<string, Record<string, number>>>;
        if (!scores[pillarId]) scores[pillarId] = {};
        if (!scores[pillarId][categoryId]) scores[pillarId][categoryId] = {};

        scores[pillarId][categoryId][factorKey] = numericValue;

        // 4. Calculate PTI Score
        // Formula: PTI = (C * 0.35) + (T * 0.30) + (P * 0.35)

        const calculateCategoryTotal = (pillarName: string) => {
            let total = 0;
            const p = scores[pillarName];
            if (!p) return 0;

            const pObj = p;

            for (const catKey in pObj) {
                const cat = pObj[catKey];
                // Check if cat is an object and not null (skip internal keys if any slip through)
                if (typeof cat !== 'object' || cat === null) continue;

                for (const factKey in cat) {
                    const val = cat[factKey];
                    // STRICT CHECK: Only add if it is a number
                    if (typeof val === 'number' && !isNaN(val)) {
                        total += val;
                    }
                }
            }
            return total;
        };

        const C = calculateCategoryTotal("credibility");
        const T = calculateCategoryTotal("trading_experience");
        const P = calculateCategoryTotal("payout_payment_experience");

        const ptiRaw = (C * 0.35) + (T * 0.30) + (P * 0.35);
        const ptiScore = isNaN(ptiRaw) ? 0 : ptiRaw;

        evaluation.ptiScore = parseFloat(ptiScore.toFixed(2));

        // 5. Save the document
        // Mark the modified path as modified to ensure mongoose saves it
        evaluation.markModified(`scores.${pillarId}.${categoryId}.${factorKey}`);
        await evaluation.save();

        // Return the updated evaluation including the new ptiScore
        return NextResponse.json({
            message: "Factor updated successfully",
            evaluation: evaluation
        });

    } catch (error) {
        console.error("Error updating factor:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
