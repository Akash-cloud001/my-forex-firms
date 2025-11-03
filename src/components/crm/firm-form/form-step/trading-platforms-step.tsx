"use client";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StepProps {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function TradingPlatformsStep({
  onNext,
  onPrevious,
}: StepProps) {
  const { control } = useFormContext();

  return (
    <div>
      <h3 className="text-lg font-semibold">
        Trading Platforms & Infrastructure
      </h3>
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
            control={control}
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
            control={control}
            name="dataFeedsLiquidityProviders"
            rules={{
              required: "Data feeds/liquidity providers are required",
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Feeds / Liquidity Providers *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="LMAX, Interactive Brokers, FXCM, etc."
                    className="min-h-20"
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

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-border">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button type="button" onClick={onNext}>
          Next Step
        </Button>
      </div>
    </div>
  );
}
