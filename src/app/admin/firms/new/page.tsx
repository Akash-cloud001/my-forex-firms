"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Check } from "lucide-react";
import FirmInformationStep from "@/components/firms/steps/firm-information-step";
import SocialCommunicationStep from "@/components/firms/steps/social-communication-step";
import TradingPlatformsStep from "@/components/firms/steps/trading-platforms-step";
import PayoutFinancialStep from "@/components/firms/steps/payout-financial-step";
import ChallengeInformationStep from "@/components/firms/steps/challenge-information-step";
import TradingEnvironmentStep from "@/components/firms/steps/trading-environment-step";
import PricingPromotionsStep from "@/components/firms/steps/pricing-promotions-step";
import SupportOperationsStep from "@/components/firms/steps/support-operations-step";
import TransparencyVerificationStep from "@/components/firms/steps/transparency-verification-step";
import AdministrationAuditStep from "@/components/firms/steps/administration-audit-step";

const steps = [
  { id: 1, name: "Firm Information", component: FirmInformationStep },
  { id: 2, name: "Social & Communication", component: SocialCommunicationStep },
  { id: 3, name: "Trading Platforms", component: TradingPlatformsStep },
  { id: 4, name: "Payout & Financial", component: PayoutFinancialStep },
  { id: 5, name: "Challenge Information", component: ChallengeInformationStep },
  { id: 6, name: "Trading Environment", component: TradingEnvironmentStep },
  { id: 7, name: "Pricing & Promotions", component: PricingPromotionsStep },
  { id: 8, name: "Support & Operations", component: SupportOperationsStep },
  { id: 9, name: "Transparency & Verification", component: TransparencyVerificationStep },
  { id: 10, name: "Administration & Audit", component: AdministrationAuditStep },
];

export default function NewFirm() {
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

      <section className="grid grid-cols-12 gap-6">
        {/* Form Step Content */}
        <Card className="p-6 col-span-9">
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


    </div>
  );
}
