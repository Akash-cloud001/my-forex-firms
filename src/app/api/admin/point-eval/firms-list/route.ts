import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import FundingFirm from "@/models/FirmDetails";
import PointEvaluation from "@/models/PointEvaluation";

export async function GET() {
    try {
        await connectDB();

        const firms = await FundingFirm.aggregate([
            {
                $project: {
                    _id: 1,
                    name: "$firmDetails.name",
                }
            },
            {
                $lookup: {
                    from: "pointevaluations",
                    localField: "_id",
                    foreignField: "firmId",
                    as: "evaluationData",
                }
            },
            {
                $addFields: {
                    evaluation: { $arrayElemAt: ["$evaluationData", 0] }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    isEvaluated: "$evaluation.isEvaluated",
                    evaluatedAt: "$evaluation.evaluatedAt",
                }
            }
        ]);

        const formatted = firms.map(f => ({
            id: f._id.toString(),
            name: f.name ?? "Unknown Firm",
            isEvaluated: f.isEvaluated ?? false,
            evaluatedAt: f.evaluatedAt ?? null
        }));

        return NextResponse.json(formatted);

    } catch (error: unknown) {
        console.error("Error fetching firms:", error);
        const message =
            error instanceof Error ? error.message : "Unexpected error occurred";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
