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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StepProps {
  data: Record<string, unknown>;
  onNext: (data: Record<string, unknown>) => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

interface TransparencyVerificationForm {
  ceoPublic: boolean;
  entityOfficeVerified: boolean;
  termsPublicUpdated: boolean;
  payoutProofsPublic: boolean;
  thirdPartyAudit: boolean;
  transparencyNotes: string;
}

export default function TransparencyVerificationStep({
  data,
  onNext,
  onPrevious,
}: StepProps) {
  const form = useForm<TransparencyVerificationForm>({
    defaultValues: {
      ceoPublic: ((data.transparencyVerification as Record<string, unknown>)?.ceoPublic as boolean) || (data.ceoPublic as boolean) || false,
      entityOfficeVerified: ((data.transparencyVerification as Record<string, unknown>)?.entityOfficeVerified as boolean) || (data.entityOfficeVerified as boolean) || false,
      termsPublicUpdated: ((data.transparencyVerification as Record<string, unknown>)?.termsPublicUpdated as boolean) || (data.termsPublicUpdated as boolean) || false,
      payoutProofsPublic: ((data.transparencyVerification as Record<string, unknown>)?.payoutProofsPublic as boolean) || (data.payoutProofsPublic as boolean) || false,
      thirdPartyAudit: ((data.transparencyVerification as Record<string, unknown>)?.thirdPartyAudit as boolean) || (data.thirdPartyAudit as boolean) || false,
      transparencyNotes: ((data.transparencyVerification as Record<string, unknown>)?.transparencyNotes as string) || (data.transparencyNotes as string) || "",
    },
  });

  const onSubmit = (formData: TransparencyVerificationForm) => {
    onNext(formData as unknown as Record<string, unknown>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} onKeyDown={preventEnterSubmit} className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold">Transparency & Verification</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Verify transparency indicators and public information availability.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Transparency Indicators</CardTitle>
              <CardDescription>
                Public information and verification status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="ceoPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>CEO Public</FormLabel>
                        <FormDescription>
                          CEO/founder information is publicly available
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="entityOfficeVerified"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Entity / Office Verified</FormLabel>
                        <FormDescription>
                          Company entity and office location verified
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="termsPublicUpdated"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Terms Public & Updated</FormLabel>
                        <FormDescription>
                          Terms and conditions are publicly available and current
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payoutProofsPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Payout Proofs Public</FormLabel>
                        <FormDescription>
                          Payout proofs and testimonials are publicly available
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="thirdPartyAudit"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Third-Party Audit</FormLabel>
                        <FormDescription>
                          Company has undergone third-party financial audit
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="transparencyNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transparency Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional transparency information, certifications, or verification details..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Any additional transparency or verification information
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
