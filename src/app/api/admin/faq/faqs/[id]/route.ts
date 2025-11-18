import { NextRequest, NextResponse } from "next/server";
import Faq from "@/models/Faq";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } =await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid FAQ ID" },
        { status: 400 }
      );
    }

    const faq = await Faq.findById(id).populate("categoryId", "name").lean();

    // if (!faq || !faq.isActive) {
    //   return NextResponse.json(
    //     { success: false, error: "FAQ not found" },
    //     { status: 404 }
    //   );
    // }

    return NextResponse.json({
      success: true,
      data: faq,
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

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } =await context.params;
    const body = await request.json();
    const { question, answer, order, isActive } = body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid FAQ ID" },
        { status: 400 }
      );
    }

    // Validation
    if (question && question.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: "Question must be at least 5 characters" },
        { status: 400 }
      );
    }

    if (answer && answer.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Answer must be at least 10 characters" },
        { status: 400 }
      );
    }

    const updateData: {question:string, answer:string, order:number, isActive:boolean} = {
      question: "",
      answer: "",
      order: 0,
      isActive: false
    };
    if (question !== undefined) updateData.question = question.trim();
    if (answer !== undefined) updateData.answer = answer.trim();
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    const faq = await Faq.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("categoryId", "name");

    if (!faq) {
      return NextResponse.json(
        { success: false, error: "FAQ not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: faq,
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

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } =await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid FAQ ID" },
        { status: 400 }
      );
    }

    const faq = await Faq.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    );

    if (!faq) {
      return NextResponse.json(
        { success: false, error: "FAQ not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "FAQ deleted successfully",
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
