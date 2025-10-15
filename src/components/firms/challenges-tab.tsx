"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface Challenge {
  challengeName: string;
  challengeType: string;
  accountSizesPricing: string;
  profitSplit: string;
  leverageBreakdown: string;
  timeLimits?: string;
  minimumTradingDays?: string;
  step1Step2Targets?: string;
  dailyMaxDrawdown?: string;
  refundTerms?: string;
  scalingPlan?: string;
  allowedInstruments?: string;
  rules?: string;
  maxExposureLots?: string;
  bonusPromoPolicy?: string;
  termsUrl?: string;
  termsLastUpdated?: string;
}

interface Firm {
  challenges?: Challenge[];
}

interface ChallengesTabProps {
  firm: Firm;
}

export function ChallengesTab({ firm }: ChallengesTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Trading Challenges</CardTitle>
          <CardDescription>Available challenge programs and requirements</CardDescription>
        </CardHeader>
        <CardContent>
          {firm.challenges && firm.challenges.length > 0 ? (
            <div className="space-y-6">
              {firm.challenges.map((challenge, index) => (
                <Card key={index} className="p-6">
                  <div className="space-y-6">
                    {/* Basic Challenge Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-border pb-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Challenge Name</label>
                        <p className="font-medium">{challenge.challengeName || 'N/A'}</p>
                      </div>
                      <div className="flex flex-col gap-  ">
                        <label className="text-sm font-medium text-muted-foreground">Type</label>
                        <Badge variant="outline" className="mt-1 capitalize">{challenge.challengeType}</Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Account Sizes & Pricing</label>
                        <p className="font-medium">{challenge.accountSizesPricing || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Financial Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Profit Split</label>
                        <p className="font-medium">{challenge.profitSplit || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Leverage Breakdown</label>
                        <p className="font-medium">{challenge.leverageBreakdown || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Time Limits</label>
                        <p className="font-medium">{challenge.timeLimits || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Minimum Trading Days</label>
                        <p className="font-medium">{challenge.minimumTradingDays || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Targets and Risk */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Step 1/2 Targets</label>
                        <p className="font-medium">{challenge.step1Step2Targets || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Daily Max Drawdown</label>
                        <p className="font-medium">{challenge.dailyMaxDrawdown || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Refund Terms</label>
                        <p className="font-medium">{challenge.refundTerms || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Scaling Plan</label>
                        <p className="font-medium">{challenge.scalingPlan || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Trading Rules */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Allowed Instruments</label>
                        <p className="font-medium">{challenge.allowedInstruments || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Max Exposure Lots</label>
                        <p className="font-medium">{challenge.maxExposureLots || 'N/A'}</p>
                      </div>
                      <div className="">
                        <label className="text-sm font-medium text-muted-foreground">Rules</label>
                        <p className="font-medium">{challenge.rules || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Bonus/Promo Policy</label>
                        <p className="font-medium">{challenge.bonusPromoPolicy || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Bonus/Promo Policy</label>
                        <p className="font-medium">{challenge.bonusPromoPolicy || 'N/A'}</p>
                      </div>
                      {/* <div>
                        <label className="text-sm font-medium text-muted-foreground">Terms Last Updated</label>
                        <p className="font-medium">{challenge.termsLastUpdated || 'N/A'}</p>
                      </div> */}
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-muted-foreground">Terms URL</label>
                        {challenge.termsUrl ? (
                          <a href={challenge.termsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-medium text-primary hover:underline">
                            <ExternalLink className="w-4 h-4" />
                            {challenge.termsUrl}
                          </a>
                        ) : (
                          <p className="font-medium">N/A</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No challenge information available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
