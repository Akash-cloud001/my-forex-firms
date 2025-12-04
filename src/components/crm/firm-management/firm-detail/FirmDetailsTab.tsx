/* eslint-disable */
// @ts-nocheck

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { TabsContent } from '@/components/ui/tabs'
import { Building2 } from 'lucide-react'
import React from 'react'

function FirmDetailsTab({ firmData }: any) {
  const details = firmData?.firmDetails || {}
  const leadership = firmData?.leadership?.leadership || []

  return (
    <TabsContent value="firm">
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Building2 className="h-5 w-5" />
            Firm Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Firm Basic Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Legal Entity Name", value: details.legalEntityName },
              { label: "Registration Number", value: details.registrationNumber },
              { label: "License Number", value: details.licenseNumber },
              { label: "Regulator", value: details.regulator },
              { label: "Jurisdiction", value: details.jurisdiction },
              { label: "Year Founded", value: details.yearFounded },
              { label: "HQ Address", value: details.hqAddress },
              { label: "Max Allocation", value: details.maxAllocation },
              { label: "Broker Backed Type", value: details.brokerBackedType },
              { label: "Backed Broker Name", value: details.backedBrokerName },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <Label className="text-sm text-muted-foreground">{item.label}</Label>
                <p className="text-sm font-medium text-foreground truncate">{item.value || "-"}</p>
              </div>
            ))}

            {/* Status */}
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Status</Label>
              <Badge
                variant={details.status === "Active" ? "default" : "secondary"}
              >
                {details.status}
              </Badge>
            </div>

            {/* Slug */}
            <div className="space-y-1 md:col-span-2">
              <Label className="text-sm text-muted-foreground">Slug</Label>
              <p className="text-sm font-medium break-all">{details.slug}</p>
            </div>

            {/* Total Payout */}
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Total Payout</Label>
              <p className="text-sm font-semibold">{details.totalPayout}</p>
            </div>
          </div>

          <Separator />

          {/* Tag Sections */}
          {[
            {
              label: "Languages Supported",
              items: details.languagesSupported,
              variant: "outline",
            },
            {
              label: "Brokers",
              items: details.brokers,
              variant: "secondary",
            },
            {
              label: "Liquidity Providers",
              items: details.liquidityProviders,
              variant: "secondary",
            }
          ].map((section, idx) => (
            <div key={idx} className="space-y-2">
              <Label className="text-sm text-muted-foreground">{section.label}</Label>
              <div className="flex flex-wrap gap-2">
                {(section.items || []).map((item: string, index: number) => (
                  <Badge
                    key={index}
                    variant={section.variant}
                    className="text-xs"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          ))}

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Company Description</Label>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {details.companyDescription}
            </p>
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Official Website</Label>
            <a
              href={details.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm font-medium hover:underline"
            >
              {details.officialWebsite}
            </a>
          </div>

          <Separator />

          {/* Leadership */}
          <div className="space-y-4">
            <CardTitle className="text-lg">Leadership</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leadership.map((leader: any) => (
                <Card key={leader._id} className="border rounded-xl shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{leader.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {leader.role}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Verified:</span>
                      <Badge variant={leader.verified ? "default" : "secondary"}>
                        {leader.verified ? "Yes" : "No"}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Social Links
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(leader.links || {}).map(
                          ([platform, link]: [string, any]) => (
                            <a
                              key={platform}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Badge variant="outline" className="cursor-pointer text-xs">
                                {platform}
                              </Badge>
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

        </CardContent>
      </Card>
    </TabsContent>
  )
}

export default FirmDetailsTab
