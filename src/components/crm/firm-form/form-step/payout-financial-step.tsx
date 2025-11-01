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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StepProps {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function PayoutFinancialStep({ onNext, onPrevious }: StepProps) {
  const { control } = useFormContext();

  return (
    <div className="space-y-8">
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
                control={control}
                name="profitSplit"
                rules={{ required: "Profit split is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profit Split *</FormLabel>
                    <FormControl>
                      <Input placeholder="80/20 or 70/30" {...field} />
                    </FormControl>
                    <FormDescription>
                      Trader/Firm percentage split
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="firstPayoutTiming"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Payout Timing</FormLabel>
                    <FormControl>
                      <Input placeholder="After 30 days or immediately" {...field}/>
                    </FormControl>
                    <FormDescription>
                      When first payout becomes available
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="regularPayoutCycle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Regular Payout Cycle</FormLabel>
                    <FormControl>
                      <Input placeholder="Weekly, Bi-weekly, Monthly" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="minimumPayoutAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Payout Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="$100 or €50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Payout Performance</CardTitle>
            <CardDescription>
              Historical payout data and processing metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="averagePayoutProcessingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average Payout Processing Time</FormLabel>
                    <FormControl>
                      <Input placeholder="2-3 business days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="fastestSlowestPayoutDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fastest / Slowest Payout Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="Same day / 5 business days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="payoutMethods"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payout Methods</FormLabel>
                    <FormControl>
                      <Input placeholder="Bank Transfer, Wise, Crypto, PayPal" {...field} />
                    </FormControl>
                    <FormDescription>
                      Available payment methods
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="payoutFeesFxCosts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payout Fees / FX Costs</FormLabel>
                    <FormControl>
                      <Input placeholder="Free or $5 fee" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Financial Statistics</CardTitle>
            <CardDescription>
              Historical payout volumes and proof documentation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="totalPayoutsAllTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Payouts (All-Time)</FormLabel>
                    <FormControl>
                      <Input placeholder="$50M or 10,000 payouts" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="largestSinglePayout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Largest Single Payout</FormLabel>
                    <FormControl>
                      <Input placeholder="$100,000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="monthlyPayoutCounts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Payout Counts</FormLabel>
                    <FormControl>
                      <Input placeholder="500-800 per month" {...field} />
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
              control={control}
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
        <Button type="button" onClick={onNext}>Next Step</Button>
      </div>
    </div>
  );
}