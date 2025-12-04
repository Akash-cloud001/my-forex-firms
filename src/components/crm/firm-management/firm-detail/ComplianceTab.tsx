/* eslint-disable */
// @ts-nocheck
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Shield, ExternalLink } from 'lucide-react';

function ComplianceTab({ firmData }: any) {
  return (
    <TabsContent value="compliance" className="mt-0">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-5 w-5 text-primary" />
            Compliance & Regulations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* KYC Provider */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              KYC Provider
            </label>
            <p className="text-base text-muted-foreground">
              {firmData.compliance.kycProvider}
            </p>
          </div>

          {/* KYC Requirements */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              KYC Requirements
            </label>
            <div className="flex flex-wrap gap-2">
              {firmData.compliance.kycRequirements.map(
                (req: string, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="px-3 py-1 text-sm"
                  >
                    {req}
                  </Badge>
                )
              )}
            </div>
          </div>

          {/* Restricted Countries */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Restricted Countries
            </label>
            <div className="flex flex-wrap gap-2">
              {firmData.compliance.restrictedCountries.map(
                (country: string, index: number) => (
                  <Badge
                    key={index}
                    variant="destructive"
                    className="px-3 py-1 text-sm"
                  >
                    {country}
                  </Badge>
                )
              )}
            </div>
          </div>

          {/* Regulations Complied */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Regulations Complied
            </label>
            <div className="flex flex-wrap gap-2">
              {firmData.compliance.regulationsComplied.map(
                (reg: string, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1 text-sm"
                  >
                    {reg}
                  </Badge>
                )
              )}
            </div>
          </div>

          {/* AML Policy */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              AML Policy
            </label>
            <a
              href={firmData.compliance.amlLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline text-sm transition-colors"
            >
              <span className="break-all">{firmData.compliance.amlLink}</span>
              <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
            </a>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default ComplianceTab;