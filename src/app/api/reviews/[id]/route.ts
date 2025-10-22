import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { auth } from '@clerk/nextjs/server';
import Review from '@/models/Review';
import { cleanupReviewFiles } from '@/lib/reviewFileUtils';

// Type for review data
interface ReviewData {
  userId: string;
  firmId?: string;
  firmName: string;
  customFirmName?: string;
  issueType: string;
  customIssueType?: string;
  description: string;
  rating: number;
  files?: Array<{
    name: string;
    type: string;
    size: number;
    url: string;
  }>;
  status?: 'pending' | 'approved' | 'rejected';
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const reviewId = params.id;
    
    // Find review by ID in MongoDB
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ review });
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json(
      { error: 'Failed to fetch review' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    
    const reviewId = params.id;
    const updateData = await request.json();
    
    // Validate the update data
    if (updateData.description && updateData.description.length < 50) {
      return NextResponse.json(
        { error: 'Description must be at least 50 characters' },
        { status: 400 }
      );
    }
    
    if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
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
    
    if (!updatedReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    
    const reviewId = params.id;
    
    // Find the review first to access its files
    const review = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }
    
    // Clean up files from BunnyCDN
    if (review.files && review.files.length > 0) {
      await cleanupReviewFiles(review.files);
    }
    
    // Delete the review from database
    await Review.findByIdAndDelete(reviewId);
    
    return NextResponse.json({
      message: 'Review deleted successfully',
      deletedId: reviewId
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}
