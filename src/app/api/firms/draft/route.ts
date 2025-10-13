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
          // Handle file upload
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
    
    // Set draft-specific fields
    firmData.isDraft = true;
    firmData.isPublished = false;
    
    // Use provided user IDs or default
    if (!firmData.createdBy) {
      firmData.createdBy = 'current-user-id'; // TODO: Get from auth
    }
    if (!firmData.lastModifiedBy) {
      firmData.lastModifiedBy = 'current-user-id';
    }
    
    const firm = new Firm(firmData);
    await firm.save();
    
    return NextResponse.json({ firm, firmId: firm._id });
  } catch (error) {
    console.error('Error saving draft:', error);
    return NextResponse.json(
      { error: 'Failed to save draft' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const createdBy = searchParams.get('createdBy');
    
    const query: MongoQuery = { isDraft: true };
    
    if (createdBy) {
      query.createdBy = createdBy;
    }
    
    const firms = await Firm.find(query)
      .sort({ updatedAt: -1 })
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
    console.error('Error fetching drafts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drafts' },
      { status: 500 }
    );
  }
}
