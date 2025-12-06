import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import User from '@/models/User';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        // Fix: auth() is synchronous
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const adminUser = await User.findOne({ userId }).lean();
        if (!adminUser || !['admin', 'moderator'].includes(adminUser.role)) {
            return NextResponse.json(
                { error: 'Only admins or moderators can request information' },
                { status: 403 }
            );
        }

        const { reviewId, subject, message } = await request.json();
        if (!reviewId || !message?.trim()) {
            return NextResponse.json(
                { error: 'Review ID and message are required' },
                { status: 400 }
            );
        }

        const review = await Review.findById(reviewId).exec();
        if (!review) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 });
        }
        if (review.status === "approved" || review.status === "rejected") {
            return NextResponse.json({ error: 'Review is already approved or rejected' }, { status: 400 });
        }

        const role = adminUser.role as 'admin' | 'moderator';

        await review.requestMoreInfo(
            userId,
            role,
            message.trim(),
            {
                senderName: adminUser.fullName,
                subject: subject?.trim()
            }
        );

        return NextResponse.json({
            review,
            message: 'Information request sent!'
        });

    } catch (error) {
        console.error('Error requesting info:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
