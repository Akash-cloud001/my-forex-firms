"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { preventEnterSubmit } from "@/lib/formUtils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StepProps {
  data: Record<string, unknown>;
  onNext: (data: Record<string, unknown>) => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

interface PricingPromotionsForm {
  priceTable: string;
  discountsCoupons: string;
  refundPolicy: string;
}

export default function PricingPromotionsStep({
  data,
  onNext,
  onPrevious,
}: StepProps) {
  const form = useForm<PricingPromotionsForm>({
    defaultValues: {
      priceTable: (data.priceTable as string) || "",
      discountsCoupons: (data.discountsCoupons as string) || "",
      refundPolicy: (data.refundPolicy as string) || "",
    },
  });

  const onSubmit = (formData: PricingPromotionsForm) => {
    onNext(formData as unknown as Record<string, unknown>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} onKeyDown={preventEnterSubmit} className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold">Pricing & Promotions</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Define pricing structure and promotional policies.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Pricing Information</CardTitle>
              <CardDescription>
                Challenge pricing and promotional details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="priceTable"
                rules={{ required: "Price table is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Table *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="10K: $199, 25K: $299, 50K: $499, 100K: $899"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Complete pricing for all account sizes
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discountsCoupons"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discounts / Coupons</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="10% off for first-time users, 20% off for returning customers"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Available discounts and promotional codes
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="refundPolicy"
                rules={{ required: "Refund policy is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Refund Policy *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Full refund on first payout, 14-day money-back guarantee"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Clear refund terms and conditions
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
