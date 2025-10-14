"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle, Clock, Edit, MoreHorizontal } from "lucide-react";
import { FirmHeader } from "@/components/firms/firm-header";
import { OverviewTab } from "@/components/firms/overview-tab";
import { TradingTab } from "@/components/firms/trading-tab";
import { ChallengesTab } from "@/components/firms/challenges-tab";
import { SupportTab } from "@/components/firms/support-tab";
import { ComplianceTab } from "@/components/firms/compliance-tab";
import { AnalyticsTab } from "@/components/firms/analytics-tab";
import { Badge } from "@/components/ui/badge";

interface Firm {
  _id: string;
  firmName: string;
  legalEntityName: string;
  registrationNumber: string;
  jurisdiction: string;
  yearFounded: number;
  headquartersAddress: string;
  ceoFounderName?: string;
  officialWebsite: string;
  status: 'active' | 'paused' | 'suspended' | 'closed';
  shortDescription: string;
  isDraft: boolean;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  version: number;
  logo?: {
    url?: string;
    filename?: string;
    originalName?: string;
  };
  tradingInfrastructure?: {
    tradingPlatforms: string[];
    supportedAssets: string[];
    leverage: string;
    minimumDeposit: string;
    maximumDrawdown: string;
  };
  payoutFinancial?: {
    profitSplit: string;
    payoutMethods: string[];
    minimumPayout: string;
    maximumPayout: string;
  };
  challenges?: Array<{
    challengeName: string;
    challengeType: string;
    profitSplit: string;
    accountSize: string;
    maximumDrawdown: string;
  }>;
  supportOperations?: {
    supportChannels: string[];
    supportHours: string;
    responseTime: string;
  };
  transparencyVerification?: {
    regulatoryCompliance: string[];
    auditReports: string[];
    transparencyScore: number;
  };
  analytics?: {
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
  };
}

export default function FirmDetail({ params }: { params: Promise<{ id: string }> }) {
  const [firm, setFirm] = useState<Firm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [firmId, setFirmId] = useState<string | null>(null);

  useEffect(() => {
    const getParams = async () => {
      const { id } = await params;
      setFirmId(id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!firmId) return;

    const fetchFirm = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/firms/${firmId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch firm');
        }
        
        const data = await response.json();
        setFirm(data);
      } catch (err) {
        console.error('Error fetching firm:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch firm');
      } finally {
        setLoading(false);
      }
    };

    fetchFirm();
  }, [firmId]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !firm) {
    return (
      <div className="p-6 space-y-6">
        <PageHeader
          title="Firm Not Found"
          description="The requested firm could not be found."
        />
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Firm Not Found</h3>
          <p className="text-muted-foreground mb-4">
            {error || "The firm you're looking for doesn't exist or has been removed."}
          </p>
          <Button asChild>
            <Link href="/admin/firms">
              Back to Firms
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (firm: Firm) => {
    if (firm.isPublished) {
      return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Published</Badge>;
    } else if (firm.isDraft) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Draft</Badge>;
    } else {
      return <Badge variant="outline" className="bg-gray-100 text-gray-800"><AlertCircle className="w-3 h-3 mr-1" />Unknown</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Firm Header */}
      <div>
        {/* add back to inventory button to the left and on the right add status of the firm, edit button and three dots */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="text-white" asChild>
            <Link href="/admin/firms">
              <ArrowLeft className="w-4 h-4" />
              Back to Inventory
            </Link>
          </Button>
          <div className="flex items-center space-x-2">
            {getStatusBadge(firm)}
            
            <Button variant="ghost" size="sm" className="text-white border-white hover:bg-white" asChild>
              <Link href={`/admin/firms/${firmId}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-white border-white hover:bg-white">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <FirmHeader firm={firm} firmId={firmId!} />

      {/* Tabs Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab firm={firm} />
        </TabsContent>

        <TabsContent value="trading">
          <TradingTab firm={firm} />
        </TabsContent>

        <TabsContent value="challenges">
          <ChallengesTab firm={firm} />
        </TabsContent>

        <TabsContent value="support">
          <SupportTab firm={firm} />
        </TabsContent>

        <TabsContent value="compliance">
          <ComplianceTab firm={firm} />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsTab firm={firm} />
        </TabsContent>
      </Tabs>
    </div>
  );
}