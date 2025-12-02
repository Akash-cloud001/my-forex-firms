import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { analyticsDataClient, GA_PROPERTY } from '@/lib/gaClient';

export async function GET() {
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

    // Fetch data for last 7 days
    const [response7d] = await analyticsDataClient.runReport({
      property: GA_PROPERTY,
      dateRanges: [
        {
          startDate: '7daysAgo',
          endDate: 'today',
        },
      ],
      metrics: [
        { name: 'totalUsers' },
        { name: 'screenPageViews' },
        { name: 'sessions' },
        { name: 'bounceRate' },
      ],
    });

    // Fetch data for last 30 days
    const [response30d] = await analyticsDataClient.runReport({
      property: GA_PROPERTY,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      metrics: [
        { name: 'totalUsers' },
        { name: 'screenPageViews' },
        { name: 'sessions' },
      ],
    });

    // Fetch data for previous 7 days (for growth calculation)
    const [responsePrev7d] = await analyticsDataClient.runReport({
      property: GA_PROPERTY,
      dateRanges: [
        {
          startDate: '14daysAgo',
          endDate: '8daysAgo',
        },
      ],
      metrics: [
        { name: 'totalUsers' },
        { name: 'screenPageViews' },
      ],
    });

    // Fetch data for previous 30 days (for growth calculation)
    const [responsePrev30d] = await analyticsDataClient.runReport({
      property: GA_PROPERTY,
      dateRanges: [
        {
          startDate: '60daysAgo',
          endDate: '31daysAgo',
        },
      ],
      metrics: [
        { name: 'totalUsers' },
        { name: 'screenPageViews' },
      ],
    });

    const row7d = response7d.rows?.[0];
    const row30d = response30d.rows?.[0];
    const rowPrev7d = responsePrev7d.rows?.[0];
    const rowPrev30d = responsePrev30d.rows?.[0];

    // Extract metrics for 7 days
    const totalUsers7d = Number(row7d?.metricValues?.[0]?.value || 0);
    const pageViews7d = Number(row7d?.metricValues?.[1]?.value || 0);
    const sessions7d = Number(row7d?.metricValues?.[2]?.value || 0);
    const bounceRate7d = Number(row7d?.metricValues?.[3]?.value || 0);

    // Extract metrics for 30 days
    const totalUsers30d = Number(row30d?.metricValues?.[0]?.value || 0);
    const pageViews30d = Number(row30d?.metricValues?.[1]?.value || 0);
    const sessions30d = Number(row30d?.metricValues?.[2]?.value || 0);

    // Extract previous period metrics for growth calculation
    const totalUsersPrev7d = Number(rowPrev7d?.metricValues?.[0]?.value || 0);
    const pageViewsPrev7d = Number(rowPrev7d?.metricValues?.[1]?.value || 0);
    const totalUsersPrev30d = Number(rowPrev30d?.metricValues?.[0]?.value || 0);
    const pageViewsPrev30d = Number(rowPrev30d?.metricValues?.[1]?.value || 0);

    // Calculate growth percentages
    const userGrowth7d = totalUsersPrev7d > 0 
      ? ((totalUsers7d - totalUsersPrev7d) / totalUsersPrev7d) * 100 
      : 0;
    const pageViewGrowth7d = pageViewsPrev7d > 0 
      ? ((pageViews7d - pageViewsPrev7d) / pageViewsPrev7d) * 100 
      : 0;
    const userGrowth30d = totalUsersPrev30d > 0 
      ? ((totalUsers30d - totalUsersPrev30d) / totalUsersPrev30d) * 100 
      : 0;
    const pageViewGrowth30d = pageViewsPrev30d > 0 
      ? ((pageViews30d - pageViewsPrev30d) / pageViewsPrev30d) * 100 
      : 0;

    return NextResponse.json({
      totalUsers: {
        last7Days: totalUsers7d,
        last30Days: totalUsers30d,
        growth7d: userGrowth7d,
        growth30d: userGrowth30d,
      },
      pageViews: {
        last7Days: pageViews7d,
        last30Days: pageViews30d,
        growth7d: pageViewGrowth7d,
        growth30d: pageViewGrowth30d,
      },
      sessions: {
        last7Days: sessions7d,
        last30Days: sessions30d,
      },
      bounceRate: {
        last7Days: bounceRate7d,
      },
    });
  } catch (error) {
    console.error('GA overview error', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 },
    );
  }
}

