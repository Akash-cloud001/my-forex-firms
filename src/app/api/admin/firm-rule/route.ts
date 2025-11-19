import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";  
import firmRule from "@/models/firmRule";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { firmId, categories } = body;

    if (!firmId) {
      return NextResponse.json(
        { success: false, message: "firmId is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one category is required" },
        { status: 400 }
      );
    }

    const existingRule = await firmRule.findOne({ firmId });

    if (existingRule) {
      existingRule.categories.push(...categories); 
      await existingRule.save();

      return NextResponse.json(
        {
          success: true,
          message: "Categories added to existing FirmRule",
          data: existingRule,
        },
        { status: 200 }
      );
    }

    const newRule = await firmRule.create({
      firmId,
      categories,
    });

    return NextResponse.json(
      {
        success: true,
        message: "FirmRule created successfully",
        data: newRule,
      },
      { status: 201 }
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

