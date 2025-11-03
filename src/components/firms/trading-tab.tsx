"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TradingInfrastructure {
  tradingPlatforms: string[];
  dataFeedsLiquidityProviders: string[];
}

interface PayoutFinancial {
  profitSplit: string;
  firstPayoutTiming: string;
  regularPayoutCycle: string;
  minimumPayoutAmount: string;
  averagePayoutProcessingTime: string;
  fastestSlowestPayoutDuration: string;
  payoutMethods: string[];
  payoutFeesFxCosts: string;
  totalPayoutsAllTime: string;
  largestSinglePayout: string;
  monthlyPayoutCounts: string;
  payoutProofLinks: string[];
}

interface TradingEnvironment {
  typicalSpreads: string;
  commissions: string;
  slippageSwapPolicies: string;
  riskDeskModel: string;
  copyTradeProviders: string[];
  mobileSupport: string[];
  ruleMatrix: {
    newsTrading: boolean;
    weekendHolding: boolean;
    eaUsage: boolean;
    copyTrading: boolean;
    hedging: boolean;
    scalping: boolean;
  };
  ruleDetails: {
    newsTradingNotes: string;
    weekendHoldingNotes: string;
    eaUsageNotes: string;
    copyTradingNotes: string;
    hedgingNotes: string;
    scalpingNotes: string;
  };
}

interface Firm {
  tradingInfrastructure?: TradingInfrastructure;
  payoutFinancial?: PayoutFinancial;
  tradingEnvironment?: TradingEnvironment;
}

interface TradingTabProps {
  firm: Firm;
}

export function TradingTab({ firm }: TradingTabProps) {
  function renderBadgesFromArray(arr?: string[], variant: "secondary" | "outline" = "secondary") {
  if (!arr || arr.length === 0) return <p className="text-muted-foreground">N/A</p>;
  return arr.flatMap((item, i) =>
    item
      .split(',')
      .map((x, j) => (
        <Badge key={`${i}-${j}`} variant={variant}>
          {x.trim()}
        </Badge>
      ))
  );
}

  return (
    <div className="space-y-6">
      {/* Trading Infrastructure */}
      <Card>
        <CardHeader>
          <CardTitle>Trading Infrastructure</CardTitle>
          <CardDescription>Platforms and data feeds</CardDescription>
        </CardHeader>
        <CardContent>
          {firm.tradingInfrastructure ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Trading Platforms</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {firm.tradingInfrastructure.tradingPlatforms?.map((platform, index) => (
                    <Badge key={index} variant="secondary">{platform}</Badge>
                  ))}
                  {/* {firm.tradingInfrastructure?.tradingPlatforms[0].split(',').map((platform, index) => (
                    <Badge key={index} variant="secondary">{platform}</Badge>
                  ))} */}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Data Feeds / Liquidity Providers</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {/* {firm.tradingInfrastructure.dataFeedsLiquidityProviders?.map((provider, index) => (
                    <Badge key={index} variant="outline">{provider}</Badge>
                  ))} */}
                  {firm.tradingInfrastructure?.dataFeedsLiquidityProviders[0].split(',').map((provider, index) => (
                    <Badge key={index} variant="outline">{provider}</Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No trading infrastructure information available.</p>
          )}
        </CardContent>
      </Card>

      {/* Trading Environment */}
      {firm.tradingEnvironment && (
        <Card>
          <CardHeader>
            <CardTitle>Trading Environment</CardTitle>
            <CardDescription>Spreads, commissions, and trading rules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Typical Spreads</label>
                <div className="font-medium flex gap-2 capitalize">{firm.tradingEnvironment.typicalSpreads.split(',').map((spread, index) => (
                  <Badge key={index} variant="secondary">{spread}</Badge>
                ))}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Commissions</label>
                <p className="font-medium">{firm.tradingEnvironment.commissions || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Slippage & Swap Policies</label>
                <p className="font-medium">{firm.tradingEnvironment.slippageSwapPolicies || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Risk Desk Model</label>
                <p className="font-medium">{firm.tradingEnvironment.riskDeskModel || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Copy Trade Providers</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {/* {firm.tradingEnvironment.copyTradeProviders?.map((provider, index) => (
                    <Badge key={index} variant="secondary">{provider}</Badge>
                  ))} */}
                  {firm.tradingEnvironment?.copyTradeProviders[0].split(',').map((provider, index) => (
                    <Badge key={index} variant="secondary">{provider}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Mobile Support</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {/* {firm.tradingEnvironment.mobileSupport?.map((support, index) => (
                    <Badge key={index} variant="outline">{support}</Badge>
                  ))} */}
                  {firm.tradingEnvironment?.mobileSupport[0].split(',').map((support, index) => (
                    <Badge key={index} variant="outline">{support}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Trading Rules */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4">Trading Rules</h4>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge className="bg-green-500 text-white">
                  Allowed
                </Badge>
                {
                  Object.entries(firm.tradingEnvironment.ruleMatrix)
                    .filter(([, value]) => value) // only keep truthy values
                    .map(([key]) => (
                      <Badge key={key} variant="outline" className="capitalize">
                        {key}
                      </Badge>
                    ))
                }
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-red-500 text-white">
                  Not Allowed
                </Badge>
                {
                  Object.entries(firm.tradingEnvironment.ruleMatrix)
                    .filter(([, value]) => !value) // only keep truthy values
                    .map(([key]) => (
                      <Badge key={key} variant="outline" className="capitalize">
                        {key}
                      </Badge>
                    ))
                }
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payout Information */}
      {firm.payoutFinancial && (
        <Card>
          <CardHeader>
            <CardTitle>Payout & Financial</CardTitle>
            <CardDescription>Profit sharing and payout methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Profit Split</label>
                <p className="font-medium">{firm.payoutFinancial.profitSplit || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">First Payout Timing</label>
                <p className="font-medium">{firm.payoutFinancial.firstPayoutTiming || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Regular Payout Cycle</label>
                <p className="font-medium">{firm.payoutFinancial.regularPayoutCycle || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Minimum Payout Amount</label>
                <p className="font-medium">{firm.payoutFinancial.minimumPayoutAmount || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Average Processing Time</label>
                <p className="font-medium">{firm.payoutFinancial.averagePayoutProcessingTime || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Fastest/Slowest Duration</label>
                <p className="font-medium">{firm.payoutFinancial.fastestSlowestPayoutDuration || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Payout Methods</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {/* {firm.payoutFinancial.payoutMethods?.map((method, index) => (
                    <Badge key={index} variant="secondary">{method}</Badge>
                  ))} */}
                  {firm.payoutFinancial?.payoutMethods[0].split(',').map((method, index) => (
                    <Badge key={index} variant="secondary">{method}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Payout Fees / FX Costs</label>
                <p className="font-medium">{firm.payoutFinancial.payoutFeesFxCosts || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Payouts (All-Time)</label>
                <p className="font-medium">{firm.payoutFinancial.totalPayoutsAllTime || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Largest Single Payout</label>
                <p className="font-medium">{firm.payoutFinancial.largestSinglePayout || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Monthly Payout Counts</label>
                <p className="font-medium">{firm.payoutFinancial.monthlyPayoutCounts || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Payout Proof Links</label>
                <div className="flex flex-wrap gap-2 mt-2">
                      {renderBadgesFromArray(firm.payoutFinancial?.payoutProofLinks, "outline")}
          </div>

              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
