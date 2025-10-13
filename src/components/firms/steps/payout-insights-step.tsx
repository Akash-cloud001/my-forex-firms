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

interface PayoutInsightsForm {
  totalVerifiedPayouts: string;
  avgPayoutProcessingTime: string;
  fastestPayoutRecord: string;
  largestPayoutRecord: string;
  payoutProofGalleryUrls?: string;
  bankTransferPercentage?: string;
  cryptoPercentage?: string;
  paypalPercentage?: string;
  otherPayoutMethodsPercentage?: string;
  payoutNotes?: string;
}

export default function PayoutInsightsStep({
  data,
  onNext,
  onPrevious,
}: StepProps) {
  const form = useForm<PayoutInsightsForm>({
    defaultValues: {
      totalVerifiedPayouts: (data.totalVerifiedPayouts as string) || "",
      avgPayoutProcessingTime: (data.avgPayoutProcessingTime as string) || "",
      fastestPayoutRecord: (data.fastestPayoutRecord as string) || "",
      largestPayoutRecord: (data.largestPayoutRecord as string) || "",
      payoutProofGalleryUrls: (data.payoutProofGalleryUrls as string) || "",
      bankTransferPercentage: (data.bankTransferPercentage as string) || "",
      cryptoPercentage: (data.cryptoPercentage as string) || "",
      paypalPercentage: (data.paypalPercentage as string) || "",
      otherPayoutMethodsPercentage: (data.otherPayoutMethodsPercentage as string) || "",
      payoutNotes: (data.payoutNotes as string) || "",
    },
  });

  const onSubmit = (formData: PayoutInsightsForm) => {
    onNext(formData as unknown as Record<string, unknown>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Payout Insights</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Showcase verified payout performance data to build trader trust.
          </p>

          {/* Payout Statistics */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Payout Statistics</CardTitle>
              <CardDescription>
                Key metrics about payout performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="totalVerifiedPayouts"
                  rules={{ required: "Total verified payouts is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Verified Payouts *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1,250"
                          min="0"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Number of completed payouts
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="avgPayoutProcessingTime"
                  rules={{ required: "Average processing time is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avg. Payout Processing Time *</FormLabel>
                      <FormControl>
                        <Input placeholder="2-3 business days" {...field} />
                      </FormControl>
                      <FormDescription>
                        Mean duration from request to payment
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fastestPayoutRecord"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fastest Payout Record</FormLabel>
                      <FormControl>
                        <Input placeholder="Same day / 4 hours" {...field} />
                      </FormControl>
                      <FormDescription>
                        Shortest processing time on record
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="largestPayoutRecord"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Largest Payout Record</FormLabel>
                      <FormControl>
                        <Input placeholder="$50,000" {...field} />
                      </FormControl>
                      <FormDescription>
                        Highest single payout amount
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payout Method Distribution */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Payout Method Distribution</CardTitle>
              <CardDescription>
                Breakdown of payment methods used (percentages should total 100%)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="bankTransferPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Transfer (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="50"
                          min="0"
                          max="100"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Percentage via bank transfer
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cryptoPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cryptocurrency (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="30"
                          min="0"
                          max="100"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Percentage via crypto payments
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paypalPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PayPal (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="15"
                          min="0"
                          max="100"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Percentage via PayPal
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="otherPayoutMethodsPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Methods (%)</FormLabel>
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
                        Percentage via other methods
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payout Proof */}
          <Card>
            <CardHeader>
              <CardTitle>Payout Proof Documentation</CardTitle>
              <CardDescription>
                Evidence of successful payouts for transparency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="payoutProofGalleryUrls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payout Proof Gallery URLs</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter URLs separated by commas or new lines&#10;https://example.com/proof1.png&#10;https://example.com/proof2.png"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      URLs to uploaded screenshots or documents (one per line)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payoutNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Payout Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional information about payouts, special conditions, or noteworthy achievements..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Add context or special notes about payout history
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">📊 Future Features</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Monthly Payout Trend Chart (6-12 months)</li>
              <li>• Interactive payout timeline visualization</li>
              <li>• Automated payout proof verification</li>
              <li>• Real-time payout tracking integration</li>
            </ul>
          </div>
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

