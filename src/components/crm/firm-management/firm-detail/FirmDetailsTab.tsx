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
  return (
    <TabsContent value="firm">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Firm Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Legal Entity Name
              </label>
              <p className="text-base">
                {firmData.firmDetails.legalEntityName}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Registration Number
              </label>
              <p className="text-base">
                {firmData.firmDetails.registrationNumber}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                License Number
              </label>
              <p className="text-base">
                {firmData.firmDetails.licenseNumber}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Regulator
              </label>
              <p className="text-base">{firmData.firmDetails.regulator}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Jurisdiction
              </label>
              <p className="text-base">
                {firmData.firmDetails.jurisdiction}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Year Founded
              </label>
              <p className="text-base">
                {firmData.firmDetails.yearFounded}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <Badge
                variant={
                  firmData.firmDetails.status === "Active"
                    ? "default"
                    : "secondary"
                }
              >
                {firmData.firmDetails.status}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                HQ Address
              </label>
              <p className="text-base">{firmData.firmDetails.hqAddress}</p>
            </div>
            <div className="flex flex-col">
              <Label className="text-sm font-medium text-muted-foreground">
                Total Payout
              </Label>
              <p className="text-base font-semibold text-foreground">
                {firmData.firmDetails.totalPayout}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Broker Backed Type
              </label>
              <p className="text-base">
                {firmData.firmDetails.brokerBackedType}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Backed Broker Name
              </label>
              <p className="text-base">
                {firmData.firmDetails.backedBrokerName}
              </p>
            </div>

            <div className="flex flex-col">
              <Label className="text-sm font-medium text-muted-foreground">
                Slug
              </Label>
              <p className="text-base font-semibold text-foreground break-all">
                {firmData.firmDetails.slug}
              </p>
            </div>

          </div>
          <Separator />
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Languages Supported
            </label>
            <div className="flex gap-2 mt-2">
              {firmData.firmDetails.languagesSupported.map(
                (lang: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {lang}
                  </Badge>
                )
              )}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Brokers
            </label>
            <div className="flex gap-2 mt-2">
              {firmData.firmDetails.brokers.map(
                (broker: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {broker}
                  </Badge>
                )
              )}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Liquidity Providers
            </label>
            <div className="flex gap-2 mt-2">
              {firmData.firmDetails.liquidityProviders.map(
                (provider: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {provider}
                  </Badge>
                )
              )}
            </div>
          </div>
          <div className="space-y-1">
            <Label>Company Description</Label>
            <p className="text-base text-muted-foreground">
              {firmData.firmDetails.companyDescription}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Official Website
            </label>
            <a
              href={firmData.firmDetails.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline block mt-1"
            >
              {firmData.firmDetails.officialWebsite}
            </a>
          </div>

          <Separator />
          <Label className="text-2xl">Leadership</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {firmData.leadership.leadership.map((leader: any) => (
              <Card key={leader._id}>
                <CardHeader>
                  <CardTitle className="text-lg">{leader.name}</CardTitle>
                  <CardDescription>{leader.role}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Verified:
                    </span>
                    <Badge
                      variant={leader.verified ? "default" : "secondary"}
                    >
                      {leader.verified ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">
                      Social Links:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(leader.links).map(
                        ([platform, link]: [string, any]) => (
                          <a
                            key={platform}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Badge
                              variant="outline"
                              className="cursor-pointer hover:bg-accent"
                            >
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
        </CardContent>
      </Card>
    </TabsContent>
  )
}

export default FirmDetailsTab