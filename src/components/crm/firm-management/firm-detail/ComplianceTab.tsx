/* eslint-disable */
// @ts-nocheck
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent,  CardHeader, CardTitle } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { Shield } from 'lucide-react'
function ComplianceTab({firmData}:any) {
  return (
    <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Compliance & Regulations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  KYC Provider
                </label>
                <p className="text-base mt-1">
                  {firmData.compliance.kycProvider}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  KYC Requirements
                </label>
                <div className="flex gap-2 mt-2">
                  {firmData.compliance.kycRequirements.map(
                    (req: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {req}
                      </Badge>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Restricted Countries
                </label>
                <div className="flex gap-2 mt-2">
                  {firmData.compliance.restrictedCountries.map(
                    (country: string, index: number) => (
                      <Badge key={index} variant="destructive">
                        {country}
                      </Badge>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Regulations Complied
                </label>
                <div className="flex gap-2 mt-2">
                  {firmData.compliance.regulationsComplied.map(
                    (reg: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {reg}
                      </Badge>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  AML Policy
                </label>
                <a
                  href={firmData.compliance.amlLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline block mt-1"
                >
                  {firmData.compliance.amlLink}
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
  )
}

export default ComplianceTab