import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Firm from '@/models/Firm';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const firm = await Firm.findById(id);
    
    if (!firm) {
      return NextResponse.json(
        { error: 'Firm not found' },
        { status: 404 }
      );
    }
    
    // Publish the firm
    firm.isPublished = true;
    firm.isDraft = false;
    firm.publishedAt = new Date();
    firm.lastModifiedBy = 'current-user-id'; // TODO: Get from auth
    
    await firm.save();
    
    return NextResponse.json(firm);
  } catch (error) {
    console.error('Error publishing firm:', error);
    return NextResponse.json(
      { error: 'Failed to publish firm' },
      { status: 500 }
    );
  }
}
