"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StepProps {
  data: Record<string, unknown>;
  onNext: (data: Record<string, unknown>) => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

interface TradingEnvironmentForm {
  typicalSpreads: string;
  commissions: string;
  slippageSwapPolicies: string;
  riskDeskModel: string;
  copyTradeProviders: string;
  mobileSupport: string;
  newsTrading: boolean;
  weekendHolding: boolean;
  eaUsage: boolean;
  copyTrading: boolean;
  hedging: boolean;
  scalping: boolean;
  newsTradingNotes?: string;
  weekendHoldingNotes?: string;
  eaUsageNotes?: string;
  copyTradingNotes?: string;
  hedgingNotes?: string;
  scalpingNotes?: string;
}

export default function TradingEnvironmentStep({
  data,
  onNext,
  onPrevious,
}: StepProps) {
  const form = useForm<TradingEnvironmentForm>({
    defaultValues: {
      typicalSpreads: (data.typicalSpreads as string) || "",
      commissions: (data.commissions as string) || "",
      slippageSwapPolicies: (data.slippageSwapPolicies as string) || "",
      riskDeskModel: (data.riskDeskModel as string) || "",
      copyTradeProviders: (data.copyTradeProviders as string) || "",
      mobileSupport: (data.mobileSupport as string) || "",
      newsTrading: (data.newsTrading as boolean) || false,
      weekendHolding: (data.weekendHolding as boolean) || false,
      eaUsage: (data.eaUsage as boolean) || false,
      copyTrading: (data.copyTrading as boolean) || false,
      hedging: (data.hedging as boolean) || false,
      scalping: (data.scalping as boolean) || false,
      newsTradingNotes: (data.newsTradingNotes as string) || "",
      weekendHoldingNotes: (data.weekendHoldingNotes as string) || "",
      eaUsageNotes: (data.eaUsageNotes as string) || "",
      copyTradingNotes: (data.copyTradingNotes as string) || "",
      hedgingNotes: (data.hedgingNotes as string) || "",
      scalpingNotes: (data.scalpingNotes as string) || "",
    },
  });

  const onSubmit = (formData: TradingEnvironmentForm) => {
    onNext(formData as unknown as Record<string, unknown>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold">Trading Environment & Rules</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Define trading conditions, spreads, and rule matrix.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Trading Conditions</CardTitle>
              <CardDescription>
                Spreads, commissions, and execution policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="typicalSpreads"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Typical Spreads</FormLabel>
                      <FormControl>
                        <Input placeholder="EUR/USD: 0.8 pips, GBP/USD: 1.2 pips" {...field} />
                      </FormControl>
                      <FormDescription>
                        Standard spreads for major pairs
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="commissions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Commissions</FormLabel>
                      <FormControl>
                        <Input placeholder="$3 per lot or No commission" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slippageSwapPolicies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slippage & Swap Policies</FormLabel>
                      <FormControl>
                        <Input placeholder="No slippage, Swap-free accounts available" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="riskDeskModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Desk Model</FormLabel>
                      <FormControl>
                        <Input placeholder="Internal, External, or Mixed" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Support</CardTitle>
              <CardDescription>
                Copy trading and mobile support information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="copyTradeProviders"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Copy-Trade Providers</FormLabel>
                      <FormControl>
                        <Input placeholder="Myfxbook, ZuluTrade, eToro" {...field} />
                      </FormControl>
                      <FormDescription>
                        Supported copy trading platforms
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobileSupport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Support</FormLabel>
                      <FormControl>
                        <Input placeholder="iOS, Android, Web" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Simplified Rule Matrix</CardTitle>
              <CardDescription>
                Trading rules with ✅ / ❌ / ⚠️ indicators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="newsTrading"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>News Trading</FormLabel>
                        <FormDescription>
                          Allow trading during news events
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                {form.watch("newsTrading") && (
                  <FormField
                    control={form.control}
                    name="newsTradingNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Specify any restrictions..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="weekendHolding"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Weekend Holding</FormLabel>
                        <FormDescription>
                          Allow holding positions over weekends
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                {form.watch("weekendHolding") && (
                  <FormField
                    control={form.control}
                    name="weekendHoldingNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Specify any restrictions..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="eaUsage"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>EA Usage</FormLabel>
                        <FormDescription>
                          Allow automated trading systems
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                {form.watch("eaUsage") && (
                  <FormField
                    control={form.control}
                    name="eaUsageNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Specify any restrictions..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="copyTrading"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Copy Trading</FormLabel>
                        <FormDescription>
                          Allow copying trades from other accounts
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                {form.watch("copyTrading") && (
                  <FormField
                    control={form.control}
                    name="copyTradingNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Specify any restrictions..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="hedging"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Hedging</FormLabel>
                        <FormDescription>
                          Allow hedging positions
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                {form.watch("hedging") && (
                  <FormField
                    control={form.control}
                    name="hedgingNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Specify any restrictions..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="scalping"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Scalping</FormLabel>
                        <FormDescription>
                          Allow scalping strategies
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                {form.watch("scalping") && (
                  <FormField
                    control={form.control}
                    name="scalpingNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Specify any restrictions..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-border">
          <Button type="button" variant="outline" onClick={onPrevious}>
            Previous
          </Button>
          <Button type="submit">Next Step</Button>
        </div>
      </form>
    </Form>
  );
}
