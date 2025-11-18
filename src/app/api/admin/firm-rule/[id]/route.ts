import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import firmRule from "@/models/firmRule";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

    const { id:firmId } =await context.params;

    if (!mongoose.Types.ObjectId.isValid(firmId)) {
      return NextResponse.json(
        { success: false, message: "Invalid firm ID" },
        { status: 400 }
      );
    }

    const rule = await firmRule.findOne({ firmId }).lean();

    if (!rule) {
      return NextResponse.json(
        { success: false, message: "No FirmRule found for this firm" },
        { status: 404 }
      );
    }

    return NextResponse.json(rule, { status: 200 });

  }catch (error: unknown) {
    const errMsg =
      error instanceof Error ? error.message : "Something went wrong";

    console.error("GET /api/faq-categories error:", errMsg);

    return NextResponse.json(
      { success: false, error: errMsg },
      { status: 500 }
    );
  }
}


export async function PATCH(req: Request,  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id: firmId } =await context.params;
    const body = await req.json();

    const { categories } = body;

    if (!firmId) {
      return NextResponse.json(
        { success: false, message: "firmId is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json(
        { success: false, message: "Categories array is required" },
        { status: 400 }
      );
    }

    const existingRule = await firmRule.findOne({ firmId });

    if (!existingRule) {
      return NextResponse.json(
        { success: false, message: "Firm Rule not found for this firm" },
        { status: 404 }
      );
    }

    existingRule.categories = categories;
    await existingRule.save();

    return NextResponse.json(
      {
        success: true,
        message: "Firm Rule updated successfully",
        data: existingRule,
      },
      { status: 200 }
    );
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

