// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import FirmReviewModel from '@/models/FirmReview';

// // GET /api/public/firm-reviews - Get all published firm reviews (public, no auth required)
// export async function GET(request: NextRequest) {
//     try {
//         await connectDB();

//         const { searchParams } = new URL(request.url);
//         const search = searchParams.get('search') || '';
//         const page = parseInt(searchParams.get('page') || '1');
//         const limit = parseInt(searchParams.get('limit') || '50');
//         const sortBy = searchParams.get('sortBy') || 'createdAt';
//         const sortOrder = searchParams.get('sortOrder') || 'desc';

//         // Build query
//         const query: Record<string, unknown> = {};
        
//         if (search) {
//             query.$or = [
//                 { firmName: { $regex: search, $options: 'i' } },
//                 { title: { $regex: search, $options: 'i' } },
//                 { subtitle: { $regex: search, $options: 'i' } },
//                 { introduction: { $regex: search, $options: 'i' } }
//             ];
//         }

//         // Calculate pagination
//         const skip = (page - 1) * limit;

//         // Build sort object
//         const sort: Record<string, 1 | -1> = {};
//         sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

//         // Execute query - only return essential fields for list view
//         const reviews = await FirmReviewModel.find(query)
//             .select('slug firmName title subtitle publishedAt readTime trustScore rating ratingLabel introduction')
//             .sort(sort)
//             .skip(skip)
//             .limit(limit)
//             .lean();

//         const total = await FirmReviewModel.countDocuments(query);

//         return NextResponse.json({
//             success: true,
//             reviews,
//             pagination: {
//                 page,
//                 limit,
//                 total,
//                 totalPages: Math.ceil(total / limit)
//             }
//         });

//     } catch (error) {
//         console.error('Error fetching firm reviews:', error);
//         return NextResponse.json(
//             { error: 'Failed to fetch firm reviews' },
//             { status: 500 }
//         );
//     }
// }

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FirmReviewModel from '@/models/FirmReview';

// GET /api/public/firm-reviews - Get all published firm reviews (public, no auth required)
export async function GET(request: NextRequest) {
    try {
        await connectDB();

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
                { subtitle: { $regex: search, $options: 'i' } },
                { introduction: { $regex: search, $options: 'i' } },
                // NEW SEARCH FIELDS
                { 'overview.data.left.value': { $regex: search, $options: 'i' } },
                { 'overview.data.right.value': { $regex: search, $options: 'i' } },
                { 'seoTags': { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Build sort object
        const sort: Record<string, 1 | -1> = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute query - return COMPLETE data for list view (frontend handles selection)
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
