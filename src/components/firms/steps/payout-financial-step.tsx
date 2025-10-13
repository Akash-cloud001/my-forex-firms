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

interface PayoutFinancialForm {
  profitSplit: string;
  firstPayoutTiming: string;
  regularPayoutCycle: string;
  minimumPayoutAmount: string;
  averagePayoutProcessingTime: string;
  fastestSlowestPayoutDuration: string;
  payoutMethods: string;
  payoutFeesFxCosts: string;
  totalPayoutsAllTime: string;
  largestSinglePayout: string;
  monthlyPayoutCounts: string;
  payoutProofLinks: string;
}

export default function PayoutFinancialStep({
  data,
  onNext,
  onPrevious,
}: StepProps) {
  const form = useForm<PayoutFinancialForm>({
    defaultValues: {
      profitSplit: (data.profitSplit as string) || "",
      firstPayoutTiming: (data.firstPayoutTiming as string) || "",
      regularPayoutCycle: (data.regularPayoutCycle as string) || "",
      minimumPayoutAmount: (data.minimumPayoutAmount as string) || "",
      averagePayoutProcessingTime: (data.averagePayoutProcessingTime as string) || "",
      fastestSlowestPayoutDuration: (data.fastestSlowestPayoutDuration as string) || "",
      payoutMethods: (data.payoutMethods as string) || "",
      payoutFeesFxCosts: (data.payoutFeesFxCosts as string) || "",
      totalPayoutsAllTime: (data.totalPayoutsAllTime as string) || "",
      largestSinglePayout: (data.largestSinglePayout as string) || "",
      monthlyPayoutCounts: (data.monthlyPayoutCounts as string) || "",
      payoutProofLinks: (data.payoutProofLinks as string) || "",
    },
  });

  const onSubmit = (formData: PayoutFinancialForm) => {
    onNext(formData as unknown as Record<string, unknown>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold">Payout & Financial Data</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Provide detailed payout information and financial performance data.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Payout Structure</CardTitle>
              <CardDescription>
                Basic payout terms and timing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="profitSplit"
                  rules={{ required: "Profit split is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profit Split *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="80/20 or 70/30"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Trader/Firm percentage split
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="firstPayoutTiming"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Payout Timing</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="After 30 days or immediately"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        When first payout becomes available
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="regularPayoutCycle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regular Payout Cycle</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Weekly, Bi-weekly, Monthly"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minimumPayoutAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Payout Amount</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="$100 or €50"
                          {...field}
                        />
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
              <CardTitle>Payout Performance</CardTitle>
              <CardDescription>
                Historical payout data and processing metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="averagePayoutProcessingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average Payout Processing Time</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="2-3 business days"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fastestSlowestPayoutDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fastest / Slowest Payout Duration</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Same day / 5 business days"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payoutMethods"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payout Methods</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Bank Transfer, Wise, Crypto, PayPal"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Available payment methods
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payoutFeesFxCosts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payout Fees / FX Costs</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Free or $5 fee"
                          {...field}
                        />
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
              <CardTitle>Financial Statistics</CardTitle>
              <CardDescription>
                Historical payout volumes and proof documentation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="totalPayoutsAllTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Payouts (All-Time)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="$50M or 10,000 payouts"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="largestSinglePayout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Largest Single Payout</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="$100,000"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monthlyPayoutCounts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Payout Counts</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="500-800 per month"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Typical monthly payout volume
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="payoutProofLinks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payout Proof Links</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="URLs to payout proof screenshots, testimonials, or verification pages..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Links to public proof of payouts (one per line)
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
