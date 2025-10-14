"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, AlertTriangle, ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import FirmInformationStep from "@/components/firms/steps/firm-information-step";
import TradingPlatformsStep from "@/components/firms/steps/trading-platforms-step";
import PayoutFinancialStep from "@/components/firms/steps/payout-financial-step";
import ChallengeInformationStep from "@/components/firms/steps/challenge-information-step";
import TradingEnvironmentStep from "@/components/firms/steps/trading-environment-step";
import SupportOperationsStep from "@/components/firms/steps/support-operations-step";
import TransparencyVerificationStep from "@/components/firms/steps/transparency-verification-step";
import AdministrationAuditStep from "@/components/firms/steps/administration-audit-step";
import Link from "next/link";

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

interface Firm {
  _id: string;
  firmName: string;
  legalEntityName: string;
  registrationNumber: string;
  jurisdiction: string;
  yearFounded: number;
  headquartersAddress: string;
  ceoFounderName?: string;
  officialWebsite: string;
  status: 'active' | 'paused' | 'suspended' | 'closed';
  shortDescription: string;
  isDraft: boolean;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  version: number;
  logo?: {
    url?: string;
    filename?: string;
    originalName?: string;
  };
  tradingInfrastructure?: {
    tradingPlatforms: string[];
    supportedAssets: string[];
    leverage: string;
    minimumDeposit: string;
    maximumDrawdown: string;
  };
  payoutFinancial?: {
    profitSplit: string;
    payoutMethods: string[];
    minimumPayout: string;
    maximumPayout: string;
  };
  challenges?: Array<{
    challengeName: string;
    challengeType: string;
    profitSplit: string;
    accountSize: string;
    maximumDrawdown: string;
  }>;
  supportOperations?: {
    supportChannels: string[];
    supportHours: string;
    responseTime: string;
  };
  transparencyVerification?: {
    regulatoryCompliance: string[];
    auditReports: string[];
    transparencyScore: number;
  };
  administrationAudit?: {
    auditFrequency: string;
    auditScope: string[];
    auditStandards: string[];
    auditReports: string[];
  };
}

function EditFirmContent() {
  const router = useRouter();
  const params = useParams();
  const firmId = params.id as string;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [firm, setFirm] = useState<Firm | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Fetch firm data
  useEffect(() => {
    const fetchFirm = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/firms/${firmId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch firm');
        }
        
        const data = await response.json();
        setFirm(data);
        setFormData(data);
        
        // Mark all steps as completed since we're editing existing data
        setCompletedSteps([1, 2, 3, 4, 5, 6, 7, 8]);
      } catch (err) {
        console.error('Error fetching firm:', err);
        toast.error('Failed to load firm data');
        router.push('/admin/firms');
      } finally {
        setLoading(false);
      }
    };

    if (firmId) {
      fetchFirm();
    }
  }, [firmId, router]);

  const updateStepData = (step: number, data: Record<string, unknown>) => {
    console.log(`Updating step ${step} with data:`, data);
    setFormData((prev: Record<string, unknown>) => {
      const newData = {
        ...prev,
        ...data
      };
      console.log('New form data:', newData);
      return newData;
    });
    setHasUnsavedChanges(true);
  };

  const markStepCompleted = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step]);
    }
  };

  const handleStepComplete = async (step: number) => {
    markStepCompleted(step);
    
    if (step < steps.length) {
      setCurrentStep(step + 1);
      toast.success(`Step ${step} completed! Moving to step ${step + 1}`);
    } else {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      console.log('Submitting form data:', formData);
      
      // Check if we have any meaningful data to update
      if (!formData || Object.keys(formData).length === 0) {
        toast.error('No data to update');
        return;
      }
      
      // Remove fields that shouldn't be updated
      const { _id: _removedId, createdAt: _removedCreatedAt, createdBy: _removedCreatedBy, version: _removedVersion, ...updateData } = formData;
      // Suppress unused variable warnings
      void _removedId; void _removedCreatedAt; void _removedCreatedBy; void _removedVersion;
      
      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add all form fields to FormData
      for (const [key, value] of Object.entries(updateData)) {
        if (key === 'logoFile' && value instanceof File) {
          // Append the actual File object for upload
          formDataToSend.append(key, value);
        } else if (value !== null && value !== undefined) {
          // Stringify objects, convert other types to strings
          formDataToSend.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      }
      
      console.log('Update data being sent:', Object.fromEntries(formDataToSend.entries()));
      
      const response = await fetch(`/api/firms/${firmId}`, {
        method: 'PUT',
        // Don't set Content-Type header for FormData - browser sets it automatically
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error('Failed to update firm');
      }

      const updatedFirm = await response.json();
      console.log('Updated firm:', updatedFirm);
      
      toast.success('Firm updated successfully!');
      setHasUnsavedChanges(false);
      router.push(`/admin/firms/${firmId}`);
    } catch (error) {
      console.error('Error updating firm:', error);
      toast.error('Failed to update firm');
    } finally {
      setIsSubmitting(false);
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
      router.push(pendingNavigation);
    }
    setShowWarningModal(false);
    setPendingNavigation(null);
  };

  const handleCancelNavigation = () => {
    setShowWarningModal(false);
    setPendingNavigation(null);
  };

  // Before unload warning
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

  if (!firm) {
    return (
      <div className="p-6 space-y-6">
        <PageHeader
          title="Firm Not Found"
          description="The requested firm could not be found."
        />
        <div className="text-center py-8">
          <Button asChild>
            <Link href="/admin/firms">
              Back to Firms
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = steps[currentStep - 1]?.component;

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Edit Firm"
        subtitle={firm.firmName}
        description="Update firm profile information, ratings, and upload assets."
        actions={
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => handleNavigation(`/admin/firms/${firmId}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Firm
            </Button>
            <Button 
              onClick={() => {
                console.log('Save Changes clicked, current formData:', formData);
                handleSubmit();
              }}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
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
            onNext={(data: Record<string, unknown>) => {
              updateStepData(currentStep, data);
              handleStepComplete(currentStep);
            }}
            onPrevious={() => setCurrentStep(Math.max(1, currentStep - 1))}
            isFirstStep={currentStep === 1}
            isLastStep={currentStep === steps.length}
            onDataChange={(data: Record<string, unknown>) => {
              updateStepData(currentStep, data);
            }}
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
              You have unsaved changes. Are you sure you want to leave? Your changes will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleCancelNavigation} className="w-full sm:w-auto">
              Stay on Page
            </Button>
            <Button variant="destructive" onClick={handleConfirmNavigation} className="w-full sm:w-auto">
              Leave Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function EditFirm() {
  return (
    <Suspense fallback={
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    }>
      <EditFirmContent />
    </Suspense>
  );
}