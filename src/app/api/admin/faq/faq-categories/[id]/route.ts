import { NextRequest, NextResponse } from "next/server";
import FaqCategory from "@/models/FaqCategory";
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
        { success: false, error: "Invalid category ID" },
        { status: 400 }
      );
    }

    const category = await FaqCategory.findById(id).lean();

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    // Fetch FAQs for this category
    const faqs = await Faq.find({ categoryId: id }).sort({ order: 1 }).lean();

    return NextResponse.json({
      success: true,
      data: { ...category, faqs },
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

    const { id } = await context.params;
    const body = await request.json();
    const { name, description, isActive } = body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid category ID" },
        { status: 400 }
      );
    }

    // Validation
    if (name && name.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: "Category name must be at least 2 characters",
        },
        { status: 400 }
      );
    }

    if (name) {
      const existingCategory = await FaqCategory.findOne({
        name: name.trim(),
        _id: { $ne: id },
        isActive: true,
      });

      if (existingCategory) {
        return NextResponse.json(
          { success: false, error: "Category with this name already exists" },
          { status: 409 }
        );
      }
    }

    const updateData:{
      name:string,description:string, isActive:boolean
    } = {
      name: "",
      description: "",
      isActive: false
    };
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (isActive !== undefined) updateData.isActive = isActive;

    const category = await FaqCategory.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
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

    const { id } = await context.params;


    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid category ID" },
        { status: 400 }
      );
    }

    const category = await FaqCategory.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    );

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    await Faq.updateMany({ categoryId: id }, { $set: { isActive: false } });

    return NextResponse.json({
      success: true,
      message: "Category and its FAQs deleted successfully",
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
