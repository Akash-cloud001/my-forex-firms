"use client";

import { useFormContext } from "react-hook-form";
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
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface StepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export default function SupportOperationsStep({ onNext, onPrevious }: StepProps) {
  const form = useFormContext();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold">Support & Operations</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Define support channels, response times, and operational requirements.
        </p>

        {/* --- Support Channels Card --- */}
        <Card>
          <CardHeader>
            <CardTitle>Support Channels</CardTitle>
            <CardDescription>
              Available support methods and response metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="supportChannels"
              rules={{ required: "Support channels are required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Support Channels *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email, Live Chat, Discord, Telegram"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Available support methods</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="averageFirstResponseTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average First Response Time</FormLabel>
                    <FormControl>
                      <Input placeholder="< 2 hours" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="averageResolutionTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average Resolution Time</FormLabel>
                    <FormControl>
                      <Input placeholder="< 24 hours" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supportHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Support Hours</FormLabel>
                    <FormControl>
                      <Input placeholder="24/7, Mon-Fri 9AM-6PM, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="escalationPolicy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Escalation Policy</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Issues escalated to senior support within 4 hours"
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* --- Compliance & Restrictions Card --- */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance & Restrictions</CardTitle>
            <CardDescription>
              KYC requirements and geographical restrictions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="kycRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>KYC Requirements</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Valid ID, proof of address, bank statement"
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Required documents for account verification
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="restrictedCountries"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restricted Countries</FormLabel>
                  <FormControl>
                    <Input placeholder="US, Iran, North Korea" {...field} />
                  </FormControl>
                  <FormDescription>
                    Countries where services are not available
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amlComplianceLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AML / Compliance Link</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://company.com/compliance"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Link to compliance and AML policies
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
