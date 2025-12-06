import FundingFirm from "@/models/FirmDetails";
import Review from "@/models/Review";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

export async function POST(request: Request) {
    try {
        await connectDB();

        const { firmId } = await request.json();
        if (!firmId) {
            return NextResponse.json({ error: "Firm ID is required" }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(firmId)) {
            return NextResponse.json({ error: "Invalid Firm ID" }, { status: 400 });
        }

        const existingFirm = await FundingFirm.findById(firmId);
        if (!existingFirm) {
            return NextResponse.json({ error: "Firm not found" }, { status: 404 });
        }

        const reviews = await Review.aggregate([
            {
                $match: {
                    firmId: new mongoose.Types.ObjectId(firmId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'userDetails'
                }
            },
            {
                $unwind: {
                    path: '$userDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    userName: {
                        $cond: {
                            if: { $ifNull: ["$userDetails.fullName", false] },
                            then: "$userDetails.fullName",
                            else: {
                                $cond: {
                                    if: { $ifNull: ["$userDetails.firstName", false] },
                                    then: {
                                        $trim: {
                                            input: {
                                                $concat: [
                                                    { $ifNull: ["$userDetails.firstName", ""] },
                                                    " ",
                                                    { $ifNull: ["$userDetails.lastName", ""] }
                                                ]
                                            }
                                        }
                                    },
                                    else: "Anonymous"
                                }
                            }
                        }
                    },
                    userImage: { $ifNull: ["$userDetails.imageUrl", null] },
                    firmName: 1,
                    issueCategory: 1,
                    issueType: 1,
                    description: 1,
                    createdAt: 1
                }
            }
        ]);

        return NextResponse.json(reviews);

    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
