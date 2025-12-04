import { NextRequest, NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";
import connectDB from "@/lib/mongodb";
import FundingFirm from "@/models/FirmDetails";
import Review from "@/models/Review";

interface FirmDBType {
    _id: Types.ObjectId;
    firmDetails?: {
        name?: string;
        totalPayout?: number;
        image?: {
            url?: string;
            publicId?: string;
            thumbnail?: string;
        };
        yearFounded?: number;
        slug?: string;
    };
}

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;

        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 10;
        const search = searchParams.get("search")?.trim() || "";
        const sortBy = searchParams.get("sortBy") || "name";
        const order: 1 | -1 = searchParams.get("order") === "desc" ? -1 : 1;

        const filter: Record<string, unknown> = {};

        if (search) {
            filter["firmDetails.name"] = { $regex: search, $options: "i" };
        }

        const sort: Record<string, 1 | -1> = {};
        if (sortBy === "name") sort["firmDetails.name"] = order;
        else if (sortBy === "payout") sort["firmDetails.totalPayout"] = order;
        else if (sortBy === "yearFounded") sort["firmDetails.yearFounded"] = order;

        const skip = (page - 1) * limit;

        const [firms, totalCount] = await Promise.all([
            FundingFirm.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean<FirmDBType[]>(),
            FundingFirm.countDocuments(filter),
        ]);

        const firmObjectIds = firms.map((f) => new mongoose.Types.ObjectId(f._id));


        const reviewCounts = await Review.aggregate([
            {
                $match: {
                    $or: [
                        { firmId: { $in: firmObjectIds } },
                        { firmName: { $in: firms.map(f => f.firmDetails?.name) } },
                    ],
                },
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $ifNull: ["$firmId", false] },
                            "$firmId",
                            "$firmName",
                        ],
                    },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);



        const reviewCountMap = new Map<string, number>();
        reviewCounts.forEach((item) => {
            if (item._id) {
                reviewCountMap.set(item._id.toString(), item.totalReviews);
            }
        });

        const totalPages = Math.ceil(totalCount / limit);

        const result = firms.map((firm) => ({
            id: firm._id.toString(),
            name: firm.firmDetails?.name ?? "Unknown",
            totalPayout: firm.firmDetails?.totalPayout ?? null,
            image: firm.firmDetails?.image ?? null,
            yearFounded: firm.firmDetails?.yearFounded ?? null,
            slug: firm.firmDetails?.slug ?? null,
            totalReview: reviewCountMap.get(firm._id.toString()) ?? 0,
        }));


        return NextResponse.json(
            {
                success: true,
                data: result,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCount,
                    limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                },
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("API ERROR:", error);

        const message =
            error instanceof Error ? error.message : "Unexpected server error";

        return NextResponse.json(
            {
                success: false,
                error: message,
            },
            { status: 500 }
        );
    }
}
