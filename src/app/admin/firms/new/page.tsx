"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Check } from "lucide-react";
import { useFirmFormStore } from "@/stores/firmFormStore";
import { toast } from "sonner";
import FirmInformationStep from "@/components/firms/steps/firm-information-step";
import TradingPlatformsStep from "@/components/firms/steps/trading-platforms-step";
import PayoutFinancialStep from "@/components/firms/steps/payout-financial-step";
import ChallengeInformationStep from "@/components/firms/steps/challenge-information-step";
import TradingEnvironmentStep from "@/components/firms/steps/trading-environment-step";
import SupportOperationsStep from "@/components/firms/steps/support-operations-step";
import TransparencyVerificationStep from "@/components/firms/steps/transparency-verification-step";
import AdministrationAuditStep from "@/components/firms/steps/administration-audit-step";

const steps = [
  { id: 1, name: "Firm Information", component: FirmInformationStep },
  { id: 2, name: "Trading Platforms", component: TradingPlatformsStep },
  { id: 3, name: "Payout & Financial", component: PayoutFinancialStep },
  { id: 4, name: "Challenge Information", component: ChallengeInformationStep },
  { id: 5, name: "Trading Environment", component: TradingEnvironmentStep },
  { id: 6, name: "Support & Operations", component: SupportOperationsStep },
  { id: 7, name: "Transparency & Verification", component: TransparencyVerificationStep },
  { id: 8, name: "Administration & Audit", component: AdministrationAuditStep },
];

export default function NewFirm() {
  const router = useRouter();
  const {
    currentStep,
    completedSteps,
    formData,
    isSubmitting,
    setCurrentStep,
    updateStepData,
    markStepCompleted,
    saveDraft,
    submitForm,
    clearErrors
  } = useFirmFormStore();

  const CurrentStepComponent = steps.find((s) => s.id === currentStep)?.component;

  const handleStepComplete = async (stepData: Record<string, unknown>) => {
    updateStepData(stepData);
    markStepCompleted(currentStep);
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      const result = await submitForm();
      if (result.success) {
        toast.success('Firm created successfully!');
        router.push('/admin/firms');
      } else {
        toast.error(result.error || 'Failed to create firm');
      }
    }
  };

  const handleSaveDraft = async () => {
    const result = await saveDraft();
    if (result.success) {
      toast.success('Draft saved successfully');
    } else {
      toast.error(result.error || 'Failed to save draft');
    }
  };

  // Clear errors when component mounts
  useEffect(() => {
    clearErrors();
  }, [clearErrors]);

  return (
    <div className="p-6 space-y-6 ">
      <PageHeader
        title="Add New Firm"
        description="Create a new forex firm profile with all required information."
        actions={
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Draft'}
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
              onPrevious={() => setCurrentStep(Math.max(1, currentStep - 1))}
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
