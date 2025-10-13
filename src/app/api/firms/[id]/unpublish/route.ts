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
    
    // Unpublish the firm
    firm.isPublished = false;
    firm.isDraft = true;
    firm.lastModifiedBy = 'current-user-id'; // TODO: Get from auth
    
    await firm.save();
    
    return NextResponse.json(firm);
  } catch (error) {
    console.error('Error unpublishing firm:', error);
    return NextResponse.json(
      { error: 'Failed to unpublish firm' },
      { status: 500 }
    );
  }
}
