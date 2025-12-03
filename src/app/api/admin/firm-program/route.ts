import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Program from "@/models/FirmProgram";
import AuditLog from "@/models/AuditLog";
import { currentUser } from "@clerk/nextjs/server";

type ChangeEntry<T> = {
  field: keyof T;
  oldValue: T[keyof T] | null;
  newValue: T[keyof T];
};

type ChangeLog<T> = Record<string, ChangeEntry<T>[]>;

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await currentUser();

      if (!user) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
      }

      const body = await req.json();

      if (!body.propFirmId || !body.name || !body.type) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json(
          { success: false, message: "Missing required fields" },
          { status: 400 }
        );
      }

      const userId = user.id;
      const userName =
        user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim();
      const userRole = user.publicMetadata?.role || "User";

      const [program] = await Program.create([body], { session });

      const changes: ChangeLog<typeof body> = {
        program: Object.entries(body).map(([field, newValue]) => ({
          field,
          oldValue: null,
          newValue,
        })),
      };

      await AuditLog.create(
        [
          {
            userId,
            userName,
            userRole,
            entity: "Program",
            entityId: program._id,
            action: "CREATE",
            changes,
          },
        ],
        { session }
      );

      await session.commitTransaction(); session.endSession();

      return NextResponse.json(
        {
          success: true,
          message: "Program created successfully",
          data: program,
        },
        { status: 201 }
      );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error("Error creating program:", error);

    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create program",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const propFirmId = url.searchParams.get("propFirmId");

    const query: { propFirmId?: mongoose.Types.ObjectId } = {};

    if (propFirmId) {
      query.propFirmId = new mongoose.Types.ObjectId(propFirmId);
    }

    const programs = await Program.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: programs,
    });
  } catch (error) {
    console.error("Error fetching programs:", error);
    const err = error instanceof Error ? error : new Error(String(error));

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch programs",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
