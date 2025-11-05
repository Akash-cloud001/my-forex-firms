import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Program from "@/models/FirmProgram";

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

    const program = await Program.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!program) {
      return NextResponse.json(
        { success: false, message: "Program not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Program updated successfully",
      data: program,
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
