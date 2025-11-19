/* eslint-disable */
// @ts-nocheck
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent,  CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { TabsContent } from '@/components/ui/tabs'
import { Eye } from 'lucide-react'
function TransparencyTab({firmData}:any) {
  return (
     <TabsContent value="transparency">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Transparency Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-accent rounded-lg">
                <label className="text-sm font-medium text-muted-foreground">
                  Transparency Score
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-3xl font-bold">
                    {firmData.transparency.transparencyScore}
                  </span>
                  <span className="text-muted-foreground">/ 5</span>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">CEO Public</span>
                  <Badge
                    variant={
                      firmData.transparency.ceoPublic ? "default" : "secondary"
                    }
                  >
                    {firmData.transparency.ceoPublic ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">Office Verified</span>
                  <Badge
                    variant={
                      firmData.transparency.officeVerified
                        ? "default"
                        : "secondary"
                    }
                  >
                    {firmData.transparency.officeVerified ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">Terms Public & Updated</span>
                  <Badge
                    variant={
                      firmData.transparency.termsPublicUpdated
                        ? "default"
                        : "secondary"
                    }
                  >
                    {firmData.transparency.termsPublicUpdated ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">Payout Proof Public</span>
                  <Badge
                    variant={
                      firmData.transparency.payoutProofPublic
                        ? "default"
                        : "secondary"
                    }
                  >
                    {firmData.transparency.payoutProofPublic ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">Third Party Audit</span>
                  <Badge
                    variant={
                      firmData.transparency.thirdPartyAudit
                        ? "default"
                        : "secondary"
                    }
                  >
                    {firmData.transparency.thirdPartyAudit ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
              {firmData.transparency.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Notes
                  </label>
                  <p className="text-base mt-2">
                    {firmData.transparency.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
  )
}

export default TransparencyTab