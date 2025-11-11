import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import FundingFirm from "@/models/FirmDetails";
import AuditLog from "@/models/AuditLog";
import { currentUser } from "@clerk/nextjs/server";
import { uploadToCloudinary } from "@/services/cloudinary";
type ChangeEntry = {
  field: string;
  oldValue: unknown;
  newValue: unknown;
};

type ChangeLog = Record<string, ChangeEntry[]>;

export async function POST(request: NextRequest) {
  await connectDB();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = user.id;
    const userName =
      user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim();
    const userRole = user.publicMetadata?.role || "User";

    const formData = await request.formData();

    const firmData = Object.fromEntries(formData.entries());

    // Extract image file
    const imageFile = formData.get("firmDetails.imageFile") as File | null;

    let imageMeta = null;

    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      const uploadResult = await uploadToCloudinary(imageFile);

      if (!uploadResult.success) {
        return Response.json(
          { success: false, message: uploadResult.message },
          { status: 400 }
        );
      }

      imageMeta = {
        url: uploadResult.url,
        publicId: uploadResult.public_id,
        thumbnail: uploadResult.thumbnail_url,
      };
    }

    // Parse nested JSON fields
    const parseNested = (key: string) => {
      const val = formData.get(key);
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return {};
        }
      }
      return {};
    };

    const body = {
      firmDetails: {
        ...parseNested("firmDetails"),
        image: imageMeta, // ← inject Cloudinary result
      },
      leadership: parseNested("leadership"),
      ratings: parseNested("ratings"),
      socialLinks: parseNested("socialLinks"),
      support: parseNested("support"),
      compliance: parseNested("compliance"),
      transparency: parseNested("transparency"),
      trading: parseNested("trading"),
      payments: parseNested("payments"),
    };

    // Remove the temporary imageFile from firmDetails
    delete (body.firmDetails ).imageFile;
    // 1. Create the firm
    const firm = await FundingFirm.create(body);

    // 2. Build grouped audit changes
    const changes: ChangeLog = {};

    Object.entries(body).forEach(([section, fields]) => {
      if (typeof fields === "object" && fields !== null) {
        changes[section] = Object.entries(fields).map(([field, newValue]) => ({
          field,
          oldValue: null,
          newValue,
        }));
      } else {
        if (!changes["root"]) changes["root"] = [];
        changes["root"].push({
          field: section,
          oldValue: null,
          newValue: fields,
        });
      }
    });

    // 3. Save audit log
    await AuditLog.create(
      [
        {
          userId,
          userName,
          userRole,
          entity: "Firm",
          entityId: firm._id,
          action: "CREATE",
          changes,
        },
      ],
      { session }
    );

    // 4. Commit both
    await session.commitTransaction();

    return NextResponse.json(
      {
        success: true,
        message: "Funding firm created successfully",
        data: firm,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating firm:", error);
    await session.abortTransaction();

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create funding firm",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const firms = await FundingFirm.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await FundingFirm.countDocuments();

    return NextResponse.json({
      success: true,
      data: firms,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error Fetching firm:", error);

    const err = error instanceof Error ? error : new Error(String(error));

    return NextResponse.json(
      {
        success: false,
        message: "Failed to Fetch funding firm",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
