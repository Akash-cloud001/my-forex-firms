import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import FundingFirm from "@/models/FirmDetails";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();

    const filter = query
      ? { "firmDetails.name": { $regex: query, $options: "i" } }
      : {};

    const firms = await FundingFirm.find(filter, {
      "firmDetails.name": 1,
    })
      .limit(7)
      .sort({ createdAt: -1 });

    const result = firms.map((firm) => ({
      id: firm._id,
      name: firm.firmDetails.name,
    }));

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching firms:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch firm list" },
      { status: 500 }
    );
  }
}