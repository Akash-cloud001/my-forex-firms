"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface SupportOperations {
  supportChannels: string[];
  averageFirstResponseTime: string;
  averageResolutionTime: string;
  supportHours: string;
  escalationPolicy: string;
  kycRequirements: string;
  restrictedCountries: string[];
  amlComplianceLink: string;
}

interface Firm {
  supportOperations?: SupportOperations;
}

interface SupportTabProps {
  firm: Firm;
}

export function SupportTab({ firm }: SupportTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Support & Operations</CardTitle>
          <CardDescription>Customer support channels and operational details</CardDescription>
        </CardHeader>
        <CardContent>
          {firm.supportOperations ? (
            <div className="space-y-6">
              {/* Support Channels & Hours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Support Channels</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {/* {firm.supportOperations.supportChannels?.map((channel, index) => (
                      <Badge key={index} variant="secondary">{channel}</Badge>
                    ))} */}
                    {firm.supportOperations?.supportChannels[0].split(',').map((channel, index) => (
                      <Badge key={index} variant="secondary" className="capitalize">{channel}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Support Hours</label>
                  <p className="font-medium">{firm.supportOperations.supportHours || 'N/A'}</p>
                </div>
              </div>

              {/* Response Times */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Average First Response Time</label>
                  <p className="font-medium">{firm.supportOperations.averageFirstResponseTime || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Average Resolution Time</label>
                  <p className="font-medium">{firm.supportOperations.averageResolutionTime || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Escalation Policy</label>
                  <p className="font-medium">{firm.supportOperations.escalationPolicy || 'N/A'}</p>
                </div>
                <div>
                    <label className="text-sm font-medium text-muted-foreground">KYC Requirements</label>
                    <p className="font-medium">{firm.supportOperations.kycRequirements || 'N/A'}</p>
                  </div>
              </div>

              {/* Escalation Policy */}
              {/* KYC & Compliance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Restricted Countries</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {/* {firm.supportOperations.restrictedCountries?.map((country, index) => (
                      <Badge key={index} variant="outline">{country}</Badge>
                    ))} */}
                    {firm.supportOperations?.restrictedCountries[0].split(',').map((country, index) => (
                      <Badge key={index} variant="outline" className="capitalize">{country}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-0.5">
                  <label className="text-sm font-medium text-muted-foreground">AML Compliance Link</label>
                  {firm.supportOperations.amlComplianceLink ? (
                    <a href={firm.supportOperations.amlComplianceLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-medium text-primary hover:underline">
                      <ExternalLink className="w-4 h-4" />
                      {firm.supportOperations.amlComplianceLink}
                    </a>
                  ) : (
                    <p className="font-medium">N/A</p>
                  )}
                </div>
              </div>

              {/* AML Compliance */}
            </div>
          ) : (
            <p className="text-muted-foreground">No support information available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
