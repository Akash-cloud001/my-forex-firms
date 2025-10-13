import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Firm from '@/models/Firm';

// Type for form data processing
interface FormDataRecord {
  [key: string]: string | number | boolean | File | object | null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const firm = await Firm.findById(id)
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email');
    
    if (!firm) {
      return NextResponse.json(
        { error: 'Firm not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(firm);
  } catch (error) {
    console.error('Error fetching firm:', error);
    return NextResponse.json(
      { error: 'Failed to fetch firm' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const formData = await request.formData();
    const firmData: FormDataRecord = {};
    
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
    
    // Set system fields
    firmData.lastModifiedBy = 'current-user-id'; // TODO: Get from auth
    firmData.updatedAt = new Date();
    
    const firm = await Firm.findByIdAndUpdate(
      id,
      firmData,
      { new: true, runValidators: true }
    );
    
    if (!firm) {
      return NextResponse.json(
        { error: 'Firm not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(firm);
  } catch (error) {
    console.error('Error updating firm:', error);
    return NextResponse.json(
      { error: 'Failed to update firm' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const firm = await Firm.findByIdAndDelete(id);
    
    if (!firm) {
      return NextResponse.json(
        { error: 'Firm not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Firm deleted successfully' });
  } catch (error) {
    console.error('Error deleting firm:', error);
    return NextResponse.json(
      { error: 'Failed to delete firm' },
      { status: 500 }
    );
  }
}
