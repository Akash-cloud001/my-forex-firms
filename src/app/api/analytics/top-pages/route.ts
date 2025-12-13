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
    
    // Provide more specific error messages
    let errorMessage = 'Failed to fetch top pages analytics';
    let statusCode = 500;
    
    if (error instanceof Error) {
      // Check for missing environment variables
      if (error.message.includes('Missing Google Analytics environment variables') || 
          error.message.includes('Missing GA4_PROPERTY_ID')) {
        errorMessage = 'Google Analytics configuration is missing. Please check environment variables.';
        statusCode = 500;
      } 
      // Check for authentication errors
      else if (error.message.includes('authentication') || error.message.includes('credentials')) {
        errorMessage = 'Google Analytics authentication failed. Please check credentials.';
        statusCode = 500;
      }
      // Check for permission errors
      else if (error.message.includes('permission') || error.message.includes('403')) {
        errorMessage = 'Insufficient permissions to access Google Analytics data.';
        statusCode = 403;
      }
      // For other errors, include the message if it's safe to expose
      else if (error.message && !error.message.includes('private_key')) {
        errorMessage = `Analytics error: ${error.message}`;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode },
    );
  }
}

