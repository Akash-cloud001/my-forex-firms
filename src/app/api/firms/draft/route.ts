import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Firm from '@/models/Firm';
import { uploadFileToBunnyCDN, deleteFileFromBunnyCDN } from '@/lib/bunnycdn';

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
    let draftData: FormDataRecord = {};
    let logoFile: File | null = null;

    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      for (const [key, value] of formData.entries()) {
        if (key === 'logoFile' && value instanceof File) {
          logoFile = value;
        } else if (typeof value === 'string') {
          try {
            draftData[key] = JSON.parse(value);
          } catch {
            draftData[key] = value;
          }
        }
      }
    } else {
      draftData = await request.json();
    }

    // Handle logo file upload to BunnyCDN for drafts
    if (logoFile) {
      try {
        const fileBuffer = Buffer.from(await logoFile.arrayBuffer());
        const bunnyFile = await uploadFileToBunnyCDN(
          fileBuffer,
          logoFile.name,
          logoFile.type,
          'draft-logos' // Store drafts in a separate folder
        );

        draftData.logoUrl = bunnyFile.url;
        draftData.logoFile = bunnyFile;
      } catch (error) {
        console.error('Error uploading draft logo to BunnyCDN:', error);
        return NextResponse.json(
          { error: 'Failed to upload logo file' },
          { status: 500 }
        );
      }
    } else {
      // Ensure logoUrl is empty string if no logo file
      draftData.logoUrl = '';
      draftData.logoFile = null;
    }

    // Set draft-specific fields
    draftData.isDraft = true;
    draftData.isPublished = false;
    
    // Use provided user IDs or default
    if (!draftData.createdBy) {
      draftData.createdBy = 'current-user-id'; // TODO: Get from auth
    }
    if (!draftData.lastModifiedBy) {
      draftData.lastModifiedBy = 'current-user-id';
    }
    
    const firm = new Firm(draftData);
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
