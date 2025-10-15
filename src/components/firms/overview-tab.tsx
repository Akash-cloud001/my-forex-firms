"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp, ExternalLink } from "lucide-react";
import { getStatusColor } from "@/lib/helperMethods";

interface Firm {
  _id: string;
  firmName: string;
  legalEntityName: string;
  registrationNumber: string;
  jurisdiction: string;
  yearFounded: number;
  headquartersAddress: string;
  ceoFounderName?: string;
  leadershipLinks?: string;
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
  logoUrl?: string;
  logoFile?: {
    filename: string;
    url: string;
    size: number;
    mimeType: string;
  };
}

interface OverviewTabProps {
  firm: Firm;
}

export function OverviewTab({ firm }: OverviewTabProps) {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getYearsInOperation = (yearFounded: number) => {
    return new Date().getFullYear() - yearFounded;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Legal Entity</label>
                <p className="font-medium capitalize">{firm.legalEntityName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Registration</label>
                <p className="font-medium capitalize">{firm.registrationNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Jurisdiction</label>
                <p className="font-medium capitalize">{firm.jurisdiction}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Year Founded</label>
                <p className="font-medium capitalize">{firm.yearFounded}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">CEO/Founder</label>
                <p className="font-medium capitalize">{firm.ceoFounderName || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Leadership Links</label>
                {firm.leadershipLinks ? (
                  <a href={firm.leadershipLinks} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline flex items-center space-x-1">
                    <ExternalLink className="w-3 h-3" />
                    <span>View Profile</span>
                  </a>
                ) : (
                  <p className="font-medium text-muted-foreground">Not provided</p>
                )}
              </div>
              <div className="col-span-1">
                <label className="text-sm font-medium text-muted-foreground">Headquarters</label>
                <p className="font-medium capitalize">{firm.headquartersAddress}</p>
              </div>
              <div className="col-span-1">
                <label className="text-sm font-medium text-muted-foreground">Firm Website</label>
                <a href={firm.officialWebsite} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline flex items-center space-x-1">
                  <ExternalLink className="w-3 h-3" />
                  <span>{firm.officialWebsite}</span>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status & Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Status & Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <Badge variant="outline" className={getStatusColor(firm.status)}>
                  {firm.status.charAt(0).toUpperCase() + firm.status.slice(1)}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Published</label>
                <p className="font-medium capitalize">{firm.isPublished ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="font-medium capitalize">{formatDate(firm.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <p className="font-medium capitalize">{formatDate(firm.updatedAt)}</p>
              </div>
              {/* <div>
                <label className="text-sm font-medium text-muted-foreground">Version</label>
                <p className="font-medium">v{firm.version}</p>
              </div> */}
              {/* <div>
                <label className="text-sm font-medium text-muted-foreground">Years Active</label>
                <p className="font-medium">{getYearsInOperation(firm.yearFounded)}</p>
              </div> */}
              <div className="col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="font-medium text-sm first-letter:uppercase">{firm.shortDescription}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
