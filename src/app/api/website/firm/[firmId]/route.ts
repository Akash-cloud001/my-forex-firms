import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import FundingFirm from "@/models/FirmDetails";
import mongoose from "mongoose";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ firmId: string }> }
) {
    try {
        await connectDB();

        const { firmId } = await params;

        // Validate firmId
        if (!mongoose.Types.ObjectId.isValid(firmId)) {
            return NextResponse.json(
                { success: false, message: "Invalid firm ID" },
                { status: 400 }
            );
        }

        const firm = await FundingFirm.findById(firmId, { "firmDetails.name": 1 }).lean();

        if (!firm) {
            return NextResponse.json(
                { success: false, message: "Firm not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                id: firm._id.toString(),
                name: firm.firmDetails.name,
            },
        });
    } catch (error) {
        console.error("Error fetching firm:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch firm details" },
            { status: 500 }
        );
    }
}
