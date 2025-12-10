import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { auth } from '@clerk/nextjs/server';
import Review from '@/models/Review';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // Get user authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: reviewId } = await params;
    const updateData = await request.json();


    // Find and update review in MongoDB
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        ...updateData,
        lastModifiedBy: userId,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      review: updatedReview,
      message: 'Review updated successfully'
    });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

