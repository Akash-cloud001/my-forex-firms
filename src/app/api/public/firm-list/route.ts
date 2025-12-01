import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import FundingFirm from "@/models/FirmDetails";
import { Types } from "mongoose";

interface FirmDBType {
    _id: Types.ObjectId;
    firmDetails?: {
        name?: string;
        totalPayout?: number;
    };
}

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;

        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 10;
        const search = searchParams.get("search") || "";
        const sortBy = searchParams.get("sortBy") || "name";
        const order = searchParams.get("order") === "desc" ? -1 : 1;

        // Build search filter safely typed
        const filter: Record<string, unknown> = {};

        if (search) {
            filter["firmDetails.name"] = { $regex: search, $options: "i" };
        }

        // Build sort object
        const sort: Record<string, 1 | -1> = {};
        if (sortBy === "name") {
            sort["firmDetails.name"] = order;
        } else if (sortBy === "payout") {
            sort["firmDetails.totalPayout"] = order;
        }

        const skip = (page - 1) * limit;

        const [firms, totalCount] = await Promise.all([
            FundingFirm.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean<FirmDBType[]>(),
            FundingFirm.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return NextResponse.json(
            {
                success: true,
                data: firms.map((firm) => ({
                    id: firm._id.toString(),
                    name: firm.firmDetails?.name ?? "Unknown",
                    totalPayout: firm.firmDetails?.totalPayout ?? null,
                })),
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
