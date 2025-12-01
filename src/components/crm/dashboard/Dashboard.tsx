'use client';

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Users, Eye, Activity, MousePointerClick, FileText } from "lucide-react";

interface AnalyticsOverview {
  totalUsers: {
    last7Days: number;
    last30Days: number;
    growth7d: number;
    growth30d: number;
  };
  pageViews: {
    last7Days: number;
    last30Days: number;
    growth7d: number;
    growth30d: number;
  };
  sessions: {
    last7Days: number;
    last30Days: number;
  };
  bounceRate: {
    last7Days: number;
  };
}

interface TopPage {
  path: string;
  views: number;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function formatPercentage(num: number): string {
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(1)}%`;
}

function GrowthIndicator({ value }: { value: number }) {
  const isPositive = value >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
  
  return (
    <div className={`flex items-center gap-1 ${colorClass}`}>
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{formatPercentage(value)}</span>
    </div>
  );
}

function Dashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch overview analytics
        const overviewRes = await fetch('/api/analytics/overview');
        if (!overviewRes.ok) {
          throw new Error('Failed to fetch overview analytics');
        }
        const overviewData = await overviewRes.json();
        setAnalytics(overviewData);

        // Fetch top pages
        const topPagesRes = await fetch('/api/analytics/top-pages?limit=10');
        if (!topPagesRes.ok) {
          throw new Error('Failed to fetch top pages');
        }
        const topPagesData = await topPagesRes.json();
        setTopPages(topPagesData.topPages || []);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <PageHeader
          title="Dashboard"
          description="Overview of your platform's activity, recent complaints, and key metrics."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <PageHeader
          title="Dashboard"
          description="Overview of your platform's activity, recent complaints, and key metrics."
        />
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <p className="text-destructive mb-2">Error loading analytics</p>
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your platform's analytics, user activity, and key metrics."
      />

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Users - 7 Days */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users (7d)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics?.totalUsers.last7Days || 0)}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">vs previous 7d</p>
              {analytics && <GrowthIndicator value={analytics.totalUsers.growth7d} />}
            </div>
          </CardContent>
        </Card>

        {/* Total Users - 30 Days */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users (30d)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics?.totalUsers.last30Days || 0)}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">vs previous 30d</p>
              {analytics && <GrowthIndicator value={analytics.totalUsers.growth30d} />}
            </div>
          </CardContent>
        </Card>

        {/* Page Views - 7 Days */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views (7d)</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics?.pageViews.last7Days || 0)}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">vs previous 7d</p>
              {analytics && <GrowthIndicator value={analytics.pageViews.growth7d} />}
            </div>
          </CardContent>
        </Card>

        {/* Page Views - 30 Days */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views (30d)</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics?.pageViews.last30Days || 0)}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">vs previous 30d</p>
              {analytics && <GrowthIndicator value={analytics.pageViews.growth30d} />}
            </div>
          </CardContent>
        </Card>

        {/* Sessions - 7 Days */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions (7d)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics?.sessions.last7Days || 0)}</div>
            <p className="text-xs text-muted-foreground mt-2">Last 7 days</p>
          </CardContent>
        </Card>

        {/* Sessions - 30 Days */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions (30d)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics?.sessions.last30Days || 0)}</div>
            <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
          </CardContent>
        </Card>

        {/* Bounce Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate (7d)</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.bounceRate.last7Days 
                ? `${(analytics.bounceRate.last7Days * 100).toFixed(1)}%`
                : '0%'}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Top Pages (Last 7 Days)
          </CardTitle>
          <CardDescription>
            Most viewed pages on your platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topPages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No page data available
            </p>
          ) : (
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div
                  key={page.path}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-6">
                      #{index + 1}
                    </span>
                    <span className="text-sm font-medium">{page.path}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">{formatNumber(page.views)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
