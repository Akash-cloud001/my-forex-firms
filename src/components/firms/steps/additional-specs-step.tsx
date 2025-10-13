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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StepProps {
  data: Record<string, unknown>;
  onNext: (data: Record<string, unknown>) => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

interface AdditionalSpecsForm {
  challengePassRate?: string;
  riskDeskType: string;
  liquidityProviders?: string;
  accountType: string;
  supportLanguages: string;
  regulationInfo?: string;
  partnerships?: string;
  apiAvailability: string;
  additionalInfo?: string;
}

export default function AdditionalSpecsStep({
  data,
  onNext,
  onPrevious,
  isLastStep,
}: StepProps) {
  const form = useForm<AdditionalSpecsForm>({
    defaultValues: {
      challengePassRate: (data.challengePassRate as string) || "",
      riskDeskType: (data.riskDeskType as string) || "",
      liquidityProviders: (data.liquidityProviders as string) || "",
      accountType: (data.accountType as string) || "",
      supportLanguages: (data.supportLanguages as string) || "",
      regulationInfo: (data.regulationInfo as string) || "",
      partnerships: (data.partnerships as string) || "",
      apiAvailability: (data.apiAvailability as string) || "not-available",
      additionalInfo: (data.additionalInfo as string) || "",
    },
  });

  const onSubmit = (formData: AdditionalSpecsForm) => {
    onNext(formData as unknown as Record<string, unknown>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Additional Specifications</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Provide additional transparency and deep insights about the firm.
          </p>

          {/* Performance Metrics */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Statistics about trader success rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="challengePassRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Challenge Pass Rate (%)</FormLabel>
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
                      Percentage of traders who successfully complete challenges
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Technical Infrastructure */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Technical Infrastructure</CardTitle>
              <CardDescription>
                Backend systems and account structure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="riskDeskType"
                rules={{ required: "Risk desk type is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Desk Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select risk desk type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="internal">Internal Risk Management</SelectItem>
                        <SelectItem value="external">External Risk Management</SelectItem>
                        <SelectItem value="hybrid">Hybrid (Internal + External)</SelectItem>
                        <SelectItem value="not-disclosed">Not Disclosed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Type of risk management system used
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="liquidityProviders"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Liquidity Providers</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., LMAX, Forex.com, Interactive Brokers"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Banks or institutions backing liquidity (comma-separated)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountType"
                rules={{ required: "Account type is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="simulated">Simulated / Demo</SelectItem>
                        <SelectItem value="live">Live Funded</SelectItem>
                        <SelectItem value="hybrid">
                          Hybrid (Demo → Live progression)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Type of trading accounts offered
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Support & Compliance */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Support & Compliance</CardTitle>
              <CardDescription>
                Language support and regulatory information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="supportLanguages"
                rules={{ required: "Support languages are required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Support Languages *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="English, Spanish, French, German"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Available customer support languages (comma-separated)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="regulationInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Regulation / Licenses</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Licensed by FCA (UK), regulated by CySEC (Cyprus)"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Regulatory bodies, licenses, and compliance information
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="partnerships"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partnerships & Affiliations</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Partner with TradingView, Member of XYZ Association"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Strategic partners and industry affiliations
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* API & Integration */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>API & Data Access</CardTitle>
              <CardDescription>
                Third-party integration capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="apiAvailability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Availability</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select API status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">
                          <div className="flex items-center gap-2">
                            <Badge variant="default" className="text-xs">Available</Badge>
                            <span>Public API Available</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">Private</Badge>
                            <span>Partner-Only API</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="planned">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">Planned</Badge>
                            <span>In Development</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="not-available">
                          <span>Not Available</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Data access for third-party integrations (future feature)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>
                Any other relevant details not covered above
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any other important information about the firm..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Add any other relevant information
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
          <Button type="submit">
            {isLastStep ? "Complete & Submit" : "Next Step"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

