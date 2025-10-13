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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface StepProps {
  data: Record<string, unknown>;
  onNext: (data: Record<string, unknown>) => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

interface BasicInformationForm {
  firmName: string;
  logoUrl?: string;
  foundedYear: string;
  country: string;
  headquarters: string;
  ceoName?: string;
  officialWebsite: string;
  supportEmail: string;
  supportPhone?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  discordUrl?: string;
  telegramUrl?: string;
  description?: string;
  supportedPlatforms: string;
  payoutMethods: string;
  maxFunding: string;
  profitSplit: string;
  payoutFrequency: string;
}

export default function BasicInformationStep({
  data,
  onNext,
  isFirstStep,
}: StepProps) {
  const form = useForm<BasicInformationForm>({
    defaultValues: {
      firmName: (data.firmName as string) || "",
      logoUrl: (data.logoUrl as string) || "",
      foundedYear: (data.foundedYear as string) || "",
      country: (data.country as string) || "",
      headquarters: (data.headquarters as string) || "",
      ceoName: (data.ceoName as string) || "",
      officialWebsite: (data.officialWebsite as string) || "",
      supportEmail: (data.supportEmail as string) || "",
      supportPhone: (data.supportPhone as string) || "",
      facebookUrl: (data.facebookUrl as string) || "",
      twitterUrl: (data.twitterUrl as string) || "",
      linkedinUrl: (data.linkedinUrl as string) || "",
      instagramUrl: (data.instagramUrl as string) || "",
      discordUrl: (data.discordUrl as string) || "",
      telegramUrl: (data.telegramUrl as string) || "",
      description: (data.description as string) || "",
      supportedPlatforms: (data.supportedPlatforms as string) || "",
      payoutMethods: (data.payoutMethods as string) || "",
      maxFunding: (data.maxFunding as string) || "",
      profitSplit: (data.profitSplit as string) || "",
      payoutFrequency: (data.payoutFrequency as string) || "",
    },
  });

  const onSubmit = (formData: BasicInformationForm) => {
    onNext(formData as unknown as Record<string, unknown>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Provide essential firm details for brand identification and transparency.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Firm Name */}
            <FormField
              control={form.control}
              name="firmName"
              rules={{ required: "Firm name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firm Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., FTMO" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Logo URL */}
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/logo.png"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>URL to the firm&apos;s logo image</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Founded Year */}
            <FormField
              control={form.control}
              name="foundedYear"
              rules={{ required: "Founded year is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Founded Year *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="2015"
                      min="1900"
                      max={new Date().getFullYear()}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Company longevity indicator</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Country */}
            <FormField
              control={form.control}
              name="country"
              rules={{ required: "Country is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="cz">Czech Republic</SelectItem>
                      <SelectItem value="ae">United Arab Emirates</SelectItem>
                      <SelectItem value="cy">Cyprus</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Headquarters */}
            <FormField
              control={form.control}
              name="headquarters"
              rules={{ required: "Headquarters is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Headquarters *</FormLabel>
                  <FormControl>
                    <Input placeholder="Prague, Czech Republic" {...field} />
                  </FormControl>
                  <FormDescription>Geographic location</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CEO Name */}
            <FormField
              control={form.control}
              name="ceoName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEO Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormDescription>Leadership transparency</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Official Website */}
            <FormField
              control={form.control}
              name="officialWebsite"
              rules={{
                required: "Official website is required",
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: "Please enter a valid URL",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Official Website *</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Support Email */}
            <FormField
              control={form.control}
              name="supportEmail"
              rules={{
                required: "Support email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Support Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="support@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Support Phone */}
            <FormField
              control={form.control}
              name="supportPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Support Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div>
          <h4 className="text-base font-semibold mb-4">Social Media Links</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Engagement channels (optional)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="facebookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://facebook.com/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="twitterUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter / X</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://twitter.com/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://linkedin.com/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instagramUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://instagram.com/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discordUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discord</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://discord.gg/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telegramUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telegram</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://t.me/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Quick Overview */}
        <div>
          <h4 className="text-base font-semibold mb-4">Quick Overview</h4>
          
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firm Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the firm..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A short description of the firm and its offerings
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="supportedPlatforms"
                rules={{ required: "Supported platforms are required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supported Platforms *</FormLabel>
                    <FormControl>
                      <Input placeholder="MT4, MT5, cTrader" {...field} />
                    </FormControl>
                    <FormDescription>Comma-separated list</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payoutMethods"
                rules={{ required: "Payout methods are required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payout Methods *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Bank Transfer, Crypto, PayPal"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Comma-separated list</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxFunding"
                rules={{ required: "Max funding is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Funding *</FormLabel>
                    <FormControl>
                      <Input placeholder="$200,000" {...field} />
                    </FormControl>
                    <FormDescription>Maximum account size offered</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profitSplit"
                rules={{ required: "Profit split is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profit Split *</FormLabel>
                    <FormControl>
                      <Input placeholder="80/20" {...field} />
                    </FormControl>
                    <FormDescription>
                      Trader/Firm percentage share
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payoutFrequency"
                rules={{ required: "Payout frequency is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payout Frequency *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="on-demand">On Demand</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Payment intervals</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-border">
          <div>
            {!isFirstStep && (
              <Button type="button" variant="outline" disabled>
                Previous
              </Button>
            )}
          </div>
          <Button type="submit">Next Step</Button>
        </div>
      </form>
    </Form>
  );
}

