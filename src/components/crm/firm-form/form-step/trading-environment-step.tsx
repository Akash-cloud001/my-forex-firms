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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface StepProps {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function TradingEnvironmentStep({
  onNext,
  onPrevious,
}: StepProps) {
  const { control, watch } = useFormContext();

  const showNotes = {
    newsTrading: watch("newsTrading"),
    weekendHolding: watch("weekendHolding"),
    eaUsage: watch("eaUsage"),
    copyTrading: watch("copyTrading"),
    hedging: watch("hedging"),
    scalping: watch("scalping"),
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold">Trading Environment & Rules</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Define trading conditions, spreads, and rule matrix.
        </p>

        {/* --- Trading Conditions --- */}
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
                control={control}
                name="typicalSpreads"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Typical Spreads</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="EUR/USD: 0.8 pips, GBP/USD: 1.2 pips"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Standard spreads for major pairs
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="commissions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commissions</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="$3 per lot or No commission"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="slippageSwapPolicies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slippage & Swap Policies</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="No slippage, Swap-free accounts available"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
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

        {/* --- Platform Support --- */}
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
                control={control}
                name="copyTradeProviders"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Copy-Trade Providers</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Myfxbook, ZuluTrade, eToro"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Supported copy trading platforms
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
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

        {/* --- Simplified Rule Matrix --- */}
        <Card>
          <CardHeader>
            <CardTitle>Simplified Rule Matrix</CardTitle>
            <CardDescription>
              Trading rules with ✅ / ❌ / ⚠️ indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { key: "newsTrading", label: "News Trading", desc: "Allow trading during news events" },
              { key: "weekendHolding", label: "Weekend Holding", desc: "Allow holding positions over weekends" },
              { key: "eaUsage", label: "EA Usage", desc: "Allow automated trading systems" },
              { key: "copyTrading", label: "Copy Trading", desc: "Allow copying trades from other accounts" },
              { key: "hedging", label: "Hedging", desc: "Allow hedging positions" },
              { key: "scalping", label: "Scalping", desc: "Allow scalping strategies" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="space-y-2">
                <FormField
                  control={control}
                  name={key as any}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{label}</FormLabel>
                        <FormDescription>{desc}</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                {showNotes[key as keyof typeof showNotes] && (
                  <FormField
                    control={control}
                    name={`${key}Notes` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea placeholder="Specify any restrictions..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* --- Navigation Buttons --- */}
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
