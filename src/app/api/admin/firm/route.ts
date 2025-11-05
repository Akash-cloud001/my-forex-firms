import connectDB from '@/lib/mongodb';
import FundingFirm from '@/models/FirmDetails';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Create new firm
    const firm = await FundingFirm.create(body);

    return NextResponse.json(
      {
        success: true,
        message: 'Funding firm created successfully',
        data: firm,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating firm:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create funding firm',
        error: error.message,
      },
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
    const skip = (page - 1) * limit;

    const firms = await FundingFirm.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await FundingFirm.countDocuments();

    return NextResponse.json({
      success: true,
      data: firms,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching firms:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch funding firms',
        error: error.message,
      },
      { status: 500 }
    );
  }
}



