/* eslint-disable */
// @ts-nocheck
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { TabsContent } from '@/components/ui/tabs'
import { CreditCard } from 'lucide-react'
function PaymentTab({firmData}:any) {
  return (
    <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Base Currency
                  </label>
                  <p className="text-2xl font-bold">
                    {firmData.payments.baseCurrency}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Min Withdrawal
                  </label>
                  <p className="text-2xl font-bold">
                    ${firmData.payments.minWithdrawal}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Processing Time
                  </label>
                  <p className="text-2xl font-bold">
                    {firmData.payments.processingTime} days
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Payout Schedule
                  </label>
                  <p className="text-2xl font-bold capitalize">
                    {firmData.payments.payoutSchedule}
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Payment Methods
                </label>
                <div className="flex gap-2 mt-2">
                  {firmData.payments.methods.map(
                    (method: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {method}
                      </Badge>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Payout Methods
                </label>
                <div className="flex gap-2 mt-2">
                  {firmData.payments.payoutMethods.map(
                    (method: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {method}
                      </Badge>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Refund Policy
                </label>
                <p className="text-base mt-2">
                  {firmData.payments.refundPolicy}
                </p>
              </div>
              <Separator />
              <p className="text-xl">Social Media Links</p>
              <div className="space-y-3">
                {Object.entries(firmData.socialLinks.socialLinks).map(
                  ([platform, link]: [string, any]) => (
                    <div
                      key={platform}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <span className="font-medium capitalize">{platform}</span>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Visit
                      </a>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
  )
}

export default PaymentTab