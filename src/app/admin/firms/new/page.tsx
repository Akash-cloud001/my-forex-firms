"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, AlertTriangle } from "lucide-react";
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

function NewFirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  
  const {
    currentStep,
    completedSteps,
    formData,
    isSubmitting,
    setCurrentStep,
    updateStepData,
    markStepCompleted,
    autoSaveDraft,
    submitForm,
    clearErrors,
    resetForm,
    loadDraft,
    loadFromLocalStorage
  } = useFirmFormStore();

  const CurrentStepComponent = steps.find((s) => s.id === currentStep)?.component;

  const handleStepComplete = async (stepData: Record<string, unknown>) => {
    updateStepData(stepData);
    markStepCompleted(currentStep);
    setHasUnsavedChanges(true);
    
    // Auto-save draft on each step completion
    if (currentStep < steps.length) {
      try {
        await autoSaveDraft();
        toast.success('Progress saved automatically');
      } catch (error) {
        console.warn('Auto-save failed:', error);
      }
      setCurrentStep(currentStep + 1);
    } else {
      // Form is complete, submit and clear draft
      const result = await submitForm();
      if (result.success) {
        toast.success('Firm created successfully! Draft cleared.');
        setHasUnsavedChanges(false);
        router.push('/admin/firms');
      } else {
        toast.error(result.error || 'Failed to create firm');
      }
    }
  };

  const handleSaveDraft = async () => {
    const result = await autoSaveDraft();
    if (result.success) {
      toast.success('Draft saved successfully');
      setHasUnsavedChanges(false);
    } else {
      toast.error(result.error || 'Failed to save draft');
    }
  };

  const handleNavigation = (path: string) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(path);
      setShowWarningModal(true);
    } else {
      router.push(path);
    }
  };

  const handleConfirmNavigation = () => {
    if (pendingNavigation) {
      setHasUnsavedChanges(false);
      router.push(pendingNavigation);
    }
    setShowWarningModal(false);
    setPendingNavigation(null);
  };

  const handleCancelNavigation = () => {
    setShowWarningModal(false);
    setPendingNavigation(null);
  };

  // Route change warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Load from local storage on mount
  useEffect(() => {
    const loaded = loadFromLocalStorage();
    if (loaded) {
      setHasUnsavedChanges(true);
    }
  }, []);

  // Load draft if specified in URL
  useEffect(() => {
    const draftId = searchParams.get('draft');
    if (draftId) {
      setLoadingDraft(true);
      loadDraft(draftId).then((result) => {
        if (result.success) {
          toast.success('Draft loaded successfully');
          setHasUnsavedChanges(true);
        } else {
          toast.error(result.error || 'Failed to load draft');
        }
        setLoadingDraft(false);
      });
    }
    // Don't reset form automatically - let the form start fresh naturally
  }, [searchParams, loadDraft]);

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
            <Button 
              variant="outline" 
              onClick={() => handleNavigation('/admin/firms')}
            >
              Cancel
            </Button>
          </div>
        }
      />

      <section className="grid grid-cols-12 gap-6">
        {/* Form Step Content */}
        <Card className="p-6 col-span-9">
          {loadingDraft ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading draft...
            </div>
          ) : CurrentStepComponent ? (
            <CurrentStepComponent
              data={formData}
              onNext={handleStepComplete}
              onPrevious={() => setCurrentStep(Math.max(1, currentStep - 1))}
              isFirstStep={currentStep === 1}
              isLastStep={currentStep === steps.length}
            />
          ) : null}
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

      {/* Warning Modal */}
      <Dialog open={showWarningModal} onOpenChange={setShowWarningModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Unsaved Changes
            </DialogTitle>
            <DialogDescription>
              You have unsaved changes. If you leave now, your progress will be saved as a draft, but you may lose some recent changes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelNavigation}>
              Stay on Page
            </Button>
            <Button variant="destructive" onClick={handleConfirmNavigation}>
              Leave Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function NewFirm() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <NewFirmContent />
    </Suspense>
  );
}
