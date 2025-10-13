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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface StepProps {
  data: Record<string, unknown>;
  onNext: (data: Record<string, unknown>) => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

interface RulesPoliciesForm {
  dailyDrawdownLimit: string;
  dailyDrawdownValue: string;
  maxDrawdownLimit: string;
  maxDrawdownValue: string;
  minimumTradingDays: string;
  weekendHoldingPolicy: "allowed" | "not-allowed" | "conditional";
  weekendHoldingNotes?: string;
  eaBotUsage: "allowed" | "not-allowed" | "conditional";
  eaBotNotes?: string;
  copyTradingRules: "allowed" | "not-allowed" | "conditional";
  copyTradingNotes?: string;
  newsTradingPolicy: "allowed" | "not-allowed" | "conditional";
  newsTradingNotes?: string;
  refundConditions: string;
  breachConsequences: string;
  terminationTerms: string;
  additionalRules?: string;
}

export default function RulesPoliciesStep({
  data,
  onNext,
  onPrevious,
}: StepProps) {
  const form = useForm<RulesPoliciesForm>({
    defaultValues: {
      dailyDrawdownLimit: (data.dailyDrawdownLimit as string) || "",
      dailyDrawdownValue: (data.dailyDrawdownValue as string) || "",
      maxDrawdownLimit: (data.maxDrawdownLimit as string) || "",
      maxDrawdownValue: (data.maxDrawdownValue as string) || "",
      minimumTradingDays: (data.minimumTradingDays as string) || "",
      weekendHoldingPolicy: (data.weekendHoldingPolicy as "allowed" | "not-allowed" | "conditional") || "not-allowed",
      weekendHoldingNotes: (data.weekendHoldingNotes as string) || "",
      eaBotUsage: (data.eaBotUsage as "allowed" | "not-allowed" | "conditional") || "not-allowed",
      eaBotNotes: (data.eaBotNotes as string) || "",
      copyTradingRules: (data.copyTradingRules as "allowed" | "not-allowed" | "conditional") || "not-allowed",
      copyTradingNotes: (data.copyTradingNotes as string) || "",
      newsTradingPolicy: (data.newsTradingPolicy as "allowed" | "not-allowed" | "conditional") || "not-allowed",
      newsTradingNotes: (data.newsTradingNotes as string) || "",
      refundConditions: (data.refundConditions as string) || "",
      breachConsequences: (data.breachConsequences as string) || "",
      terminationTerms: (data.terminationTerms as string) || "",
      additionalRules: (data.additionalRules as string) || "",
    },
  });

  const onSubmit = (formData: RulesPoliciesForm) => {
    onNext(formData as unknown as Record<string, unknown>);
  };

  const getPolicyIcon = (policy: string) => {
    switch (policy) {
      case "allowed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "not-allowed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "conditional":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Rules & Policies</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Define clear trading rules and policies to set trader expectations.
          </p>

          {/* Drawdown Limits */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Drawdown Limits</CardTitle>
              <CardDescription>Define maximum loss thresholds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="dailyDrawdownLimit"
                  rules={{ required: "Daily drawdown limit is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Drawdown Limit (%) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="5"
                          min="0"
                          max="100"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum daily loss as percentage
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dailyDrawdownValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Drawdown Value</FormLabel>
                      <FormControl>
                        <Input placeholder="$2,500" {...field} />
                      </FormControl>
                      <FormDescription>
                        Fixed dollar amount (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxDrawdownLimit"
                  rules={{ required: "Max drawdown limit is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Drawdown Limit (%) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="10"
                          min="0"
                          max="100"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum total loss as percentage
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxDrawdownValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Drawdown Value</FormLabel>
                      <FormControl>
                        <Input placeholder="$5,000" {...field} />
                      </FormControl>
                      <FormDescription>
                        Fixed dollar amount (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minimumTradingDays"
                  rules={{ required: "Minimum trading days is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Trading Days *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="5"
                          min="0"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Required trading days before payout
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Trading Policies */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Trading Policies</CardTitle>
              <CardDescription>
                Specify what trading activities are permitted
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Weekend Holding */}
              <FormField
                control={form.control}
                name="weekendHoldingPolicy"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="flex items-center gap-2">
                      Weekend Holding Policy
                      {getPolicyIcon(field.value)}
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="allowed" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            ✅ Allowed - Traders can hold positions over weekends
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="not-allowed" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            ❌ Not Allowed - All positions must be closed before weekend
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="conditional" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            ⚠️ Conditional - Allowed with restrictions
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("weekendHoldingPolicy") === "conditional" && (
                <FormField
                  control={form.control}
                  name="weekendHoldingNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weekend Holding Conditions</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Specify conditions..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* EA/Bot Usage */}
              <FormField
                control={form.control}
                name="eaBotUsage"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="flex items-center gap-2">
                      EA/Bot Usage
                      {getPolicyIcon(field.value)}
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="allowed" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            ✅ Allowed - Automated trading systems permitted
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="not-allowed" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            ❌ Not Allowed - Manual trading only
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="conditional" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            ⚠️ Conditional - Allowed with restrictions
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("eaBotUsage") === "conditional" && (
                <FormField
                  control={form.control}
                  name="eaBotNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>EA/Bot Conditions</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Specify conditions..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Copy Trading */}
              <FormField
                control={form.control}
                name="copyTradingRules"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="flex items-center gap-2">
                      Copy Trading Rules
                      {getPolicyIcon(field.value)}
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="allowed" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            ✅ Allowed - Copy trading permitted
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="not-allowed" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            ❌ Not Allowed - No copy trading
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="conditional" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            ⚠️ Conditional - Allowed with restrictions
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("copyTradingRules") === "conditional" && (
                <FormField
                  control={form.control}
                  name="copyTradingNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Copy Trading Conditions</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Specify conditions..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* News Trading */}
              <FormField
                control={form.control}
                name="newsTradingPolicy"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="flex items-center gap-2">
                      News Trading Policy
                      {getPolicyIcon(field.value)}
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="allowed" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            ✅ Allowed - Trading during news events permitted
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="not-allowed" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            ❌ Not Allowed - No trading during major news
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="conditional" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            ⚠️ Conditional - Allowed with restrictions
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("newsTradingPolicy") === "conditional" && (
                <FormField
                  control={form.control}
                  name="newsTradingNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>News Trading Conditions</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Specify conditions..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          {/* Consequences & Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Consequences & Terms</CardTitle>
              <CardDescription>Define violation and termination policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="refundConditions"
                rules={{ required: "Refund conditions are required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Refund Conditions *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe when and how refunds are provided..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="breachConsequences"
                rules={{ required: "Breach consequences are required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breach Consequences *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what happens when rules are violated..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="terminationTerms"
                rules={{ required: "Termination terms are required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Termination Terms *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe account termination conditions..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalRules"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Rules</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any other important rules or policies..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Add any other relevant policies
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

