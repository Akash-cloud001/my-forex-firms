"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TradingInfrastructure {
  tradingPlatforms: string[];
  supportedAssets: string[];
  leverage: string;
  minimumDeposit: string;
  maximumDrawdown: string;
}

interface PayoutFinancial {
  profitSplit: string;
  payoutMethods: string[];
  minimumPayout: string;
  maximumPayout: string;
}

interface Firm {
  tradingInfrastructure?: TradingInfrastructure;
  payoutFinancial?: PayoutFinancial;
}

interface TradingTabProps {
  firm: Firm;
}

export function TradingTab({ firm }: TradingTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Trading Infrastructure</CardTitle>
          <CardDescription>Platforms, assets, and trading conditions</CardDescription>
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
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Supported Assets</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {firm.tradingInfrastructure.supportedAssets && firm.tradingInfrastructure.supportedAssets.length > 0 ? firm.tradingInfrastructure.supportedAssets.map((asset, index) => (
                    <Badge key={index} variant="outline">{asset}</Badge>
                  )) : <p className="text-foreground">N/A</p>}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Leverage</label>
                <p className="font-medium">{firm.tradingInfrastructure.leverage ? firm.tradingInfrastructure.leverage : 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Minimum Deposit</label>
                <p className="font-medium">{firm.tradingInfrastructure.minimumDeposit ? firm.tradingInfrastructure.minimumDeposit : 'N/A'}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No trading infrastructure information available.</p>
          )}
        </CardContent>
      </Card>

      {/* Payout Information */}
      {firm.payoutFinancial && (
        <Card>
          <CardHeader>
            <CardTitle>Payout & Financial</CardTitle>
            <CardDescription>Profit sharing and payout methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-muted-foreground">Profit Split</label>
                <p className="font-medium">{firm.payoutFinancial.profitSplit ? firm.payoutFinancial.profitSplit : 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Payout Methods</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {firm.payoutFinancial.payoutMethods?.map((method, index) => (
                    <Badge key={index} variant="secondary">{method}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
