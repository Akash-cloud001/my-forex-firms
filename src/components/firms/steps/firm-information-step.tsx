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
import { Upload, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface StepProps {
  data: Record<string, unknown>;
  onNext: (data: Record<string, unknown>) => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

interface FirmInformationForm {
  firmName: string;
  logoUrl: string;
  logoFile: File | null;
  legalEntityName: string;
  registrationNumber: string;
  jurisdiction: string;
  yearFounded: string;
  headquartersAddress: string;
  ceoFounderName: string;
  leadershipLinks: string;
  officialWebsite: string;
  status: "active" | "paused" | "suspended" | "closed";
  shortDescription: string;
}

export default function FirmInformationStep({
  data,
  onNext,
  isFirstStep,
}: StepProps) {
  const form = useForm<FirmInformationForm>({
    defaultValues: {
      firmName: (data.firmName as string) || "",
      logoUrl: (data.logoUrl as string) || "",
      logoFile: null,
      legalEntityName: (data.legalEntityName as string) || "",
      registrationNumber: (data.registrationNumber as string) || "",
      jurisdiction: (data.jurisdiction as string) || "",
      yearFounded: (data.yearFounded as string) || "",
      headquartersAddress: (data.headquartersAddress as string) || "",
      ceoFounderName: (data.ceoFounderName as string) || "",
      leadershipLinks: (data.leadershipLinks as string) || "",
      officialWebsite: (data.officialWebsite as string) || "",
      status: (data.status as "active" | "paused" | "suspended" | "closed") || "active",
      shortDescription: (data.shortDescription as string) || "",
    },
  });

  const onSubmit = (formData: FirmInformationForm) => {
    onNext(formData as unknown as Record<string, unknown>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold">Firm Information</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Provide essential company details and legal information.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Basic Company Details</CardTitle>
              <CardDescription>
                Core information about the firm and its legal structure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-6">

                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Firm Logo/Image</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="logoFile"
                            render={({ field: fileField }) => (
                              <div>
                                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 hover:border-muted-foreground/50 transition-colors">
                                  <div className="flex flex-row justify-center gap-4 items-center space-y-3">
                                    <Upload className="h-10 w-10 text-muted-foreground" />
                                    <div className="text-center">
                                      <label htmlFor="logo-upload" className="cursor-pointer text-primary hover:text-primary/80 font-medium">
                                        Click to upload
                                      </label>
                                      <input
                                        id="logo-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0] || null;
                                          fileField.onChange(file);
                                          if (file) {
                                            form.setValue("logoUrl", "");
                                          }
                                        }}
                                      />
                                      <span className="text-muted-foreground"> or drag and drop</span>
                                      <p className="text-xs text-muted-foreground">
                                        PNG, JPG, GIF up to 10MB
                                      </p>
                                    </div>
                                  </div>
                                  {fileField.value && (
                                    <div className="mt-4 flex items-center justify-between bg-muted p-3 rounded-md">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-12 h-12 relative overflow-hidden bg-primary/10 rounded flex items-center justify-center">
                                          {/* image preview */}
                                          <Image src={URL.createObjectURL(fileField.value)} alt={fileField.value.name} className="w-full h-full object-cover" fill />
                                        </div>
                                        <span className="text-sm font-medium truncate">
                                          {fileField.value.name}
                                        </span>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          fileField.onChange(null);
                                          const input = document.getElementById("logo-upload") as HTMLInputElement;
                                          if (input) input.value = "";
                                        }}
                                        className="h-8 w-8 p-0"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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

              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <FormField
                  control={form.control}
                  name="legalEntityName"
                  rules={{ required: "Legal entity name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legal Entity Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., FTMO s.r.o." {...field} />
                      </FormControl>
                      <FormDescription>
                        Official registered company name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registrationNumber"
                  rules={{ required: "Registration number is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 12345678" {...field} />
                      </FormControl>
                      <FormDescription>
                        Company registration or tax ID
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jurisdiction"
                  rules={{ required: "Jurisdiction is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jurisdiction *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Czech Republic" {...field} />
                      </FormControl>
                      <FormDescription>
                        Country or state of registration
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yearFounded"
                  rules={{ required: "Year founded is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year Founded *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="2015"
                          min="1900"
                          max={new Date().getFullYear()}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  rules={{ required: "Status is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="headquartersAddress"
                rules={{ required: "Headquarters address is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headquarters Address *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Full address including city, state, country"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Leadership & Contact</CardTitle>
              <CardDescription>
                Information about company leadership and official channels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="ceoFounderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEO / Founder Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Doe" {...field} />
                      </FormControl>
                      <FormDescription>
                        Public leadership information
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="leadershipLinks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leadership Links</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://linkedin.com/in/ceo-name"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Public profiles (LinkedIn, Twitter, etc.)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                    <FormItem className="md:col-span-2">
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
              </div>

              <FormField
                control={form.control}
                name="shortDescription"
                rules={{ required: "Short description is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Company Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the firm and its services..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A concise overview of the firm (2-3 sentences)
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
