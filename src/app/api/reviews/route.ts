import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { auth } from '@clerk/nextjs/server';
import Review from '@/models/Review';
import { uploadToCloudinary } from '@/services/cloudinary';
import { validateReviewFile, cleanupReviewFiles } from '@/lib/reviewFileUtils';

// Type for review data
interface ReviewData {
  userId?: string;
  firmId?: string | "other";
  firmName?: string;
  customFirmName?: string;
  issueCategory?: string; // Added
  issueType?: string;
  customIssueType?: string;
  description?: string;
  files?: Array<{
    name: string;
    type: string;
    size: number;
    url: string;
    public_id?: string;
  }>;
  status?: 'pending' | 'approved' | 'rejected';
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Type for MongoDB query object
interface MongoQuery {
  [key: string]: string | number | boolean | Date | { $gte?: number | Date; $lte?: number | Date } | { $regex?: string; $options?: string } | { $search: string } | { $gte?: number | Date; $lte?: number | Date };
}

// Type for MongoDB sort object
interface MongoSort {
  [key: string]: 1 | -1;
}


export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get user authentication
    const { userId: authenticatedUserId } = await auth();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const firmId = searchParams.get('firmId');
    const firmName = searchParams.get('firmName');
    const issueCategory = searchParams.get('issueCategory');
    const issueType = searchParams.get('issueType');
    const status = searchParams.get('status');
    const isVerified = searchParams.get('isVerified');
    const userId = searchParams.get('userId');
    const dateRangeStart = searchParams.get('dateRangeStart');
    const dateRangeEnd = searchParams.get('dateRangeEnd');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const query: MongoQuery = {};

    // If userId is provided in query params, use it (for admin access)
    // Otherwise, filter by authenticated user for user-specific access
    if (userId) {
      query.userId = userId;
    } else if (authenticatedUserId) {
      // For regular users, only show their own reviews
      query.userId = authenticatedUserId;
    } else {
      // If no authentication and no userId specified, return empty results
      return NextResponse.json({
        reviews: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      });
    }

    // Build query filters
    if (firmId) query.firmId = firmId;
    if (firmName) query.firmName = { $regex: firmName, $options: 'i' };
    if (issueCategory) query.issueCategory = issueCategory; // Added
    if (issueType) query.issueType = issueType;
    if (status) query.status = status;
    if (isVerified) query.isVerified = isVerified === 'true';

    // Date range filter
    if (dateRangeStart || dateRangeEnd) {
      query.createdAt = {} as { $gte?: Date; $lte?: Date };
      if (dateRangeStart) query.createdAt.$gte = new Date(dateRangeStart);
      if (dateRangeEnd) query.createdAt.$lte = new Date(dateRangeEnd);
    }

    // Build sort object
    const sort: MongoSort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Use MongoDB model to fetch reviews
    const reviews = await Review.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(); // Use lean() for better performance

    const total = await Review.countDocuments(query);

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const contentType = request.headers.get('content-type');
    let reviewData: ReviewData = {};
    const files: File[] = [];

    if (contentType?.includes('multipart/form-data')) {
      // Handle FormData (with file upload)
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        if (key === 'files' && value instanceof File) {
          files.push(value);
        } else if (typeof value === 'string') {
          try {
            const parsedValue = JSON.parse(value);
            (reviewData as Record<string, unknown>)[key] = parsedValue;
          } catch {
            (reviewData as Record<string, unknown>)[key] = value;
          }
        }
      }
    } else {
      // Handle JSON data
      reviewData = await request.json();
    }

    // Validate required fields
    if (!reviewData.firmName) {
      return NextResponse.json(
        { error: 'Firm name is required' },
        { status: 400 }
      );
    }

    // Validate issueCategory is required now
    if (!reviewData.issueCategory) {
      return NextResponse.json(
        { error: 'Issue category is required' },
        { status: 400 }
      );
    }

    if (!reviewData.issueType) {
      return NextResponse.json(
        { error: 'Issue type is required' },
        { status: 400 }
      );
    }

    if (!reviewData.description || reviewData.description.length < 50) {
      return NextResponse.json(
        { error: 'Description must be at least 50 characters' },
        { status: 400 }
      );
    }


    // Validate custom fields
    if (reviewData.issueType?.startsWith('other-') && (!reviewData.customIssueType || reviewData.customIssueType.trim().length === 0)) {
      return NextResponse.json(
        { error: 'Custom issue type is required when "Other" is selected' },
        { status: 400 }
      );
    }

    if (reviewData.firmName === 'Other' && (!reviewData.customFirmName || reviewData.customFirmName.trim().length === 0)) {
      return NextResponse.json(
        { error: 'Custom firm name is required when "Other" is selected' },
        { status: 400 }
      );
    }

    // Validate that at least one file is required
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'At least one document/file is required' },
        { status: 400 }
      );
    }

    // Process file uploads to Cloudinary
    const processedFiles = [];

    // console.log(`Processing ${files.length} files for upload to Cloudinary`);

    for (const file of files) {
      try {
        // Validate file using utility function
        const validation = validateReviewFile(file);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }

        // Upload to Cloudinary
        const uploadResult = await uploadToCloudinary(
          file,
          'review-attachments' // Folder for review files
        );

        if (!uploadResult.success) {
          throw new Error(uploadResult.message || 'Failed to upload file to Cloudinary');
        }

        processedFiles.push({
          name: file.name,
          type: file.type,
          size: file.size,
          url: uploadResult.url,
          public_id: uploadResult.public_id,
          thumbnail_url: uploadResult.thumbnail_url,
          thumbnail_public_id: uploadResult.thumbnail_public_id,
          uploadedAt: new Date()
        });

        // console.log(`Successfully uploaded ${file.name} to Cloudinary: ${uploadResult}`);
      } catch (fileError) {
        console.error(`Failed to upload file ${file.name}:`, fileError);

        // If file upload fails, we can either:
        // 1. Continue without the file (current approach)
        // 2. Fail the entire review submission
        // For now, we'll continue without the problematic file
        console.warn(`Skipping file ${file.name} due to upload error: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`);
      }
    }

    // Ensure at least one file was successfully uploaded
    if (processedFiles.length === 0) {
      return NextResponse.json(
        { error: 'Failed to upload files. Please ensure at least one valid file is provided.' },
        { status: 400 }
      );
    }

    // Create review object
    const newReview = new Review({
      userId,
      firmId: reviewData.firmId === "other" ? null : reviewData.firmId,
      firmName: reviewData.firmName === 'Other' ? reviewData.customFirmName : reviewData.firmName,
      customFirmName: reviewData.firmName === 'Other' ? reviewData.customFirmName : undefined,
      issueCategory: reviewData.issueCategory, // Added
      issueType: reviewData.issueType,
      customIssueType: reviewData.issueType?.startsWith('other-') ? reviewData.customIssueType : undefined,
      description: reviewData.description,
      files: processedFiles,
      status: 'pending',
      isVerified: false,
      createdBy: userId,
      lastModifiedBy: userId
    });
    console.log(newReview, "newReview")
    // Save to MongoDB
    const savedReview = await newReview.save();

    return NextResponse.json({
      review: savedReview,
      message: 'Review submitted successfully'
    });
  } catch (error) {
    console.error('Error creating review:', error);

    // Handle specific MongoDB errors
    if (error instanceof Error) {
      if (error.message.includes('ETIMEOUT')) {
        return NextResponse.json(
          { error: 'Database connection timeout. Please try again.' },
          { status: 503 }
        );
      }
      if (error.message.includes('ENOTFOUND')) {
        return NextResponse.json(
          { error: 'Database server not found. Please check your connection.' },
          { status: 503 }
        );
      }
      // Handle Cloudinary errors
      if (error.message.includes('Cloudinary')) {
        return NextResponse.json(
          { error: error.message || 'File upload failed. Please try again.' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to create review. Please try again.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('reviewId');
    const deleteAll = searchParams.get('deleteAll') === 'true';

    if (!reviewId && !deleteAll) {
      return NextResponse.json(
        { error: 'Review ID is required for single deletion, or use deleteAll=true for bulk deletion' },
        { status: 400 }
      );
    }

    // Perform MongoDB delete operation
    if (deleteAll) {
      // Get all reviews to clean up their files
      const allReviews = await Review.find({});
      const allFiles = allReviews.flatMap(review => review.files || []);

      // Clean up files (supports both Cloudinary and legacy BunnyCDN)
      if (allFiles.length > 0) {
        await cleanupReviewFiles(allFiles);
      }

      const result = await Review.deleteMany({});
      return NextResponse.json({
        message: 'All reviews deleted successfully',
        deletedCount: result.deletedCount
      });
    } else {
      // Get the review first to access its files
      const review = await Review.findById(reviewId);
      if (!review) {
        return NextResponse.json(
          { error: 'Review not found' },
          { status: 404 }
        );
      }

      // Clean up files (supports both Cloudinary and legacy BunnyCDN)
      if (review.files && review.files.length > 0) {
        await cleanupReviewFiles(review.files);
      }

      // Delete the review from database
      await Review.findByIdAndDelete(reviewId);

      return NextResponse.json({
        message: 'Review deleted successfully',
        deletedId: reviewId
      });
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}
