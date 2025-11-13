import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import FundingFirm from "@/models/FirmDetails";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.max(1, parseInt(searchParams.get("limit") ?? "10"));
    const skip = (page - 1) * limit;

    const filter = query
      ? { "firmDetails.name": { $regex: query, $options: "i" } }
      : {};

    const [firms, total] = await Promise.all([
      FundingFirm.find(filter, { "firmDetails.name": 1 })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      FundingFirm.countDocuments(filter),
    ]);
const result = firms.map((f) => ({
  id: f._id.toString(),
  name: f.firmDetails.name,
}));

const hasMore = firms.length === limit && skip + firms.length < total;

return NextResponse.json({
  success: true,
  data: result,
  pagination: {
    page,
    limit,
    total,
    hasMore,
  },
})
  } catch (error) {
    console.error("Error fetching firms:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch firm list" },
      { status: 500 }
    );
  }
}