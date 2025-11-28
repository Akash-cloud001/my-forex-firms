import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import FirmReviewModel from '@/models/FirmReview';
import firmReviewsData from '@/data/firm-reviews.json';
import { FirmReviewsData } from '@/types/firm-review';

// POST /api/admin/migrate-firm-reviews - Migrate JSON data to database
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        // Check authentication and admin role
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const clerk = await clerkClient();
        const currentUser = await clerk.users.getUser(userId);
        const userRole = currentUser.publicMetadata?.role as string | undefined;
        
        if (userRole !== 'admin') {
            return NextResponse.json(
                { error: 'Admin access required' },
                { status: 403 }
            );
        }

        const reviews = firmReviewsData as FirmReviewsData;
        const reviewEntries = Object.values(reviews);
        
        const results = {
            total: reviewEntries.length,
            created: 0,
            updated: 0,
            skipped: 0,
            errors: [] as Array<{ slug: string; error: string }>
        };

        // Process each review
        for (const review of reviewEntries) {
            try {
                // Check if review with this slug already exists
                const existingReview = await FirmReviewModel.findOne({ slug: review.slug });

                if (existingReview) {
                    // Update existing review
                    Object.assign(existingReview, review);
                    await existingReview.save();
                    results.updated++;
                } else {
                    // Create new review
                    const newReview = new FirmReviewModel(review);
                    await newReview.save();
                    results.created++;
                }
            } catch (error) {
                console.error(`Error processing review ${review.slug}:`, error);
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                results.errors.push({
                    slug: review.slug,
                    error: errorMessage
                });
                results.skipped++;
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Migration completed',
            results
        });

    } catch (error) {
        console.error('Error during migration:', error);
        return NextResponse.json(
            { 
                error: 'Failed to migrate reviews',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

// GET /api/admin/migrate-firm-reviews - Get migration status
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Check authentication and admin role
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const clerk = await clerkClient();
        const currentUser = await clerk.users.getUser(userId);
        const userRole = currentUser.publicMetadata?.role as string | undefined;
        
        if (userRole !== 'admin') {
            return NextResponse.json(
                { error: 'Admin access required' },
                { status: 403 }
            );
        }

        // Count reviews in JSON file
        const reviews = firmReviewsData as FirmReviewsData;
        const jsonCount = Object.keys(reviews).length;

        // Count reviews in database
        const dbCount = await FirmReviewModel.countDocuments();

        // Get list of slugs in JSON
        const jsonSlugs = Object.values(reviews).map(r => r.slug);

        // Get list of slugs in database
        const dbReviews = await FirmReviewModel.find({}, 'slug').lean();
        const dbSlugs = dbReviews.map(r => r.slug);

        // Find missing and extra reviews
        const missingInDb = jsonSlugs.filter(slug => !dbSlugs.includes(slug));
        const extraInDb = dbSlugs.filter(slug => !jsonSlugs.includes(slug));

        return NextResponse.json({
            success: true,
            status: {
                jsonCount,
                dbCount,
                missingInDb,
                extraInDb,
                needsMigration: missingInDb.length > 0 || extraInDb.length > 0
            }
        });

    } catch (error) {
        console.error('Error checking migration status:', error);
        return NextResponse.json(
            { error: 'Failed to check migration status' },
            { status: 500 }
        );
    }
}

