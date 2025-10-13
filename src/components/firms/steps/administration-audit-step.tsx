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

interface StepProps {
  data: Record<string, unknown>;
  onNext: (data: Record<string, unknown>) => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

interface AdministrationAuditForm {
  dataSource: "firm" | "mff" | "community";
  verifiedBy: string;
  verificationDate: string;
  nextReviewDate: string;
  changelogNotes: string;
}

export default function AdministrationAuditStep({
  data,
  onNext,
  onPrevious,
}: StepProps) {
  const form = useForm<AdministrationAuditForm>({
    defaultValues: {
      dataSource: (data.dataSource as "firm" | "mff" | "community") || "firm",
      verifiedBy: (data.verifiedBy as string) || "",
      verificationDate: (data.verificationDate as string) || "",
      nextReviewDate: (data.nextReviewDate as string) || "",
      changelogNotes: (data.changelogNotes as string) || "",
    },
  });

  const onSubmit = (formData: AdministrationAuditForm) => {
    onNext(formData as unknown as Record<string, unknown>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold">Administration & Audit</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Final administrative details and audit information.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Data Source & Verification</CardTitle>
              <CardDescription>
                Information source and verification details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="dataSource"
                rules={{ required: "Data source is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Source *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select data source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="firm">Firm</SelectItem>
                        <SelectItem value="mff">My Forex Firms</SelectItem>
                        <SelectItem value="community">Community</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Primary source of the information
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="verifiedBy"
                rules={{ required: "Verified by is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verified By *</FormLabel>
                    <FormControl>
                      <Input placeholder="Admin Name or System" {...field} />
                    </FormControl>
                    <FormDescription>
                      Who verified this information
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="verificationDate"
                  rules={{ required: "Verification date is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Date *</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nextReviewDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Next Review Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        When this information should be reviewed next
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="changelogNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Changelog Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Document any changes, updates, or modifications to the firm's information..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Track changes and updates to the firm&apos;s profile
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
          <Button type="submit">Submit Firm</Button>
        </div>
      </form>
    </Form>
  );
}
