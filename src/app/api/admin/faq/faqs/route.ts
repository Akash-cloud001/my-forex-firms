import { NextRequest, NextResponse } from "next/server";
import Faq from "@/models/Faq";
import FaqCategory from "@/models/FaqCategory";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const filter:{categoryId:string, isActive:boolean} = {
      isActive: true,
      categoryId: ""
    };
    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      filter.categoryId = categoryId;
    }

    const faqs = await Faq.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .populate("categoryId", "name")
      .lean();

    return NextResponse.json({
      success: true,
      data: faqs,
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


export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { question, answer, categoryId, order } = body;

    // Validation
    if (!question || question.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: "Question is required (min 5 characters)" },
        { status: 400 }
      );
    }

    if (!answer || answer.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Answer is required (min 10 characters)" },
        { status: 400 }
      );
    }

    if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { success: false, error: "Valid category ID is required" },
        { status: 400 }
      );
    }

    const category = await FaqCategory.findById(categoryId);
    if (!category || !category.isActive) {
      return NextResponse.json(
        { success: false, error: "Category not found or inactive" },
        { status: 404 }
      );
    }

    let faqOrder = order ?? 0;
    if (order === undefined) {
      const maxOrderFaq = await Faq.findOne({ categoryId })
        .sort({ order: -1 })
        .select("order")
        .lean();
      faqOrder = maxOrderFaq ? maxOrderFaq.order + 1 : 0;
    }

    const faq = await Faq.create({
      question: question.trim(),
      answer: answer.trim(),
      categoryId,
      order: faqOrder,
      isActive: true,
    });

    const populatedFaq = await Faq.findById(faq._id)
      .populate("categoryId", "name")
      .lean();

    return NextResponse.json(
      { success: true, data: populatedFaq },
      { status: 201 }
    );
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

