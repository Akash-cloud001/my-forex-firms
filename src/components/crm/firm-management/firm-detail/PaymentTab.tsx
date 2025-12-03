/* eslint-disable */
// @ts-nocheck
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TabsContent } from '@/components/ui/tabs';
import { CreditCard, ExternalLink, DollarSign, Clock, Calendar, Share2 } from 'lucide-react';

function PaymentTab({ firmData }: any) {
  const paymentStats = [
    {
      label: 'Base Currency',
      value: firmData.payments.baseCurrency,
      icon: DollarSign,
    },
    {
      label: 'Min Withdrawal',
      value: `$${firmData.payments.minWithdrawal}`,
      icon: DollarSign,
    },
    {
      label: 'Processing Time',
      value: `${firmData.payments.processingTime} days`,
      icon: Clock,
    },
    {
      label: 'Payout Schedule',
      value: firmData.payments.payoutSchedule,
      icon: Calendar,
      capitalize: true,
    },
  ];

  const socialPlatformIcons: Record<string, string> = {
    twitter: '𝕏',
    facebook: '📘',
    instagram: '📷',
    linkedin: '💼',
    youtube: '▶️',
    discord: '💬',
    telegram: '✈️',
  };

  return (
    <TabsContent value="payments" className="mt-0">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <CreditCard className="h-5 w-5 text-primary" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paymentStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg border border-border/50"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {stat.label}
                    </label>
                  </div>
                  <p className={`text-2xl font-bold text-foreground ${stat.capitalize ? 'capitalize' : ''}`}>
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          <Separator />

          {/* Payment Methods */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              Payment Methods
            </label>
            <div className="flex flex-wrap gap-2">
              {firmData.payments.methods.map((method: string, index: number) => (
                <Badge key={index} variant="outline" className="px-3 py-1.5 text-sm">
                  {method}
                </Badge>
              ))}
            </div>
          </div>

          {/* Payout Methods */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              Payout Methods
            </label>
            <div className="flex flex-wrap gap-2">
              {firmData.payments.payoutMethods.map((method: string, index: number) => (
                <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm">
                  {method}
                </Badge>
              ))}
            </div>
          </div>

          {/* Refund Policy */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              Refund Policy
            </label>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {firmData.payments.refundPolicy}
            </p>
          </div>

          <Separator />

          {/* Social Media Links */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-base font-semibold text-foreground">
                Social Media Links
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(firmData.socialLinks.socialLinks).map(
                ([platform, link]: [string, any]) => (
                  <div
                    key={platform}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {socialPlatformIcons[platform.toLowerCase()] || '🔗'}
                      </span>
                      <span className="font-medium capitalize text-sm">
                        {platform}
                      </span>
                    </div>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-primary hover:underline text-sm font-medium transition-colors"
                    >
                      Visit
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default PaymentTab;