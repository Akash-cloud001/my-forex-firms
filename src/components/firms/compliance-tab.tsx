"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TransparencyVerification {
  regulatoryCompliance: string[];
  auditReports: string[];
  transparencyScore: number;
}

interface Firm {
  transparencyVerification?: TransparencyVerification;
}

interface ComplianceTabProps {
  firm: Firm;
}

export function ComplianceTab({ firm }: ComplianceTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Compliance & Verification</CardTitle>
          <CardDescription>Regulatory compliance and transparency measures</CardDescription>
        </CardHeader>
        <CardContent>
          {firm.transparencyVerification ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Regulatory Compliance</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {firm.transparencyVerification.regulatoryCompliance && firm.transparencyVerification.regulatoryCompliance.length > 0 ? firm.transparencyVerification.regulatoryCompliance.map((compliance, index) => (
                    <Badge key={index} variant="outline">{compliance}</Badge>
                  )) : <p className="text-foreground">N/A</p>}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Audit Reports</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {firm.transparencyVerification.auditReports && firm.transparencyVerification.auditReports.length > 0 ? firm.transparencyVerification.auditReports.map((report, index) => (
                    <Badge key={index} variant="secondary">{report}</Badge>
                  )) : <p className="text-foreground">N/A</p>}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Transparency Score</label>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(firm.transparencyVerification.transparencyScore ? firm.transparencyVerification.transparencyScore : 0) * 10}%` }}
                    ></div>
                  </div>
                  <span className="font-medium">{firm.transparencyVerification.transparencyScore ? firm.transparencyVerification.transparencyScore : 0}/10</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No compliance information available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
