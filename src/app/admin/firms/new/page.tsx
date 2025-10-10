"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import BasicInformationStep from "@/components/firms/steps/basic-information-step";
import ChallengeTypesStep from "@/components/firms/steps/challenge-types-step";
import RulesPoliciesStep from "@/components/firms/steps/rules-policies-step";
import PayoutInsightsStep from "@/components/firms/steps/payout-insights-step";
import AdditionalSpecsStep from "@/components/firms/steps/additional-specs-step";

const steps = [
  { id: 1, name: "Basic Information", component: BasicInformationStep },
  { id: 2, name: "Challenge Types", component: ChallengeTypesStep },
  { id: 3, name: "Rules & Policies", component: RulesPoliciesStep },
  { id: 4, name: "Payout Insights", component: PayoutInsightsStep },
  { id: 5, name: "Additional Specs", component: AdditionalSpecsStep },
];

export default function NewFirm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  const CurrentStepComponent = steps.find((s) => s.id === currentStep)?.component;

  const handleStepComplete = (stepData: Record<string, unknown>) => {
    // Save step data
    setFormData((prev) => ({ ...prev, ...stepData }));
    
    // Mark step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    // Move to next step or finish
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Final submission
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    try {
      // TODO: Submit all form data to API
      console.log("Final form data:", formData);
      // router.push("/admin/firms");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleSaveDraft = async () => {
    try {
      // TODO: Save current progress as draft
      console.log("Saving draft:", formData);
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  return (
    <div className="p-6 space-y-6 ">
      <PageHeader
        title="Add New Firm"
        description="Create a new forex firm profile with all required information."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveDraft}>
              Save Draft
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/firms">Cancel</Link>
            </Button>
          </div>
        }
      />

      {/* Stepper Navigation */}
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between">
            {steps.map((step, stepIdx) => (
              <li
                key={step.id}
                className={`relative ${
                  stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20 flex-1" : ""
                }`}
              >
                {/* Connector Line */}
                {stepIdx !== steps.length - 1 && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 left-4 -ml-px mt-0.5 h-0.5 w-full"
                    aria-hidden="true"
                  >
                    <div
                      className={`h-full w-full ${
                        completedSteps.includes(step.id) || currentStep > step.id
                          ? "bg-primary"
                          : "bg-muted"
                      }`}
                    />
                  </div>
                )}

                <button
                  onClick={() => setCurrentStep(step.id)}
                  className="group relative flex items-center bg-background"
                >
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${
                        completedSteps.includes(step.id)
                          ? "bg-primary"
                          : currentStep === step.id
                          ? "border-2 border-primary bg-background"
                          : "border-2 border-muted bg-background"
                      }`}
                    >
                      {completedSteps.includes(step.id) ? (
                        <Check className="h-5 w-5 text-primary-foreground" />
                      ) : (
                        <span
                          className={`${
                            currentStep === step.id
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        >
                          {step.id}
                        </span>
                      )}
                    </span>
                    <span
                      className={`ml-4 text-sm font-medium ${
                        currentStep === step.id
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.name}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

      {/* Form Step Content */}
      <Card className="p-6 w-full">
        {CurrentStepComponent && (
          <CurrentStepComponent
            data={formData}
            onNext={handleStepComplete}
            onPrevious={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            isFirstStep={currentStep === 1}
            isLastStep={currentStep === steps.length}
          />
        )}
      </Card>
    </div>
  );
}
