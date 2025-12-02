import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { analyticsDataClient, GA_PROPERTY } from '@/lib/gaClient';

export async function GET(req: Request) {
  try {
    // Check authentication
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const clerk = await clerkClient();
    const currentUser = await clerk.users.getUser(userId);
    const userRole = currentUser.publicMetadata?.role as string | undefined;
    
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' }, 
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const startDate = searchParams.get('startDate') || '7daysAgo';
    const endDate = searchParams.get('endDate') || 'today';

    const [response] = await analyticsDataClient.runReport({
      property: GA_PROPERTY,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      metrics: [{ name: 'screenPageViews' }],
      dimensions: [{ name: 'pagePath' }],
      orderBys: [
        {
          metric: {
            metricName: 'screenPageViews',
          },
          desc: true,
        },
      ],
      limit,
    });

    const topPages = (response.rows || []).map((row) => ({
      path: row.dimensionValues?.[0]?.value || '',
      views: Number(row.metricValues?.[0]?.value || 0),
    }));

    return NextResponse.json({
      topPages,
      dateRange: {
        startDate,
        endDate,
      },
      limit,
    });
  } catch (error) {
    console.error('GA top pages error', error);
    return NextResponse.json(
      { error: 'Failed to fetch top pages analytics' },
      { status: 500 },
    );
  }
}

