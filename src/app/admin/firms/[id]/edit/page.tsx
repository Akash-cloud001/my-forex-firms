"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, AlertTriangle, ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { steps } from "@/components/crm/firm-form/constants/constant";
import { FirmFormData } from "@/components/crm/firm-form/types/form-types";
import { getDefaultValues } from "@/components/crm/firm-form/constants/default-value";
import { formatDate } from "@/components/crm/firm-form/services/dateFormatter";

function EditFirmContent() {
  const router = useRouter();
  const params = useParams();
  const firmId = params.id as string;

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );

  // Single form for entire wizard with complete defaults
  const methods = useForm<FirmFormData>({
    defaultValues: getDefaultValues(),
  });

  const {
    formState: { isDirty },
    reset,
  } = methods;

  // Fetch firm data
  useEffect(() => {
    const fetchFirm = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/firms/${firmId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch firm");
        }

        const data = await response.json();

        // console.log("Fetched firm data:", data);

        // Reset form with fetched data - mapped to exact API structure
        reset({
          // Step 1: Firm Information
          firmName: data.firmName || "",
          logoUrl: data.logoUrl || "",
          logoFile: null,
          legalEntityName: data.legalEntityName || "",
          registrationNumber: data.registrationNumber || "",
          jurisdiction: data.jurisdiction || "",
          yearFounded: data.yearFounded?.toString() || "",
          headquartersAddress: data.headquartersAddress || "",
          ceoFounderName: data.ceoFounderName || "",
          leadershipLinks: data.leadershipLinks || "",
          officialWebsite: data.officialWebsite || "",
          status: data.status || "active",
          shortDescription: data.shortDescription || "",
          trustPilotRating: data.reviews?.trustPilotRating?.toString() || "",

          // Step 2: Trading Platforms
          tradingPlatforms: Array.isArray(
            data.tradingInfrastructure?.tradingPlatforms
          )
            ? data.tradingInfrastructure.tradingPlatforms.join(", ")
            : data.tradingInfrastructure?.tradingPlatforms || "",
          dataFeedsLiquidityProviders: Array.isArray(
            data.tradingInfrastructure?.dataFeedsLiquidityProviders
          )
            ? data.tradingInfrastructure.dataFeedsLiquidityProviders.join(", ")
            : data.tradingInfrastructure?.dataFeedsLiquidityProviders || "",

          // Step 3: Payout & Financial
          profitSplit: data.payoutFinancial?.profitSplit || "",
          firstPayoutTiming: data.payoutFinancial?.firstPayoutTiming || "",
          regularPayoutCycle: data.payoutFinancial?.regularPayoutCycle || "",
          minimumPayoutAmount: data.payoutFinancial?.minimumPayoutAmount || "",
          averagePayoutProcessingTime:
            data.payoutFinancial?.averagePayoutProcessingTime || "",
          fastestSlowestPayoutDuration:
            data.payoutFinancial?.fastestSlowestPayoutDuration || "",
          payoutMethods: Array.isArray(data.payoutFinancial?.payoutMethods)
            ? data.payoutFinancial.payoutMethods.join(", ")
            : data.payoutFinancial?.payoutMethods || "",
          payoutFeesFxCosts: data.payoutFinancial?.payoutFeesFxCosts || "",
          totalPayoutsAllTime: data.payoutFinancial?.totalPayoutsAllTime || "",
          largestSinglePayout: data.payoutFinancial?.largestSinglePayout || "",
          monthlyPayoutCounts: data.payoutFinancial?.monthlyPayoutCounts || "",
          payoutProofLinks: Array.isArray(
            data.payoutFinancial?.payoutProofLinks
          )
            ? data.payoutFinancial.payoutProofLinks.join(", ")
            : data.payoutFinancial?.payoutProofLinks || "",

          // Step 4: Challenge Information
          challengeInformation: Array.isArray(data.challenges)
            ? data.challenges.map((challenge: any) => ({
                challengeName: challenge.challengeName || "",
                challengeType: challenge.challengeType || "1-step",
                accountSizesPricing: challenge.accountSizesPricing || "",
                profitSplit: challenge.profitSplit || "",
                leverageBreakdown: challenge.leverageBreakdown || "",
                timeLimits: challenge.timeLimits || "",
                minimumTradingDays: challenge.minimumTradingDays || "",
                step1Step2Targets: challenge.step1Step2Targets || "",
                dailyMaxDrawdown: challenge.dailyMaxDrawdown || "",
                refundTerms: challenge.refundTerms || "",
                scalingPlan: challenge.scalingPlan || "",
                allowedInstruments: challenge.allowedInstruments || "",
                rules: challenge.rules || "",
                maxExposureLots: challenge.maxExposureLots || "",
                bonusPromoPolicy: challenge.bonusPromoPolicy || "",
                termsUrl: challenge.termsUrl || "",
                termsLastUpdated: formatDate(challenge.termsLastUpdated),
              }))
            : [],

          // Step 5: Trading Environment
          typicalSpreads: data.tradingEnvironment?.typicalSpreads || "",
          commissions: data.tradingEnvironment?.commissions || "",
          slippageSwapPolicies:
            data.tradingEnvironment?.slippageSwapPolicies || "",
          riskDeskModel: data.tradingEnvironment?.riskDeskModel || "",
          copyTradeProviders: Array.isArray(
            data.tradingEnvironment?.copyTradeProviders
          )
            ? data.tradingEnvironment.copyTradeProviders.join(", ")
            : data.tradingEnvironment?.copyTradeProviders || "",
          mobileSupport: Array.isArray(data.tradingEnvironment?.mobileSupport)
            ? data.tradingEnvironment.mobileSupport.join(", ")
            : data.tradingEnvironment?.mobileSupport || "",
          newsTrading:
            data.tradingEnvironment?.ruleMatrix?.newsTrading || false,
          weekendHolding:
            data.tradingEnvironment?.ruleMatrix?.weekendHolding || false,
          eaUsage: data.tradingEnvironment?.ruleMatrix?.eaUsage || false,
          copyTrading:
            data.tradingEnvironment?.ruleMatrix?.copyTrading || false,
          hedging: data.tradingEnvironment?.ruleMatrix?.hedging || false,
          scalping: data.tradingEnvironment?.ruleMatrix?.scalping || false,
          newsTradingNotes:
            data.tradingEnvironment?.ruleDetails?.newsTradingNotes || "",
          weekendHoldingNotes:
            data.tradingEnvironment?.ruleDetails?.weekendHoldingNotes || "",
          eaUsageNotes:
            data.tradingEnvironment?.ruleDetails?.eaUsageNotes || "",
          copyTradingNotes:
            data.tradingEnvironment?.ruleDetails?.copyTradingNotes || "",
          hedgingNotes:
            data.tradingEnvironment?.ruleDetails?.hedgingNotes || "",
          scalpingNotes:
            data.tradingEnvironment?.ruleDetails?.scalpingNotes || "",

          // Step 6: Support & Operations
          supportChannels: Array.isArray(
            data.supportOperations?.supportChannels
          )
            ? data.supportOperations.supportChannels.join(", ")
            : data.supportOperations?.supportChannels || "",
          averageFirstResponseTime:
            data.supportOperations?.averageFirstResponseTime || "",
          averageResolutionTime:
            data.supportOperations?.averageResolutionTime || "",
          supportHours: data.supportOperations?.supportHours || "",
          escalationPolicy: data.supportOperations?.escalationPolicy || "",
          kycRequirements: data.supportOperations?.kycRequirements || "",
          restrictedCountries: Array.isArray(
            data.supportOperations?.restrictedCountries
          )
            ? data.supportOperations.restrictedCountries.join(", ")
            : data.supportOperations?.restrictedCountries || "",
          amlComplianceLink: data.supportOperations?.amlComplianceLink || "",

          // Step 7: Transparency & Verification
          ceoPublic: data.transparencyVerification?.ceoPublic || false,
          entityOfficeVerified:
            data.transparencyVerification?.entityOfficeVerified || false,
          termsPublicUpdated:
            data.transparencyVerification?.termsPublicUpdated || false,
          payoutProofsPublic:
            data.transparencyVerification?.payoutProofsPublic || false,
          thirdPartyAudit:
            data.transparencyVerification?.thirdPartyAudit || false,
          transparencyNotes:
            data.transparencyVerification?.transparencyNotes || "",

          // Step 8: Administration & Audit
          dataSource: data.administrationAudit?.dataSource || "firm",
          verifiedBy: data.administrationAudit?.verifiedBy || "",
          verificationDate: formatDate(
            data.administrationAudit?.verificationDate
          ),
          nextReviewDate: formatDate(data.administrationAudit?.nextReviewDate),
          changelogNotes: data.administrationAudit?.changelogNotes || "",
        });

        // Mark all steps as completed since we're editing
        setCompletedSteps([1, 2, 3, 4, 5, 6, 7, 8]);
      } catch (err) {
        console.error("Error fetching firm:", err);
        toast.error("Failed to load firm data");
        router.push("/admin/firms");
      } finally {
        setLoading(false);
      }
    };

    if (firmId) {
      fetchFirm();
    }
  }, [firmId, router, reset]);

  const handleStepNext = () => {
    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepPrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = methods.handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);

      console.log("📝 Form Data Object:", data);

      // Create FormData for file uploads
      const formDataToSend = new FormData();

      // Add all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === "logoFile" && value instanceof File) {
          formDataToSend.append(key, value);
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(
            key,
            typeof value === "object" ? JSON.stringify(value) : String(value)
          );
        }
      });

      // console.log("🚀 FormData entries:");
      for (const [key, value] of formDataToSend.entries()) {
        console.log(`  ${key}:`, value);
      }

      const response = await fetch(`/api/firms/${firmId}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to update firm");
      }

      toast.success("Firm updated successfully!");
      router.push(`/admin/firms/${firmId}`);
    } catch (error) {
      console.error("Error updating firm:", error);
      toast.error("Failed to update firm");
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleNavigation = (path: string) => {
    if (isDirty) {
      setPendingNavigation(path);
      setShowWarningModal(true);
    } else {
      router.push(path);
    }
  };

  // Before unload warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = steps[currentStep - 1]?.component;

  return (
    <FormProvider {...methods}>
      <div className="p-6 space-y-6">
        <PageHeader
          title="Edit Firm"
          subtitle={methods.watch("firmName")}
          description="Update firm profile information, ratings, and upload assets."
          actions={
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => handleNavigation(`/admin/firms/${firmId}`)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Firm
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          }
        />

        <section className="grid grid-cols-12 gap-6">
          {/* Form Step Content */}
          <Card className="p-6 col-span-9">
            {CurrentStepComponent && (
              <CurrentStepComponent
                onNext={handleStepNext}
                onPrevious={handleStepPrevious}
                isFirstStep={currentStep === 1}
                isLastStep={currentStep === steps.length}
                onSubmit={handleSubmit}
              />
            )}
          </Card>

          {/* Stepper Navigation */}
          <nav aria-label="Progress" className="col-span-3">
            <Card className="p-4">
              <h3 className="text-lg font-semibold">Form Progress</h3>
              <ol className="space-y-3">
                {steps.map((step) => (
                  <li key={step.id}>
                    <button
                      onClick={() => setCurrentStep(step.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentStep === step.id
                          ? "bg-primary text-primary-foreground"
                          : completedSteps.includes(step.id)
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                            completedSteps.includes(step.id)
                              ? "bg-primary text-primary-foreground"
                              : currentStep === step.id
                              ? "bg-primary-foreground text-primary"
                              : "bg-muted-foreground text-muted"
                          }`}
                        >
                          {completedSteps.includes(step.id) ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            step.id
                          )}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium ${
                              currentStep === step.id
                                ? "text-primary-foreground"
                                : completedSteps.includes(step.id)
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          >
                            {step.name}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ol>
            </Card>
          </nav>
        </section>

        {/* Unsaved Changes Warning Modal */}
        <Dialog open={showWarningModal} onOpenChange={setShowWarningModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Unsaved Changes
              </DialogTitle>
              <DialogDescription>
                You have unsaved changes. Are you sure you want to leave? Your
                changes will be lost.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setShowWarningModal(false)}
                className="w-full sm:w-auto"
              >
                Stay on Page
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (pendingNavigation) {
                    router.push(pendingNavigation);
                  }
                  setShowWarningModal(false);
                }}
                className="w-full sm:w-auto"
              >
                Leave Anyway
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </FormProvider>
  );
}

export default function EditFirm() {
  return (
    <Suspense
      fallback={
        <div className="p-6 space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      }
    >
      <EditFirmContent />
    </Suspense>
  );
}
