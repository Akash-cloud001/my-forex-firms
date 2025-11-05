import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Program from "@/models/FirmProgram";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.propFirmId || !body.name || !body.type) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const program = await Program.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Program created successfully",
        data: program,
      },
      { status: 201 }
    );
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
