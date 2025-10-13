"use client";

// import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface StepProps {
  data: Record<string, unknown>;
  onNext: (data: Record<string, unknown>) => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

interface ChallengeType {
  accountType: string;
  maxFunding: string;
  profitSplit: string;
  challengePrice: string;
  leverage: string;
  timeLimit: string;
  payoutCycle: string;
  refundPolicy: string;
  scalingPlanDetails?: string;
  allowEA: boolean;
  allowCopyTrading: boolean;
  allowNewsTrading: boolean;
  allowWeekendHolding: boolean;
}

interface ChallengeTypesForm {
  challenges: ChallengeType[];
}

export default function ChallengeTypesStep({
  data,
  onNext,
  onPrevious,
}: StepProps) {
  const form = useForm<ChallengeTypesForm>({
    defaultValues: {
      challenges: (data.challenges as ChallengeType[]) || [
        {
          accountType: "",
          maxFunding: "",
          profitSplit: "",
          challengePrice: "",
          leverage: "",
          timeLimit: "",
          payoutCycle: "",
          refundPolicy: "",
          scalingPlanDetails: "",
          allowEA: false,
          allowCopyTrading: false,
          allowNewsTrading: false,
          allowWeekendHolding: false,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "challenges",
  });

  const onSubmit = (formData: ChallengeTypesForm) => {
    onNext(formData as unknown as Record<string, unknown>);
  };

  const addChallenge = () => {
    append({
      accountType: "",
      maxFunding: "",
      profitSplit: "",
      challengePrice: "",
      leverage: "",
      timeLimit: "",
      payoutCycle: "",
      refundPolicy: "",
      scalingPlanDetails: "",
      allowEA: false,
      allowCopyTrading: false,
      allowNewsTrading: false,
      allowWeekendHolding: false,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Challenge Types & Account Options</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Define the various challenge programs and account types offered by the firm.
          </p>

          <div className="space-y-6">
            {fields.map((field, index) => (
              <Card key={field.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Challenge #{index + 1}</CardTitle>
                      <CardDescription>
                        Configure challenge parameters and features
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Account Type */}
                    <FormField
                      control={form.control}
                      name={`challenges.${index}.accountType`}
                      rules={{ required: "Account type is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1-step">1-Step Challenge</SelectItem>
                              <SelectItem value="2-step">2-Step Challenge</SelectItem>
                              <SelectItem value="instant">Instant Funding</SelectItem>
                              <SelectItem value="evaluation">Evaluation</SelectItem>
                              <SelectItem value="standard">Standard</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Max Funding */}
                    <FormField
                      control={form.control}
                      name={`challenges.${index}.maxFunding`}
                      rules={{ required: "Max funding is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Funding *</FormLabel>
                          <FormControl>
                            <Input placeholder="$100,000" {...field} />
                          </FormControl>
                          <FormDescription>Maximum tradable capital</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Profit Split */}
                    <FormField
                      control={form.control}
                      name={`challenges.${index}.profitSplit`}
                      rules={{ required: "Profit split is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profit Split *</FormLabel>
                          <FormControl>
                            <Input placeholder="80/20" {...field} />
                          </FormControl>
                          <FormDescription>Trader/Firm revenue share</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Challenge Price */}
                    <FormField
                      control={form.control}
                      name={`challenges.${index}.challengePrice`}
                      rules={{ required: "Challenge price is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Challenge Price *</FormLabel>
                          <FormControl>
                            <Input placeholder="$499" {...field} />
                          </FormControl>
                          <FormDescription>Entry fee</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Leverage */}
                    <FormField
                      control={form.control}
                      name={`challenges.${index}.leverage`}
                      rules={{ required: "Leverage is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Leverage *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select leverage" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1:10">1:10</SelectItem>
                              <SelectItem value="1:30">1:30</SelectItem>
                              <SelectItem value="1:50">1:50</SelectItem>
                              <SelectItem value="1:100">1:100</SelectItem>
                              <SelectItem value="1:200">1:200</SelectItem>
                              <SelectItem value="1:500">1:500</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>Maximum leverage multiplier</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Time Limit */}
                    <FormField
                      control={form.control}
                      name={`challenges.${index}.timeLimit`}
                      rules={{ required: "Time limit is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Limit *</FormLabel>
                          <FormControl>
                            <Input placeholder="Unlimited / 30 days" {...field} />
                          </FormControl>
                          <FormDescription>Duration of challenge period</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Payout Cycle */}
                    <FormField
                      control={form.control}
                      name={`challenges.${index}.payoutCycle`}
                      rules={{ required: "Payout cycle is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payout Cycle *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select cycle" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="on-demand">On Demand</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>Frequency of profit withdrawals</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Refund Policy */}
                    <FormField
                      control={form.control}
                      name={`challenges.${index}.refundPolicy`}
                      rules={{ required: "Refund policy is required" }}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Refund Policy *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Full refund on first payout"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Conditions under which fees are returned
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Scaling Plan Details */}
                    <FormField
                      control={form.control}
                      name={`challenges.${index}.scalingPlanDetails`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Scaling Plan Details</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="20% increase every 3 months with consistent profits"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Rules for increasing capital limits
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Feature Permissions */}
                  <div>
                    <h4 className="text-sm font-semibold mb-4">Feature Permissions</h4>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`challenges.${index}.allowEA`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Allow EA/Bot Usage</FormLabel>
                              <FormDescription>
                                Permit automated trading systems
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`challenges.${index}.allowCopyTrading`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Allow Copy Trading</FormLabel>
                              <FormDescription>
                                Permit copying trades from other accounts
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`challenges.${index}.allowNewsTrading`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Allow News Trading</FormLabel>
                              <FormDescription>
                                Permit trading during news events
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`challenges.${index}.allowWeekendHolding`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Allow Weekend Holding</FormLabel>
                              <FormDescription>
                                Permit holding positions over weekends
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addChallenge}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Challenge Type
            </Button>
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

