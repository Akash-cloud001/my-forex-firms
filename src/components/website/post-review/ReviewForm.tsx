"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ReviewFormData } from "../types/types";
import { reviewFormSchema } from "../schema/schema";
import { ISSUE_CATEGORIES, DESCRIPTION_CONFIG } from "../constant/constants";
import { StarRating } from "./StarRating";
import { FileUpload } from "./FileUpload";
import { IssueTypeSelector } from "./IssueTypeSelector";
import { SuccessModal, ErrorModal } from "./ReviewModals";
import { FirmSelector } from "./FirmSelector";

export const ReviewForm: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  type FirmInfo = { name: string; id?: string };

  const [selectedFirm, setSelectedFirm] = useState<FirmInfo>({ name: "" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      firmName: "",
      firmId: "",
      customFirmName: "",
      issueCategory: "",
      issueSubCategory: "",
      customIssueType: "",
      description: "",
      // rating: 0,
      files: [],
    },
  });

  // const watchedRating = watch("rating");
  const watchedDescription = watch("description");
  const watchedIssueCategory = watch("issueCategory");
  const watchedIssueSubCategory = watch("issueSubCategory");
  const watchedFirmName = watch("firmName");

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmittingForm(true);
    try {
      const formData = new FormData();

      // Append all form fields
      formData.append('firmName', data.firmName);
      if (data.firmId) formData.append('firmId', data.firmId);
      if (data.customFirmName) formData.append('customFirmName', data.customFirmName);
      formData.append('issueCategory', data.issueCategory);
      // Map issueSubCategory to issueType for backend
      formData.append('issueType', data.issueSubCategory);
      if (data.customIssueType) formData.append('customIssueType', data.customIssueType);
      formData.append('description', data.description);
      // Default rating to 1 for now as it's commented out in schema
      formData.append('rating', '1');

      // Append files
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });
      console.log(formData, "formData")
      const response = await fetch('/api/reviews', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      setShowThankYouModal(true);
      reset();
      setSelectedFiles([]);
      setSelectedFirm({ name: "" }); // Reset firm selector
    } catch (error) {
      console.error("Error submitting review:", error);
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred.");
      setShowErrorModal(true);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Review Form</CardTitle>
          <CardDescription>
            Please provide detailed information about your experience. All
            fields are required unless marked optional.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Firm Selection */}
            <FirmSelector
              value={selectedFirm.name}
              onChange={(name, id) => {
                setSelectedFirm({ name, id });
                setValue("firmName", name);
                setValue("firmId", id ?? "");
              }}
              error={errors.firmName?.message}
            />

            {/* Custom Firm Name Input */}
            {watchedFirmName === "Other" && (
              <div className="space-y-2">
                <Label htmlFor="customFirmName" className="text-sm font-medium">
                  Please specify the firm name *
                </Label>
                <Input
                  id="customFirmName"
                  placeholder="Enter the firm name..."
                  className={cn(errors.customFirmName && "border-destructive")}
                  {...register("customFirmName")}
                />
                {errors.customFirmName && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.customFirmName.message}
                  </p>
                )}
              </div>
            )}


            {/* Issue Type Selection */}
            <IssueTypeSelector
              issueCategories={ISSUE_CATEGORIES}
              selectedCategory={watchedIssueCategory}
              selectedSubCategory={watchedIssueSubCategory}
              onCategoryChange={(val) => {
                setValue("issueCategory", val);
                setValue("issueSubCategory", ""); // Reset sub-category when category changes
              }}
              onSubCategoryChange={(val) => setValue("issueSubCategory", val)}
              error={errors.issueCategory?.message || errors.issueSubCategory?.message}
            />

            {/* Custom Issue Type Input */}
            {watchedIssueSubCategory.startsWith("other-") && (
              <div className="space-y-2">
                <Label
                  htmlFor="customIssueType"
                  className="text-sm font-medium"
                >
                  Please specify the issue type *
                </Label>
                <Textarea
                  id="customIssueType"
                  placeholder="Enter the specific issue type..."
                  className={cn(errors.customIssueType && "border-destructive")}
                  {...register("customIssueType")}
                />
                {errors.customIssueType && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.customIssueType.message}
                  </p>
                )}
              </div>
            )}

            {/* Description */}
            <div className="space-y-3">
              <Label htmlFor="description" className="text-base font-semibold">
                Description *
              </Label>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  To help verify your review, please include:
                </p>
                <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1 ml-4">
                  <li>Specific dates and timeframes</li>
                  <li>Transaction or account reference numbers</li>
                  <li>Steps you&apos;ve taken to resolve the issue</li>
                  <li>Communication received from the firm</li>
                </ul>
              </div>
              <Textarea
                id="description"
                placeholder="Please describe your experience in detail."
                className={cn(
                  "min-h-32 resize-none",
                  errors.description && "border-destructive"
                )}
                {...register("description")}
              />
              <div className="flex justify-between items-center text-sm">
                <span
                  className={cn(
                    "text-sm",
                    (watchedDescription?.length || 0) >
                      DESCRIPTION_CONFIG.maxLength
                      ? "text-destructive"
                      : "text-muted-foreground"
                  )}
                >
                  {watchedDescription?.length || 0}/
                  {DESCRIPTION_CONFIG.maxLength}
                </span>
              </div>
              {errors.description && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Rating
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Overall Rating *
              </Label>
              <StarRating
                value={watchedRating}
                onChange={(rating) => setValue("rating", rating)}
                error={errors.rating?.message}
              />
            </div> */}

            {/* File Upload */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Upload Proof Documents <small>(upload atleast One)</small> 
              </Label>
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <div className="text-blue-600 dark:text-blue-400 text-lg">
                    💡
                  </div>
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    <strong>Tip:</strong> Uploading proof (screenshots, emails,
                    statements) significantly increases the credibility of your
                    review and helps us verify your experience.
                  </p>
                </div>
              </div>
              <FileUpload
                files={selectedFiles}
                onFilesChange={setSelectedFiles}
                error={errors.files?.message}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmittingForm}
                className="min-w-32 btn-grad"
              >
                {isSubmittingForm ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground max-w-3xl mx-auto mt-8 px-5 text-center">
        Help the trading community by sharing your experience with prop firms.
        Your review contributes to our PropTrust Index™ and helps other traders
        make informed decisions.
      </p>

      {/* Modals */}
      <SuccessModal
        open={showThankYouModal}
        onOpenChange={setShowThankYouModal}
      />
      <ErrorModal
        open={showErrorModal}
        onOpenChange={setShowErrorModal}
        errorMessage={errorMessage}
      />
    </>
  );
};
