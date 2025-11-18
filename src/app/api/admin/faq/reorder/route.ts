
import { NextRequest, NextResponse } from "next/server";
import Faq from "@/models/Faq";
import connectDB from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { faqs } = body; 

    if (!Array.isArray(faqs) || faqs.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid faqs array" },
        { status: 400 }
      );
    }

    const bulkOps = faqs.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } },
      },
    }));

    await Faq.bulkWrite(bulkOps);

    return NextResponse.json({
      success: true,
      message: "FAQs reordered successfully",
    });
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error ? error.message : "Something went wrong";

    console.error("GET /api/faq-categories error:", errMsg);

    return NextResponse.json(
      { success: false, error: errMsg },
      { status: 500 }
    );
  }
}
