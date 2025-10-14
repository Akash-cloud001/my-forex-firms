"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp, ExternalLink } from "lucide-react";

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
}

interface OverviewTabProps {
  firm: Firm;
}

export function OverviewTab({ firm }: OverviewTabProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'paused': return 'text-yellow-600';
      case 'suspended': return 'text-orange-600';
      case 'closed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

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
                <p className="font-medium">{firm.legalEntityName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Registration</label>
                <p className="font-medium">{firm.registrationNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Jurisdiction</label>
                <p className="font-medium">{firm.jurisdiction}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Year Founded</label>
                <p className="font-medium">{firm.yearFounded}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Headquarters</label>
                <p className="font-medium">{firm.headquartersAddress}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Website</label>
                <a href={firm.officialWebsite} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline flex items-center space-x-1">
                  <span>{firm.officialWebsite}</span>
                  <ExternalLink className="w-3 h-3" />
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
                <p className="font-medium">{firm.isPublished ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="font-medium">{formatDate(firm.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <p className="font-medium">{formatDate(firm.updatedAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Version</label>
                <p className="font-medium">v{firm.version}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Years Active</label>
                <p className="font-medium">{getYearsInOperation(firm.yearFounded)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{firm.shortDescription}</p>
        </CardContent>
      </Card>
    </div>
  );
}
