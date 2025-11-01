"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { steps, STORAGE_KEY } from "@/components/crm/firm-form/constants/constant";
import { FirmFormData } from "@/components/crm/firm-form/types/form-types";
import { getDefaultValues } from "@/components/crm/firm-form/constants/default-value";

function NewFirmContent() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(false);

  const methods = useForm<FirmFormData>({
    defaultValues: getDefaultValues()
  });

  const { formState: { isDirty }, watch, reset } = methods;

  useEffect(() => {
    console.log("Form State - isDirty:", isDirty, "Current Step:", currentStep);
  }, [isDirty, currentStep]);

  // Auto-save to localStorage
  useEffect(() => {
    if (isDirty) {
      const subscription = watch((value) => {
        try {
          const draftData = {
            formData: value,
            currentStep,
            completedSteps,
            timestamp: Date.now(),
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData));
        } catch (error) {
          console.error('Failed to save draft:', error);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, currentStep, completedSteps, isDirty]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { formData, currentStep: savedStep, completedSteps: savedCompleted } = JSON.parse(saved);
        reset(formData);
        setCurrentStep(savedStep);
        setCompletedSteps(savedCompleted);
        toast.info('Draft loaded from previous session');
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  }, [reset]);

  const handleStepNext = () => {
    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      toast.success('Progress saved');
    }
  };

  const handleStepPrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    toast.success('Draft saved successfully');
  };

const handleSubmit = methods.handleSubmit(async (data) => {
  try {
    setIsSubmitting(true);
    
    console.log("Form Data:", data);
    
    // Create FormData for file uploads
    const formDataToSend = new FormData();
    
    // Handle logo file separately if it exists
    if (data.logoFile instanceof File) {
      formDataToSend.append('logoFile', data.logoFile);
    }
    
    // Append all form fields (API will handle the transformation)
    Object.entries(data).forEach(([key, value]) => {
      // Skip logoFile as we already handled it
      if (key === 'logoFile') return;
      
      if (value !== null && value !== undefined) {
        const valueToSend = typeof value === 'object' 
          ? JSON.stringify(value) 
          : String(value);
        formDataToSend.append(key, valueToSend);
      }
    });

    // Add system flags
    formDataToSend.append('isDraft', 'false');
    formDataToSend.append('isPublished', 'false');

    // Log FormData contents for debugging
    console.log("FormData entries being sent:");
    for (const [key, value] of formDataToSend.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}:`, `[File: ${value.name}]`);
      } else {
        console.log(`  ${key}:`, value);
      }
    }

    // Send request
    const response = await fetch('/api/firms', {
      method: 'POST',
      body: formDataToSend
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create firm');
    }

    const result = await response.json();
    console.log("Firm created successfully:", result);

    // Clear localStorage on success
    localStorage.removeItem(STORAGE_KEY);
    
    toast.success('Firm created successfully!');
    router.push('/admin/firms');
  } catch (error) {
    console.error('Error creating firm:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to create firm');
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
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const CurrentStepComponent = steps[currentStep - 1]?.component;

  return (
    <FormProvider {...methods}>
      <div className="p-6 space-y-6">
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
                onNext={handleStepNext}
                onPrevious={handleStepPrevious}
                isFirstStep={currentStep === 1}
                isLastStep={currentStep === steps.length}
                onSubmit={handleSubmit}
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
                You have unsaved changes. Your progress is saved locally. Are you sure you want to leave?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowWarningModal(false)}>
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

export default function NewFirm() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <NewFirmContent />
    </Suspense>
  );
}