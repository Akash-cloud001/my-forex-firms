import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Firm from '@/models/Firm';

export async function POST() {
  try {
    await connectDB();

    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Delete drafts older than 30 days
    const result = await Firm.deleteMany({
      isDraft: true,
      updatedAt: { $lt: thirtyDaysAgo }
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `Cleaned up ${result.deletedCount} old drafts`
    });

  } catch (error) {
    console.error('Error cleaning up drafts:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to cleanup drafts',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
