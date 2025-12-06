import FundingFirm from "@/models/FirmDetails";
import Review from "@/models/Review";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { firmId, page: pageParam, limit: limitParam } = body;

        // Validate firmId
        if (!firmId) {
            return NextResponse.json(
                { success: false, error: "Firm ID is required" },
                { status: 400 }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(firmId)) {
            return NextResponse.json(
                { success: false, error: "Invalid Firm ID" },
                { status: 400 }
            );
        }

        // Validate firm exists
        const existingFirm = await FundingFirm.findById(firmId);
        if (!existingFirm) {
            return NextResponse.json(
                { success: false, error: "Firm not found" },
                { status: 404 }
            );
        }

        // Pagination parameters
        const page = Math.max(1, parseInt(pageParam?.toString() || "1", 10));
        const limit = Math.max(1, Math.min(10, parseInt(limitParam?.toString() || "10", 10))); // Max 10 per page
        const skip = (page - 1) * limit;

        // Build aggregation pipeline
        const firmObjectId = new mongoose.Types.ObjectId(firmId);
        
        // Match stage - for public API, we want approved reviews only
        const matchStage = {
            firmId: firmObjectId,
            status: "approved",
        };

        // Get total count for pagination (before skip/limit)
        const totalCountResult = await Review.aggregate([
            { $match: matchStage },
            { $count: "total" },
        ]);
        const total = totalCountResult[0]?.total || 0;

        // Fetch reviews with pagination
        const reviews = await Review.aggregate([
            {
                $match: matchStage,
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "userId",
                    as: "userDetails",
                },
            },
            {
                $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $sort: { createdAt: -1 }, // Newest first
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
            {
                $project: {
                    _id: { $toString: "$_id" },
                    userName: {
                        $cond: {
                            if: { $ifNull: ["$userDetails.fullName", false] },
                            then: "$userDetails.fullName",
                            else: {
                                $cond: {
                                    if: { $ifNull: ["$userDetails.firstName", false] },
                                    then: {
                                        $trim: {
                                            input: {
                                                $concat: [
                                                    { $ifNull: ["$userDetails.firstName", ""] },
                                                    " ",
                                                    { $ifNull: ["$userDetails.lastName", ""] },
                                                ],
                                            },
                                        },
                                    },
                                    else: "Anonymous",
                                },
                            },
                        },
                    },
                    userImage: { $ifNull: ["$userDetails.imageUrl", null] },
                    firmName: 1,
                    issueCategory: 1,
                    issueType: 1,
                    description: 1,
                    files: {
                        $map: {
                            input: { $ifNull: ["$files", []] },
                            as: "file",
                            in: {
                                name: "$$file.name",
                                type: "$$file.type",
                                size: "$$file.size",
                                url: "$$file.url",
                                thumbnail_url: "$$file.thumbnail_url",
                                uploadedAt: "$$file.uploadedAt",
                            },
                        },
                    },
                    status: 1,
                    createdAt: 1,
                },
            },
        ]);

        return NextResponse.json({
            success: true,
            data: reviews,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        const err = error instanceof Error ? error : new Error(String(error));

        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch reviews",
                message: err.message,
            },
            { status: 500 }
        );
    }
}
