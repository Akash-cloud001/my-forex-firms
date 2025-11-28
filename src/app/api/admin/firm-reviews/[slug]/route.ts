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

// GET /api/admin/firm-reviews/[slug] - Get single review by slug
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();

        const accessCheck = await checkAdminAccess();
        if (!accessCheck.authorized) {
            return NextResponse.json(
                { error: accessCheck.error },
                { status: accessCheck.status }
            );
        }

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

// PUT /api/admin/firm-reviews/[slug] - Update existing review
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();

        const accessCheck = await checkAdminAccess();
        if (!accessCheck.authorized) {
            return NextResponse.json(
                { error: accessCheck.error },
                { status: accessCheck.status }
            );
        }

        const { slug } = await params;
        const body: Partial<FirmReview> = await request.json();

        // Find existing review
        const existingReview = await FirmReviewModel.findOne({ slug });
        if (!existingReview) {
            return NextResponse.json(
                { error: 'Review not found' },
                { status: 404 }
            );
        }

        // If slug is being updated, validate format and check uniqueness
        if (body.slug && body.slug !== slug) {
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

            const slugExists = await FirmReviewModel.findOne({ slug: body.slug });
            if (slugExists) {
                return NextResponse.json(
                    { 
                        error: 'Slug already exists',
                        message: 'A review with this slug already exists. Please choose a different slug.'
                    },
                    { status: 409 }
                );
            }
        }

        // Update review
        Object.assign(existingReview, body);
        const updatedReview = await existingReview.save();

        return NextResponse.json({
            success: true,
            review: updatedReview
        });

    } catch (error: unknown) {
        console.error('Error updating firm review:', error);
        
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
            { error: 'Failed to update firm review' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/firm-reviews/[slug] - Delete review
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();

        const accessCheck = await checkAdminAccess();
        if (!accessCheck.authorized) {
            return NextResponse.json(
                { error: accessCheck.error },
                { status: accessCheck.status }
            );
        }

        const { slug } = await params;

        const review = await FirmReviewModel.findOneAndDelete({ slug });

        if (!review) {
            return NextResponse.json(
                { error: 'Review not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Review deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting firm review:', error);
        return NextResponse.json(
            { error: 'Failed to delete firm review' },
            { status: 500 }
        );
    }
}

