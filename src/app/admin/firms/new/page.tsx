"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { steps, STORAGE_KEY } from "@/components/crm/firm-form/constants/constant";
import { getDefaultValues } from "@/components/crm/firm-form/constants/default-value";
import { FirmFormData, firmFormSchema, stepSchemas } from "@/components/crm/firm-form/schemas/schema";

function NewFirmContent() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(false);

  const methods = useForm<FirmFormData>({
    resolver: zodResolver(firmFormSchema),
    defaultValues: getDefaultValues(),
    mode: "onChange",
  });

  const { formState: { isDirty, errors }, watch, reset, trigger } = methods;

  useEffect(() => {
    console.log("Form State - isDirty:", isDirty, "Current Step:", currentStep);
    console.log("Form Errors:", errors);
  }, [isDirty, currentStep, errors]);

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

  const validateCurrentStep = async () => {
    const currentSchema = stepSchemas[currentStep as keyof typeof stepSchemas];
    if (!currentSchema) return true;

    // Get field names for current step
    const fieldNames = Object.keys(currentSchema.shape);
    
    // Trigger validation for current step fields
    const isValid = await trigger(fieldNames as any);
    
    if (!isValid) {
      // Show error toast with first error message
      const firstError = Object.values(errors).find(e => e?.message);
      if (firstError) {
        toast.error(firstError.message as string);
      } else {
        toast.error("Please fill in all required fields before proceeding");
      }
    }
    
    return isValid;
  };

  const handleStepNext = async () => {
    // Validate current step before proceeding
    const isValid = await validateCurrentStep();
    
    if (!isValid) {
      return;
    }

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

  const handleStepChange = async (stepId: number) => {
    // If navigating to a future step, validate current step first
    if (stepId > currentStep) {
      const isValid = await validateCurrentStep();
      if (!isValid) {
        return;
      }
      
      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
    }
    
    setCurrentStep(stepId);
  };

  const handleSaveDraft = () => {
    toast.success('Draft saved successfully');
  };

 const handleSubmit = methods.handleSubmit(async (data) => {
  try {
    setIsSubmitting(true);

    console.log("Form Data:", data);

    const formDataToSend = new FormData();

    if (data.logoFile instanceof File) {
      formDataToSend.append("logoFile", data.logoFile);
    }

    Object.entries(data).forEach(([key, value]) => {
      if (key === "logoFile") return;
      if (value !== null && value !== undefined) {
        const valueToSend =
          typeof value === "object" ? JSON.stringify(value) : String(value);
        formDataToSend.append(key, valueToSend);
      }
    });

    formDataToSend.append("isDraft", "false");
    formDataToSend.append("isPublished", "false");

    const response = await fetch("/api/firms", {
      method: "POST",
      body: formDataToSend,
    });

    const dataResponse = await response.json();

    if (!response.ok) {
      throw new Error(dataResponse.error || "Failed to create firm");
    }

    toast.success("Firm created successfully!");
    localStorage.removeItem(STORAGE_KEY);
    router.push("/admin/firms");
  } catch (error: unknown) {
    console.error("Error creating firm:", error);

    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Failed to create firm");
    }
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
                      onClick={() => handleStepChange(step.id)}
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