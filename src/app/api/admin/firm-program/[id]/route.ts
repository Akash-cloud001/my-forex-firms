import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Program from "@/models/FirmProgram";
import AuditLog from "@/models/AuditLog";
import { currentUser } from "@clerk/nextjs/server";

type ChangeEntry<T> = {
  field: keyof T;
  oldValue: T[keyof T] | null;
  newValue: T[keyof T];
};

// type ChangeLog<T> = Record<string, ChangeEntry<T>[]>;

export async function GET(
  req: NextRequest,
 context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    await connectDB();
    const program = await Program.findById(id);

    if (!program) {
      return NextResponse.json(
        { success: false, message: "Program not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: program });
  } catch (error) {
    console.error("Error fetching program:", error);
    const err = error instanceof Error ? error : new Error(String(error));

    return NextResponse.json(
      { success: false, message: "Failed to fetch program", error: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await connectDB();
    const updates = await req.json();

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;
    const userName =
      user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim();
    const userRole = user.publicMetadata?.role || "User";

    const existing = await Program.findById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Program not found" },
        { status: 404 }
      );
    }

    const updated = await Program.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    // --- Build audit changes ---
     const programChanges: ChangeEntry<typeof updates>[] = [];

    for (const key in updates) {
      const oldValue = existing.get(key);
      const newValue = updates[key];
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        programChanges.push({ field: key, oldValue, newValue });
      }
    }

    if (programChanges.length > 0) {
      await AuditLog.create({
        userId,
        userName,
        userRole,
        entity: "Program",
        entityId: id,
        action: "UPDATE",
        changes: {
          program: programChanges,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Program updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating program:", error);
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json(
      { success: false, message: "Failed to update program", error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
      const { id } = await context.params;

  try {
    await connectDB();

    const deleted = await Program.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Program not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Program deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting program:", error);
    const err = error instanceof Error ? error : new Error(String(error));

    return NextResponse.json(
      { success: false, message: "Failed to delete program", error: err.message },
      { status: 500 }
    );
  }
}
