import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import FundingFirm from "@/models/FirmDetails";
import { Types } from "mongoose";

interface FirmDBType {
    _id: Types.ObjectId;
    firmDetails?: {
        name?: string;
    };
}

export async function GET() {
    try {
        await connectDB();

        const firms = await FundingFirm
            .find({}, "_id firmDetails.name")
            .lean<FirmDBType[]>();

        const formattedFirms = firms.map((firm) => ({
            id: firm._id.toString(),
            name: firm.firmDetails?.name ?? "Unknown Firm",
        }));

        return NextResponse.json(formattedFirms);

    } catch (error: unknown) {
        console.error("Error fetching firms:", error);

        // narrow down the error type safely
        const message =
            error instanceof Error ? error.message : "Unexpected error occurred";

        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
