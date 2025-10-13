import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Firm from '@/models/Firm';

// Type for form data processing
interface FormDataRecord {
  [key: string]: string | number | boolean | File | object | null;
}

// Type for MongoDB query object
interface MongoQuery {
  [key: string]: string | number | boolean | Date | { $gte?: number | Date; $lte?: number | Date } | { $search: string };
}

// Type for MongoDB sort object
interface MongoSort {
  [key: string]: 1 | -1;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const isDraft = searchParams.get('isDraft');
    const jurisdiction = searchParams.get('jurisdiction');
    const yearFoundedMin = searchParams.get('yearFoundedMin');
    const yearFoundedMax = searchParams.get('yearFoundedMax');
    const isPublished = searchParams.get('isPublished');
    const createdBy = searchParams.get('createdBy');
    const dateRangeStart = searchParams.get('dateRangeStart');
    const dateRangeEnd = searchParams.get('dateRangeEnd');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    const query: MongoQuery = {};
    
    // Build query filters
    if (status) query.status = status;
    if (isDraft) query.isDraft = isDraft === 'true';
    if (isPublished) query.isPublished = isPublished === 'true';
    if (jurisdiction) query.jurisdiction = jurisdiction;
    if (createdBy) query.createdBy = createdBy;
    
    // Year range filter
    if (yearFoundedMin || yearFoundedMax) {
      query.yearFounded = {};
      if (yearFoundedMin) query.yearFounded.$gte = parseInt(yearFoundedMin);
      if (yearFoundedMax) query.yearFounded.$lte = parseInt(yearFoundedMax);
    }
    
    // Date range filter
    if (dateRangeStart || dateRangeEnd) {
      query.createdAt = {};
      if (dateRangeStart) query.createdAt.$gte = new Date(dateRangeStart);
      if (dateRangeEnd) query.createdAt.$lte = new Date(dateRangeEnd);
    }
    
    // Text search
    if (search) {
      query.$text = { $search: search };
    }
    
    // Build sort object
    const sort: MongoSort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const firms = await Firm.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email');
    
    const total = await Firm.countDocuments(query);
    
    return NextResponse.json({
      firms,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching firms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch firms' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const contentType = request.headers.get('content-type');
    let firmData: FormDataRecord = {};
    
    if (contentType?.includes('application/json')) {
      // Handle JSON data
      firmData = await request.json();
    } else {
      // Handle form data
      const formData = await request.formData();
      
      // Process form data
      for (const [key, value] of formData.entries()) {
        if (key === 'logoFile' && value instanceof File) {
          // Handle file upload - for now, store file info
          firmData.logoFile = {
            filename: value.name,
            size: value.size,
            mimeType: value.type,
            url: '' // Will be set after upload to cloud storage
          };
        } else if (key === 'challenges' && typeof value === 'string') {
          // Parse JSON fields
          try {
            firmData[key] = JSON.parse(value);
          } catch {
            firmData[key] = value;
          }
        } else if (typeof value === 'string' && (value === 'true' || value === 'false')) {
          // Convert string booleans
          firmData[key] = value === 'true';
        } else if (typeof value === 'string' && !isNaN(Number(value)) && key.includes('year')) {
          // Convert year fields to numbers
          firmData[key] = parseInt(value);
        } else {
          firmData[key] = value;
        }
      }
    }
    
    // Set system fields
    if (!firmData.createdBy) {
      firmData.createdBy = 'current-user-id'; // TODO: Get from auth
    }
    if (!firmData.lastModifiedBy) {
      firmData.lastModifiedBy = 'current-user-id';
    }
    firmData.isDraft = firmData.isDraft !== false; // Default to true unless explicitly false
    
    const firm = new Firm(firmData);
    await firm.save();
    
    return NextResponse.json({ firm, firmId: firm._id });
  } catch (error) {
    console.error('Error creating firm:', error);
    return NextResponse.json(
      { error: 'Failed to create firm' },
      { status: 500 }
    );
  }
}
