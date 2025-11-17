/* eslint-disable */
// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import { FirmFormData, firmFormSchema, STORAGE_KEY } from "./schema/schema";
import { FormProvider, useForm } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import Step1FirmDetails from "./steps/Step1FirmDetails";
import { Step2Leadership } from "./steps/Step2Leadership";
import { Step3Ratings } from "./steps/Step3Ratings";
import { Step4SocialLinks } from "./steps/Step4SocialLinks";
import { Step5Support } from "./steps/Step5Support";
import Step6Compliance from "./steps/Step6Compliance";
import { Step7Transparency } from "./steps/Step7Transparency";
import { Step8Trading } from "./steps/Step8Trading";
import { Step9Payments } from "./steps/Step9Payments";

const steps = [
  { id: 1, name: "Firm Details", fields: "firmDetails" as const },
  { id: 2, name: "Leadership", fields: "leadership" as const },
  { id: 3, name: "Ratings", fields: "ratings" as const },
  { id: 4, name: "Social Links", fields: "socialLinks" as const },
  { id: 5, name: "Support", fields: "support" as const },
  { id: 6, name: "Compliance", fields: "compliance" as const },
  { id: 7, name: "Transparency", fields: "transparency" as const },
  { id: 8, name: "Trading", fields: "trading" as const },
  { id: 9, name: "Payments", fields: "payments" as const },
];

const stepComponents = [
  Step1FirmDetails,
  Step2Leadership,
  Step3Ratings,
  Step4SocialLinks,
  Step5Support,
  Step6Compliance,
  Step7Transparency,
  Step8Trading,
  Step9Payments,
];

interface FundingFirmFormProps {
  initialData?: FirmFormData;
  firmId?: string;
  isEditMode?: boolean;
}

export default function FundingFirmForm({
  initialData,
  firmId,
  isEditMode = false,
}: FundingFirmFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [_isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: string;
    message: string;
  } | null>(null);

  const defaultValues: FirmFormData = {
    firmDetails: {
      name: "",
      image: undefined,
      imageFile: undefined,
      legalEntityName: "",
      registrationNumber: "",
      licenseNumber: "",
      regulator: "",
      jurisdiction: "",
      yearFounded: new Date().getFullYear(),
      status: "",
      hqAddress: "",
      languagesSupported: [],
      companyDescription: "",
      officialWebsite: "",
      brokers: [],
      liquidityProviders: [],
    },
    leadership: {
      leadership: [],
    },
    ratings: {
      trustPilotRating: undefined,
      otherRatings: [],
    },
    socialLinks: {
      socialLinks: {},
    },
    support: {
      channels: [],
      avgResolutionTime: "",
      supportHours: "",
    },
    compliance: {
      kycRequirements: [],
      kycProvider: "",
      restrictedCountries: [],
      regulationsComplied: [],
      amlLink: "",
    },
    transparency: {
      ceoPublic: false,
      officeVerified: false,
      termsPublicUpdated: false,
      payoutProofPublic: false,
      thirdPartyAudit: false,
      notes: "",
      transparencyScore: undefined,
    },
    trading: {
      leverageMatrix: {},
      commissions: {},
    },
    payments: {
      methods: [],
      payoutMethods: [],
      baseCurrency: "",
      minWithdrawal: undefined,
      processingTime: "",
      payoutSchedule: "",
      refundPolicy: "",
    },
  };

  const methods = useForm<FirmFormData>({
    resolver: zodResolver(firmFormSchema) as any,
    mode: "onChange",
    defaultValues: initialData || defaultValues,
  });

  const {
    formState: { isDirty, errors },
    watch,
    reset,
    trigger,
  } = methods;

  useEffect(() => {
    if (isEditMode && initialData) {
      reset(initialData);
    }
  }, [isEditMode, initialData, reset]);

  useEffect(() => {
    if (!isEditMode && isDirty) {
      const subscription = watch((value) => {
        const draftData = {
          formData: value,
          currentStep,
          completedSteps,
          timestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData));
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, currentStep, completedSteps, isDirty, isEditMode]);

  useEffect(() => {
    if (!isEditMode) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const {
            formData,
            currentStep: savedStep,
            completedSteps: savedCompleted,
          } = JSON.parse(saved);
          reset(formData);
          setCurrentStep(savedStep);
          setCompletedSteps(savedCompleted);
        } catch (e) {
          console.error("Failed to load draft:", e);
        }
      }
    }
  }, [reset, isEditMode]);

  const validateCurrentStep = async () => {
    const stepField = steps[currentStep - 1].fields;
    const isValid = await trigger(stepField);
    return isValid;
  };

  const handleStepNext = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return;

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepPrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleStepChange = async (stepId: number) => {
    if (stepId > currentStep) {
      const isValid = await validateCurrentStep();
      if (!isValid) return;
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
      }
    }
    setCurrentStep(stepId);
  };

  const handleSubmit = methods.handleSubmit(async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();

    // Append all fields (stringify objects)
    Object.entries(data).forEach(([section, values]) => {
      if (section === "firmDetails" && values.imageFile) {
        formData.append("firmDetails.imageFile", values.imageFile);
        // Append other firmDetails fields as JSON string
        const { imageFile, ...rest } = values;
        formData.append(section, JSON.stringify(rest));
      } else {
        formData.append(section, JSON.stringify(values));
      }
    });

    console.log("🚀 ~ FundingFirmForm ~ formData:", formData)
    try {
      const url = isEditMode ? `/api/admin/firm/${firmId}` : "/api/admin/firm";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });

      const result = await res.json();

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message: isEditMode
            ? "Funding firm updated successfully!"
            : "Funding firm created successfully!",
        });

        if (!isEditMode) {
          localStorage.removeItem(STORAGE_KEY);
        }

        setCompletedSteps([]);
        setCurrentStep(1);

        setTimeout(() => {
          window.location.href = "/admin/firm-management";
        }, 1000);
      } else {
        setSubmitStatus({
          type: "error",
          message:
            result.message ||
            `Failed to ${isEditMode ? "update" : "create"} firm`,
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus({
        type: "error",
        message: "An error occurred while submitting the form",
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  });

  const CurrentStepComponent = stepComponents[currentStep - 1];

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-primary">
              {isEditMode ? "Edit Funding Firm" : "Add New Funding Firm"}
            </h1>
            <p className="text-gray-600">
              {isEditMode
                ? "Update the funding firm information"
                : "Create a new forex firm profile with all required information"}
            </p>
          </div>

          {submitStatus && (
            <Alert
              className={`mb-6 ${
                submitStatus.type === "success"
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <AlertDescription
                className={
                  submitStatus.type === "success"
                    ? "text-green-800"
                    : "text-red-800"
                }
              >
                {submitStatus.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-12 gap-6">
            {/* Form Content */}
            <div className="col-span-12 lg:col-span-9">
              <Card className="p-6">
                <form onSubmit={handleSubmit}>
                  <CurrentStepComponent
                    onNext={handleStepNext}
                    onPrevious={handleStepPrevious}
                    isFirstStep={currentStep === 1}
                    isLastStep={currentStep === steps.length}
                    onSubmit={handleSubmit}
                  />
                </form>
              </Card>
            </div>

            {/* Stepper Navigation */}
            <nav className="col-span-12 lg:col-span-3">
              <Card className="p-4 sticky top-6">
                <h3 className="text-lg font-semibold mb-4">Form Progress</h3>
                <ol className="space-y-3">
                  {steps.map((step) => (
                    <li key={step.id}>
                      <button
                        type="button"
                        onClick={() => handleStepChange(step.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          currentStep === step.id
                            ? "bg-sidebar-ring text-white"
                            : completedSteps.includes(step.id)
                            ? "bg-primary/10 text-primary"
                            : "bg-primary/10 hover:bg-primary/10 text-white"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                              completedSteps.includes(step.id)
                                ? "bg-primary/30 text-white"
                                : currentStep === step.id
                                ? "bg-white text-blue-600"
                                : "bg-gray-300 text-gray-600"
                            }`}
                          >
                            {completedSteps.includes(step.id) ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              step.id
                            )}
                          </span>
                          <p className="text-sm font-medium">{step.name}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ol>
              </Card>
            </nav>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
