import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { auth, clerkClient } from '@clerk/nextjs/server';
import Review from '@/models/Review';

// Helper function to check if user is admin
async function isAdmin(userId: string): Promise<boolean> {
  try {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    return user.publicMetadata?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get user authentication
    const { userId: authenticatedUserId } = await auth();
    
    if (!authenticatedUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const isUserAdmin = await isAdmin(authenticatedUserId);
    if (!isUserAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const firmId = searchParams.get('firmId');
    const firmName = searchParams.get('firmName');
    const issueType = searchParams.get('issueType');
    const rating = searchParams.get('rating');
    const status = searchParams.get('status');
    const isVerified = searchParams.get('isVerified');
    const dateRangeStart = searchParams.get('dateRangeStart');
    const dateRangeEnd = searchParams.get('dateRangeEnd');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Build query filters
    const query: Record<string, unknown> = {};
    
    if (firmId) query.firmId = firmId;
    if (firmName) query.firmName = { $regex: firmName, $options: 'i' };
    if (issueType) query.issueType = issueType;
    if (rating) query.rating = parseInt(rating);
    if (status) query.status = status;
    if (isVerified) query.isVerified = isVerified === 'true';
    
    // Date range filter
    if (dateRangeStart || dateRangeEnd) {
      query.createdAt = {} as Record<string, Date>;
      if (dateRangeStart) (query.createdAt as Record<string, Date>).$gte = new Date(dateRangeStart);
      if (dateRangeEnd) (query.createdAt as Record<string, Date>).$lte = new Date(dateRangeEnd);
    }
    
    // Build sort object
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Fetch reviews from MongoDB
    const reviews = await Review.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    
    const total = await Review.countDocuments(query);
    
    // Get unique user IDs from reviews
    const userIds = [...new Set(reviews.map(review => review.userId))];
    
    // Fetch user details from Clerk in batch
    const clerk = await clerkClient();
    const userDetailsMap = new Map();
    
    try {
      // Fetch all users in parallel
      const userPromises = userIds.map(async (userId) => {
        try {
          const user = await clerk.users.getUser(userId);
          return {
            id: userId,
            email: user.emailAddresses[0]?.emailAddress || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            imageUrl: user.imageUrl || '',
            role: user.publicMetadata?.role || 'user',
            createdAt: user.createdAt,
            lastSignInAt: user.lastSignInAt
          };
        } catch (error) {
          console.error(`Error fetching user ${userId}:`, error);
          return {
            id: userId,
            email: 'Unknown',
            firstName: 'Unknown',
            lastName: 'User',
            imageUrl: '',
            role: 'user',
            createdAt: 0,
            lastSignInAt: 0
          };
        }
      });
      
      const userDetails = await Promise.all(userPromises);
      
      // Create a map for quick lookup
      userDetails.forEach(user => {
        userDetailsMap.set(user.id, user);
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
    
    // Combine reviews with user details
    const reviewsWithUserDetails = reviews.map(review => ({
      ...review,
      userDetails: userDetailsMap.get(review.userId) || null
    }));
    
    return NextResponse.json({
      reviews: reviewsWithUserDetails,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching admin reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
