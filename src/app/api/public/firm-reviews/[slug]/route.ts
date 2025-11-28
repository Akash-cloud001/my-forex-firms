import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FirmReviewModel from '@/models/FirmReview';

// GET /api/public/firm-reviews/[slug] - Get published review by slug (public, no auth required)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();

        const { slug } = await params;

        const review = await FirmReviewModel.findOne({ slug }).lean();

        if (!review) {
            return NextResponse.json(
                { error: 'Review not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            review
        });

    } catch (error) {
        console.error('Error fetching firm review:', error);
        return NextResponse.json(
            { error: 'Failed to fetch firm review' },
            { status: 500 }
        );
    }
}

