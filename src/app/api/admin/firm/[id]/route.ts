import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import FundingFirm from "@/models/FirmDetails";
import { firmFormSchema } from "@/components/crm/firm-management/add-firm/schema/schema";
import { currentUser } from "@clerk/nextjs/server";
import AuditLog from "@/models/AuditLog";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "@/services/cloudinary";
// type ChangeEntry = {
//   field: string;
//   oldValue: unknown;
//   newValue: unknown;
// };

interface Change {
  field: string;
  oldValue: string | number | boolean | object | null;
  newValue: string | number | boolean | object | null;
}

interface ChangeLog {
  [section: string]: Change[];
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid firm ID" },
        { status: 400 }
      );
    }

    const result = await FundingFirm.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "programs",
          localField: "_id",
          foreignField: "propFirmId",
          as: "programs",
        },
      },
      {
        $addFields: {
          totalPrograms: { $size: "$programs" },
        },
      },
    ]);

    if (!result || result.length === 0) {
      return NextResponse.json(
        { success: false, message: "Firm not found" },
        { status: 404 }
      );
    }

    const firm = result[0];

    return NextResponse.json({
      success: true,
      message: "Firm details with programs fetched successfully",
      data: firm,
    });
  } catch (error) {
    console.error("Error fetching firm with programs:", error);
    const err = error instanceof Error ? error : new Error(String(error));

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch firm details",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const firmId = (await context.params).id;

  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = user.id;
    const userName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    const userRole = user.publicMetadata?.role || "User";

    // ---------- 1. Parse multipart/form-data ----------
    const formData = await request.formData();

    const parseJSON = (key: string) => {
      const raw = formData.get(key);
      if (typeof raw === "string") {
        try {
          return JSON.parse(raw);
        } catch {
          return {};
        }
      }
      return {};
    };

    const firmDetailsRaw = parseJSON("firmDetails");
    const imageFile = formData.get("firmDetails.imageFile") as File | null;
    const keepExistingImage = formData.get("firmDetails.image"); // JSON string or null

    // ---------- 2. Find existing firm ----------
    const existingFirm = await FundingFirm.findById(firmId);
    if (!existingFirm) {
      return NextResponse.json(
        { success: false, message: "Firm not found" },
        { status: 404 }
      );
    }

    // ---------- 3. Handle image ----------
    let imageMeta = null;
    // const existingImage = existingFirm.firmDetails?.image;
    // CASE A: user removed the image completely (no file, no keepExisting)
    const shouldDeleteOld =
      existingFirm.firmDetails?.image?.publicId &&
      !imageFile &&
      !keepExistingImage;

    // CASE B: user uploaded a new image
    if (imageFile && imageFile.size > 0) {
      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, message: "Image must be ≤ 5 MB" },
          { status: 400 }
        );
      }

      const upload = await uploadToCloudinary(imageFile, "funding-firms/logos");
      if (!upload.success) {
        return NextResponse.json(
          { success: false, message: upload.message ?? "Upload failed" },
          { status: 400 }
        );
      }

      imageMeta = {
        url: upload.url,
        publicId: upload.public_id,
        thumbnail: upload.thumbnail_url,
      };

      // Delete old image if a new one is uploaded
      if (existingFirm.firmDetails?.image?.publicId) {
        await deleteFromCloudinary(existingFirm?.firmDetails.image.publicId);
      }
    }
    // CASE C: keep existing image
    else if (keepExistingImage) {
      try {
        imageMeta = JSON.parse(keepExistingImage as string);
      } catch {
        // fallback to DB value
        imageMeta = existingFirm.firmDetails?.image ?? null;
      }
    }
    // CASE D: no image at all → imageMeta stays null

    // ---------- 4. Build final payload ----------
    const payload = {
      firmDetails: {
        ...firmDetailsRaw,
        image: imageMeta, // null or object
      },
      leadership: parseJSON("leadership"),
      ratings: parseJSON("ratings"),
      socialLinks: parseJSON("socialLinks"),
      support: parseJSON("support"),
      compliance: parseJSON("compliance"),
      transparency: parseJSON("transparency"),
      trading: parseJSON("trading"),
      payments: parseJSON("payments"),
    };

    // ---------- 5. Zod validation ----------
    const validation = firmFormSchema.safeParse(payload);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    const validatedData = validation.data;

    // ---------- 6. Delete old image if needed ----------
    if (shouldDeleteOld) {
  const oldPublicId = existingFirm?.firmDetails?.image?.publicId;
  if (typeof oldPublicId === "string" && oldPublicId.trim().length > 0) {
    await deleteFromCloudinary(oldPublicId);
  }
}


    // ---------- 7. Update DB ----------
    const nestedPaths = [
      "firmDetails",
      "leadership",
      "ratings",
      "socialLinks",
      "support",
      "compliance",
      "transparency",
      "trading",
      "payments",
    ];

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    nestedPaths.forEach((section) => {
      const sectionData = validatedData[section as keyof typeof validatedData];
      if (sectionData && typeof sectionData === "object") {
        Object.entries(sectionData).forEach(([field, value]) => {
          updateData[`${section}.${field}`] = value;
        });
      }
    });

    const updatedFirm = await FundingFirm.findByIdAndUpdate(
      firmId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedFirm) {
      return NextResponse.json(
        { success: false, message: "Failed to update firm" },
        { status: 500 }
      );
    }

    // ---------- 8. Audit log ----------
    const changes: ChangeLog  = {};
    for (const key in updateData) {
      if (key === "updatedAt") continue;
      const [section, field] = key.split(".");

      const getNestedValue = <T extends object>(
        obj: T | null,
        path: string
      ): string | number | boolean | object | null => {
        return path.split(".").reduce<string | number | boolean | object | null>(
          (acc, curr) =>
            acc && typeof acc === "object" && curr in acc
              ? (acc as Record<string, string | number | boolean | object | null>)[curr]
              : null,
          obj
        );
      };

      const oldValue = getNestedValue(existingFirm, key);
      const newValue = getNestedValue(updatedFirm, key);

      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        if (!changes[section]) changes[section] = [];
        changes[section].push({ field, oldValue, newValue });
      }
    }

    if (Object.keys(changes).length > 0) {
      await AuditLog.create({
        userId,
        userName,
        userRole,
        entity: "Firm",
        entityId: firmId,
        action: "UPDATE",
        changes,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Firm updated successfully",
        data: updatedFirm,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/admin/firm/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
