/* eslint-disable */
// @ts-nocheck
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TabsContent } from '@/components/ui/tabs';
import { Eye, CheckCircle2, XCircle } from 'lucide-react';

function TransparencyTab({ firmData }: any) {
  const metrics = [
    {
      label: 'CEO Public',
      value: firmData.transparency.ceoPublic,
    },
    {
      label: 'Office Verified',
      value: firmData.transparency.officeVerified,
    },
    {
      label: 'Terms Public & Updated',
      value: firmData.transparency.termsPublicUpdated,
    },
    {
      label: 'Payout Proof Public',
      value: firmData.transparency.payoutProofPublic,
    },
    {
      label: 'Third Party Audit',
      value: firmData.transparency.thirdPartyAudit,
    },
  ];

  return (
    <TabsContent value="transparency" className="mt-0">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Eye className="h-5 w-5 text-primary" />
            Transparency Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50 transition-colors hover:bg-muted/70"
              >
                <span className="font-medium text-sm text-foreground">
                  {metric.label}
                </span>
                <Badge
                  variant={metric.value ? 'default' : 'secondary'}
                  className="px-3 py-1 text-xs font-semibold"
                >
                  <span className="flex items-center gap-1.5">
                    {metric.value ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" />
                        Yes
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" />
                        No
                      </>
                    )}
                  </span>
                </Badge>
              </div>
            ))}
          </div>

          {/* Notes Section */}
          {firmData.transparency.notes && (
            <div className="space-y-3">
              <Separator />

              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Additional Notes
                </label>
                <p className="text-sm text-muted-foreground leading-relaxed break-all">
                  {firmData.transparency.notes}
                </p>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default TransparencyTab;