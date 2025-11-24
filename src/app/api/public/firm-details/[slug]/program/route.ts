import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import FundingFirm from "@/models/FirmDetails";
import Program, { IProgram } from "@/models/FirmProgram";
import { FilterQuery } from "mongoose";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await context.params;
        const searchParams = request.nextUrl.searchParams;
        const type = searchParams.get("type");
        const size = searchParams.get("size");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const existingFirm = await FundingFirm.findOne({
            "firmDetails.slug": slug,
        });

        if (!existingFirm) {
            return NextResponse.json(
                { success: false, message: "Firm not found" },
                { status: 404 }
            );
        }

        const query: FilterQuery<IProgram> = { propFirmId: existingFirm._id };

        if (type) {
            query.type = type;
        }

        if (size) {
            query["accountSizes.size"] = parseInt(size);
        }

        const total = await Program.countDocuments(query);
        const programs = await Program.find(query)
            .skip(skip)
            .limit(limit);

        return NextResponse.json({
            success: true,
            data: programs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching firm programs:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}