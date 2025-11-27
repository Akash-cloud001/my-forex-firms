import { NextRequest, NextResponse } from "next/server";
import FaqCategory from "@/models/FaqCategory";
import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    const categories = await FaqCategory.aggregate([
      { $match: { isActive: true } },

      {
        $lookup: {
          from: "faqs",
          localField: "_id",
          foreignField: "categoryId",
          as: "faqs"
        }
      },

      {
        $addFields: {
          totalFaq: { $size: "$faqs" }
        }
      },

      {
        $project: {
          faqs: 0
        }
      },

      { $sort: { createdAt: -1 } }
    ]);

    return NextResponse.json({
      success: true,
      data: categories,
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
    const { name, description } = body;

    // Validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Category name is required (min 2 characters)" },
        { status: 400 }
      );
    }

    // Check for duplicate name
    const existingCategory = await FaqCategory.findOne({
      name: name.trim(),
      isActive: true
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: "Category with this name already exists" },
        { status: 409 }
      );
    }

    const category = await FaqCategory.create({
      name: name.trim(),
      description: description?.trim() || "",
      isActive: true,
    });

    return NextResponse.json(
      { success: true, data: category },
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
