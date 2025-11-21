import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Faq from "@/models/Faq";
import FaqCategory from "@/models/FaqCategory";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get("category")?.trim();

    // Build base filter - only active FAQs
    const filter: {
      isActive: boolean;
      categoryId?: mongoose.Types.ObjectId | { $in: mongoose.Types.ObjectId[] };
    } = {
      isActive: true,
    };

    // Handle category filtering
    if (categoryParam) {
      let categoryId: mongoose.Types.ObjectId | null = null;

      // Try to match as ObjectId first
      if (mongoose.Types.ObjectId.isValid(categoryParam)) {
        // Check if category exists and is active
        const category = await FaqCategory.findOne({
          _id: categoryParam,
          isActive: true,
        }).lean();

        if (category) {
          categoryId = new mongoose.Types.ObjectId(categoryParam);
        }
      } else {
        // Try to match by category name (case-insensitive)
        const category = await FaqCategory.findOne({
          name: { $regex: new RegExp(`^${categoryParam}$`, "i") },
          isActive: true,
        }).lean();

        if (category) {
          categoryId = category._id as mongoose.Types.ObjectId;
        }
      }

      // If category found, filter by it; otherwise return empty array
      if (categoryId) {
        filter.categoryId = categoryId;
      } else {
        // Category not found or inactive - return empty result
        return NextResponse.json({
          success: true,
          data: [],
        });
      }
    } else {
      // No category filter - get all active categories and filter FAQs by them
      const activeCategories = await FaqCategory.find({ isActive: true })
        .select("_id")
        .lean();

      if (activeCategories.length > 0) {
        const activeCategoryIds = activeCategories.map(
          (cat) => cat._id as mongoose.Types.ObjectId
        );
        filter.categoryId = { $in: activeCategoryIds };
      } else {
        // No active categories - return empty result
        return NextResponse.json({
          success: true,
          data: [],
        });
      }
    }

    // Fetch FAQs with populated category information
    const faqs = await Faq.find(filter)
      .populate("categoryId", "name _id")
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: faqs,
    });
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error ? error.message : "Something went wrong";

    console.error("GET /api/public/faqs error:", errMsg);

    return NextResponse.json(
      {
        success: false,
        error: errMsg,
      },
      { status: 500 }
    );
  }
}

