import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import FundingFirm from "@/models/FirmDetails";


export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await context.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid firm ID" },
                { status: 400 }
            );
        }

        const existingFirm = await FundingFirm.findById(id);
        if (!existingFirm) {
            return NextResponse.json(
                { success: false, message: "Firm not found" },
                { status: 404 }
            );
        }

        const result = await FundingFirm.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            {
                $lookup: {
                    from: "programs",
                    localField: "_id",
                    foreignField: "propFirmId",
                    as: "programs",
                },
            },
            {
                $lookup: {
                    from: "firmrules",
                    localField: "_id",
                    foreignField: "firmId",
                    as: "firmRules",
                },
            },
            {
                $addFields: {
                    totalPrograms: { $size: "$programs" },
                    totalCategories: {
                        $cond: [
                            { $gt: [{ $size: "$firmRules" }, 0] },
                            { $size: { $first: "$firmRules.categories" } },
                            0,
                        ],
                    },
                },
            },
        ]);

        if (!result || result.length === 0) {
            return NextResponse.json(
                { success: false, message: "Firm not found" },
                { status: 404 }
            );
        }

        const firm = result[0];

        return NextResponse.json({
            success: true,
            message: "Firm details with programs fetched successfully",
            data: firm,
        });
    } catch (error) {
        console.error("Error fetching firm with programs:", error);
        const err = error instanceof Error ? error : new Error(String(error));

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch firm details",
                error: err.message,
            },
            { status: 500 }
        );
    }
}