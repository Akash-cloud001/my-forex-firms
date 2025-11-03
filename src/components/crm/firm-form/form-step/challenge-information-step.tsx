"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface StepProps {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function ChallengeInformationStep({
  onNext,
  onPrevious,
}: StepProps) {
  const { control, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "challengeInformation",
  });

  const addChallenge = () => {
    append({
      challengeName: "",
      challengeType: "",
      accountSizesPricing: "",
      profitSplit: "",
      leverageBreakdown: "",
      timeLimits: "",
      minimumTradingDays: "",
      step1Step2Targets: "",
      dailyMaxDrawdown: "",
      maxExposureLots: "",
      refundTerms: "",
      scalingPlan: "",
      allowedInstruments: "",
      rules: "",
      bonusPromoPolicy: "",
      termsUrl: "",
      termsLastUpdated: "",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold">Challenge Information</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Define up to 3 challenge types with detailed specifications.
        </p>

        <div className="space-y-6">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Challenge #{index + 1}</CardTitle>
                    <CardDescription>
                      Configure challenge parameters and rules
                    </CardDescription>
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Basic Challenge Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={control}
                    name={`challengeInformation.${index}.challengeName`}
                    rules={{ required: "Challenge name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Challenge Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Standard Challenge" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`challengeInformation.${index}.challengeType`}
                    rules={{ required: "Challenge type is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Challenge Type *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-step">1-Step Challenge</SelectItem>
                            <SelectItem value="2-step">2-Step Challenge</SelectItem>
                            <SelectItem value="instant">Instant Funding</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`challengeInformation.${index}.accountSizesPricing`}
                    rules={{ required: "Account sizes and pricing is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Sizes and Pricing *</FormLabel>
                        <FormControl>
                          <Input placeholder="10K-$199, 25K-$299, 50K-$499" {...field} />
                        </FormControl>
                        <FormDescription>
                          Available account sizes with pricing
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`challengeInformation.${index}.profitSplit`}
                    rules={{ required: "Profit split is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profit Split *</FormLabel>
                        <FormControl>
                          <Input placeholder="80/20" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Challenge Parameters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={control}
                    name={`challengeInformation.${index}.leverageBreakdown`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Leverage Breakdown</FormLabel>
                        <FormControl>
                          <Input placeholder="FX: 1:100, Indices: 1:20, Metals: 1:50" {...field} />
                        </FormControl>
                        <FormDescription>
                          Leverage for different instrument types
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`challengeInformation.${index}.timeLimits`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Limits</FormLabel>
                        <FormControl>
                          <Input placeholder="Unlimited or 30 days" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`challengeInformation.${index}.minimumTradingDays`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Trading Days</FormLabel>
                        <FormControl>
                          <Input placeholder="5 days" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`challengeInformation.${index}.step1Step2Targets`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Step 1 / Step 2 Targets</FormLabel>
                        <FormControl>
                          <Input placeholder="8% profit target" {...field} />
                        </FormControl>
                        <FormDescription>
                          Profit targets for each step
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Risk Management */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={control}
                    name={`challengeInformation.${index}.dailyMaxDrawdown`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Daily / Max Drawdown</FormLabel>
                        <FormControl>
                          <Input placeholder="5% daily, 10% max" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`challengeInformation.${index}.maxExposureLots`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Exposure / Lots</FormLabel>
                        <FormControl>
                          <Input placeholder="10 lots max" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Terms and Policies */}
                <div className="space-y-6">
                  <FormField
                    control={control}
                    name={`challengeInformation.${index}.refundTerms`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Refund Terms</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Full refund on first payout or 14-day money-back guarantee"
                            className="min-h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`challengeInformation.${index}.scalingPlan`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scaling Plan</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="20% increase every 3 months with consistent profits"
                            className="min-h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`challengeInformation.${index}.allowedInstruments`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allowed Instruments</FormLabel>
                        <FormControl>
                          <Input placeholder="FX, Indices, Metals, Crypto, Stocks" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`challengeInformation.${index}.rules`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rules</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="News trading: Allowed, Weekend holding: Not allowed, EA usage: Allowed, etc."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Trading rules and restrictions
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`challengeInformation.${index}.bonusPromoPolicy`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bonus / Promo Policy</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="No bonuses or promotional offers available"
                            className="min-h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Legal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={control}
                    name={`challengeInformation.${index}.termsUrl`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Terms URL</FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://company.com/terms"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`challengeInformation.${index}.termsLastUpdated`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Terms Last Updated</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {fields.length < 3 && (
            <Button type="button" variant="outline" onClick={addChallenge} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Another Challenge Type
            </Button>
          )}
        </div>
      </div>

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