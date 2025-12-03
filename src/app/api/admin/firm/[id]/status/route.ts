import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import FundingFirm from "@/models/FirmDetails";
import { currentUser } from "@clerk/nextjs/server";
import AuditLog from "@/models/AuditLog";

export async function PATCH(
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
        const user = await currentUser();
        const body = await request.json();
        const { status } = body;

        const validStatuses = ["Active", "Inactive", "Under Review", "Suspended"];

        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json(
                { success: false, message: "Invalid status value." },
                { status: 400 }
            );
        }

        const existingFirm = await FundingFirm.findById(id);
        if (!existingFirm) {
            return NextResponse.json(
                { success: false, message: "Firm not found" },
                { status: 404 }
            );
        }

        const oldStatus = existingFirm.firmDetails.status;

        // If status is same, do nothing
        if (oldStatus === status) {
            return NextResponse.json({
                success: true,
                message: "Status is already set to " + status,
                data: existingFirm
            });
        }

        const updatedFirm = await FundingFirm.findByIdAndUpdate(
            id,
            { $set: { "firmDetails.status": status } },
            { new: true }
        );

        // Audit Log
        // const userId = user.id;
        // const userName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
        // const userRole = user.publicMetadata?.role || "User";

        // await AuditLog.create({
        //     userId,
        //     userName,
        //     userRole,
        //     entity: "Firm",
        //     entityId: id,
        //     action: "UPDATE_STATUS",
        //     changes: {
        //         firmDetails: [
        //             {
        //                 field: "status",
        //                 oldValue: oldStatus,
        //                 newValue: status,
        //             },
        //         ],
        //     },
        // });

        return NextResponse.json({
            success: true,
            message: "Firm status updated successfully",
            data: updatedFirm,
        });

    } catch (error) {
        console.error("Error updating firm status:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update firm status",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
