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
    const path = searchParams.get('path');
    const startDate = searchParams.get('startDate') || '7daysAgo';
    const endDate = searchParams.get('endDate') || 'today';

    if (!path) {
      return NextResponse.json(
        { error: 'Missing "path" query param' }, 
        { status: 400 }
      );
    }

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
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: 'EXACT',
            value: path,
          },
        },
      },
    });

    const row = response.rows?.[0];
    const views = Number(row?.metricValues?.[0]?.value || 0);

    return NextResponse.json({ 
      path, 
      views,
      dateRange: {
        startDate,
        endDate,
      },
    });
  } catch (error) {
    console.error('GA page error', error);
    return NextResponse.json(
      { error: 'Failed to fetch page analytics' },
      { status: 500 },
    );
  }
}

