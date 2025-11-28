import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import FirmReviewModel from '@/models/FirmReview';
import { FirmReview } from '@/types/firm-review';

// Helper function to check admin/editor access
async function checkAdminAccess() {
    const { userId } = await auth();
    
    if (!userId) {
        return { authorized: false, error: 'Unauthorized', status: 401 };
    }

    const clerk = await clerkClient();
    const currentUser = await clerk.users.getUser(userId);
    const userRole = currentUser.publicMetadata?.role as string | undefined;
    const allowedRoles = ['admin', 'editor'];
    
    if (!userRole || !allowedRoles.includes(userRole)) {
        return { authorized: false, error: 'Admin or editor access required', status: 403 };
    }

    return { authorized: true, userId };
}

// POST /api/admin/firm-reviews - Create new firm review
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const accessCheck = await checkAdminAccess();
        if (!accessCheck.authorized) {
            return NextResponse.json(
                { error: accessCheck.error },
                { status: accessCheck.status }
            );
        }

        const body: FirmReview = await request.json();

        // Validate required fields
        const missingFields: string[] = [];
        if (!body.firmName || body.firmName.trim() === '') missingFields.push('firmName');
        if (!body.title || body.title.trim() === '') missingFields.push('title');
        if (!body.slug || body.slug.trim() === '') missingFields.push('slug');
        
        if (missingFields.length > 0) {
            return NextResponse.json(
                { 
                    error: 'Missing required fields',
                    missingFields,
                    message: `The following fields are required: ${missingFields.join(', ')}`
                },
                { status: 400 }
            );
        }

        // Validate slug format (must end with "-review")
        if (!body.slug.endsWith('-review')) {
            return NextResponse.json(
                { 
                    error: 'Invalid slug format',
                    message: 'Slug must end with "-review" (e.g., "firm-name-review")'
                },
                { status: 400 }
            );
        }

        // Validate slug format (no spaces, lowercase)
        const slugPattern = /^[a-z0-9-]+-review$/;
        if (!slugPattern.test(body.slug)) {
            return NextResponse.json(
                { 
                    error: 'Invalid slug format',
                    message: 'Slug must contain only lowercase letters, numbers, and hyphens, and end with "-review"'
                },
                { status: 400 }
            );
        }

        // Check if slug already exists
        const existingReview = await FirmReviewModel.findOne({ slug: body.slug });
        if (existingReview) {
            return NextResponse.json(
                { error: 'A review with this slug already exists' },
                { status: 409 }
            );
        }

        // Create new review
        const newReview = new FirmReviewModel(body);
        const savedReview = await newReview.save();

        return NextResponse.json({
            success: true,
            review: savedReview
        }, { status: 201 });

    } catch (error: unknown) {
        console.error('Error creating firm review:', error);
        
        if (error instanceof Error) {
            // Handle duplicate key error
            if (error.message.includes('E11000') || error.message.includes('duplicate')) {
                return NextResponse.json(
                    { error: 'A review with this slug already exists' },
                    { status: 409 }
                );
            }
        }

        return NextResponse.json(
            { error: 'Failed to create firm review' },
            { status: 500 }
        );
    }
}

// GET /api/admin/firm-reviews - List all firm reviews
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const accessCheck = await checkAdminAccess();
        if (!accessCheck.authorized) {
            return NextResponse.json(
                { error: accessCheck.error },
                { status: accessCheck.status }
            );
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Build query
        const query: Record<string, unknown> = {};
        
        if (search) {
            query.$or = [
                { firmName: { $regex: search, $options: 'i' } },
                { title: { $regex: search, $options: 'i' } },
                { slug: { $regex: search, $options: 'i' } },
                { subtitle: { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Build sort object
        const sort: Record<string, 1 | -1> = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute query
        const reviews = await FirmReviewModel.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await FirmReviewModel.countDocuments(query);

        return NextResponse.json({
            success: true,
            reviews,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Error fetching firm reviews:', error);
        return NextResponse.json(
            { error: 'Failed to fetch firm reviews' },
            { status: 500 }
        );
    }
}

