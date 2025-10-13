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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StepProps {
  data: Record<string, unknown>;
  onNext: (data: Record<string, unknown>) => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

interface TradingPlatformsForm {
  tradingPlatforms: string;
  dataFeedsLiquidityProviders: string;
  averageExecutionLatency: string;
  serverRegions: string;
  platformIncidents12m: string;
}

export default function TradingPlatformsStep({
  data,
  onNext,
  onPrevious,
}: StepProps) {
  const form = useForm<TradingPlatformsForm>({
    defaultValues: {
      tradingPlatforms: (data.tradingPlatforms as string) || "",
      dataFeedsLiquidityProviders: (data.dataFeedsLiquidityProviders as string) || "",
      averageExecutionLatency: (data.averageExecutionLatency as string) || "",
      serverRegions: (data.serverRegions as string) || "",
      platformIncidents12m: (data.platformIncidents12m as string) || "",
    },
  });

  const onSubmit = (formData: TradingPlatformsForm) => {
    onNext(formData as unknown as Record<string, unknown>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold">Trading Platforms & Infrastructure</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Define the trading infrastructure and platform capabilities.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Trading Platforms</CardTitle>
              <CardDescription>
                Supported trading platforms and their configurations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="tradingPlatforms"
                rules={{ required: "Trading platforms are required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trading Platforms Offered *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="MT4, MT5, cTrader, TradingView, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List all supported platforms (comma-separated)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataFeedsLiquidityProviders"
                rules={{ required: "Data feeds/liquidity providers are required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Feeds / Liquidity Providers *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="LMAX, Interactive Brokers, FXCM, etc."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List all liquidity providers and data sources
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance & Infrastructure</CardTitle>
              <CardDescription>
                Technical specifications and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="averageExecutionLatency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average Execution Latency</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="< 50ms or 10-30ms"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Typical order execution speed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serverRegions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Server Regions</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="London, New York, Tokyo, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Available server locations
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="platformIncidents12m"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform Incidents (12m)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe any major platform incidents in the last 12 months..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Document any significant downtime, technical issues, or incidents
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
