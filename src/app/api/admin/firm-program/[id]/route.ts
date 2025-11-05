import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Program from "@/models/FirmProgram";
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const program = await Program.findById(params.id);

    if (!program) {
      return NextResponse.json(
        { success: false, message: "Program not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: program });
  } catch (error: any) {
    console.error("Error fetching program:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch program", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const updates = await req.json();

    const program = await Program.findByIdAndUpdate(params.id, updates, {
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
  } catch (error: any) {
    console.error("Error updating program:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update program", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const deleted = await Program.findByIdAndDelete(params.id);

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
  } catch (error: any) {
    console.error("Error deleting program:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete program", error: error.message },
      { status: 500 }
    );
  }
}
