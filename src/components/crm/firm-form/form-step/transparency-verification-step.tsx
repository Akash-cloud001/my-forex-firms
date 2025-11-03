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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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

export default function TransparencyVerificationStep({
  onNext,
  onPrevious,
}: StepProps) {
  const form = useFormContext();

  return (
    <div className="space-y-8">
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
            {/* Checkbox Fields */}
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

            {/* Notes Textarea */}
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
        <Button type="button" onClick={onNext}>
          Next Step
        </Button>
      </div>
    </div>
  );
}
