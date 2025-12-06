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

        // 2. Update the specific field in MongoDB
        // The path in the document is scores.<pillarId>.<categoryId>.<factorKey>
        const updatePath = `scores.${pillarId}.${categoryId}.${factorKey}`;

        const updatedEvaluation = await PointEvaluation.findOneAndUpdate(
            { firmId: new Types.ObjectId(firmId) },
            { $set: { [updatePath]: numericValue } },
            { new: true }
        );

        if (!updatedEvaluation) {
            return NextResponse.json({ error: "Evaluation not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Factor updated successfully",
            evaluation: updatedEvaluation
        });

    } catch (error) {
        console.error("Error updating factor:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
