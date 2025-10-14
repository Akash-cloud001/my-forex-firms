"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Heart, Star, Shield, Clock } from "lucide-react";

interface Analytics {
  totalViews: number;
  viewsGrowth: number;
  engagement: number;
  engagementGrowth: number;
  rating: number;
  reviewCount: number;
  trustScore: number;
  recentActivity: Array<{
    type: 'update' | 'add' | 'review' | 'other';
    description: string;
    timestamp: string;
  }>;
}

interface Firm {
  analytics?: Analytics;
}

interface AnalyticsTabProps {
  firm: Firm;
}

export function AnalyticsTab({ firm }: AnalyticsTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{firm.analytics?.totalViews || 0}</div>
            <p className="text-xs text-muted-foreground">
              {firm.analytics?.totalViews ? `+${firm.analytics?.viewsGrowth || 0}% from last month` : 'No views yet'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{firm.analytics?.engagement || 0}</div>
            <p className="text-xs text-muted-foreground">
              {firm.analytics?.engagement ? `+${firm.analytics?.engagementGrowth || 0}% from last month` : 'No engagement yet'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{firm.analytics?.rating || 0}</div>
            <p className="text-xs text-muted-foreground">
              {firm.analytics?.rating ? `Based on ${firm.analytics?.reviewCount || 0} reviews` : 'No ratings yet'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trust Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{firm.analytics?.trustScore || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {firm.analytics?.trustScore ? 
                (firm.analytics.trustScore >= 80 ? 'High trust rating' : 
                 firm.analytics.trustScore >= 60 ? 'Medium trust rating' : 'Low trust rating') : 
                'No trust score yet'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates and changes</CardDescription>
        </CardHeader>
        <CardContent>
          {firm.analytics?.recentActivity && firm.analytics.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {firm.analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'update' ? 'bg-blue-600' :
                    activity.type === 'add' ? 'bg-green-600' :
                    activity.type === 'review' ? 'bg-yellow-600' :
                    'bg-gray-600'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Recent Activity</h3>
              <p className="text-muted-foreground">
                This firm hasn&apos;t had any recent activity yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
