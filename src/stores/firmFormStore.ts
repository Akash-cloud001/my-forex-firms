import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types based on the form structure
interface FirmFormData {
  [key: string]: unknown;
  // Step 1: Firm Information
  firmName?: string;
  logoUrl?: string;
  logoFile?: File | null;
  legalEntityName?: string;
  registrationNumber?: string;
  jurisdiction?: string;
  yearFounded?: string;
  headquartersAddress?: string;
  ceoFounderName?: string;
  leadershipLinks?: string;
  officialWebsite?: string;
  status?: 'active' | 'paused' | 'suspended' | 'closed';
  shortDescription?: string;

  // Step 2: Social & Communication
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  discordInviteLink?: string;
  telegramLink?: string;
  statusTrustPageUrl?: string;
  supportEmail?: string;
  supportChatUrl?: string;
  supportHours?: string;

  // Step 3: Trading Platforms
  tradingPlatforms?: string;
  dataFeedsLiquidityProviders?: string;
  averageExecutionLatency?: string;
  serverRegions?: string;
  platformIncidents12m?: string;

  // Step 4: Payout & Financial
  profitSplit?: string;
  firstPayoutTiming?: string;
  regularPayoutCycle?: string;
  minimumPayoutAmount?: string;
  averagePayoutProcessingTime?: string;
  fastestSlowestPayoutDuration?: string;
  payoutMethods?: string;
  payoutFeesFxCosts?: string;
  totalPayoutsAllTime?: string;
  largestSinglePayout?: string;
  monthlyPayoutCounts?: string;
  payoutProofLinks?: string;

  // Step 5: Challenge Information
  challenges?: Array<{
    challengeName: string;
    challengeType: '1-step' | '2-step' | 'instant' | 'hybrid';
    accountSizesPricing: string;
    profitSplit: string;
    leverageBreakdown: string;
    timeLimits?: string;
    minimumTradingDays?: string;
    step1Step2Targets?: string;
    dailyMaxDrawdown?: string;
    refundTerms?: string;
    scalingPlan?: string;
    allowedInstruments?: string;
    rules?: string;
    maxExposureLots?: string;
    bonusPromoPolicy?: string;
    termsUrl?: string;
    termsLastUpdated?: string;
  }>;

  // Step 6: Trading Environment
  typicalSpreads?: string;
  commissions?: string;
  slippageSwapPolicies?: string;
  riskDeskModel?: string;
  copyTradeProviders?: string;
  mobileSupport?: string;
  newsTrading?: boolean;
  weekendHolding?: boolean;
  eaUsage?: boolean;
  copyTrading?: boolean;
  hedging?: boolean;
  scalping?: boolean;
  newsTradingNotes?: string;
  weekendHoldingNotes?: string;
  eaUsageNotes?: string;
  copyTradingNotes?: string;
  hedgingNotes?: string;
  scalpingNotes?: string;

  // Step 7: Pricing & Promotions
  priceTable?: string;
  discountsCoupons?: string;
  refundPolicy?: string;

  // Step 8: Support & Operations
  supportChannels?: string;
  averageFirstResponseTime?: string;
  averageResolutionTime?: string;
  escalationPolicy?: string;
  kycRequirements?: string;
  restrictedCountries?: string;
  amlComplianceLink?: string;

  // Step 9: Transparency & Verification
  ceoPublic?: boolean;
  entityOfficeVerified?: boolean;
  termsPublicUpdated?: boolean;
  payoutProofsPublic?: boolean;
  thirdPartyAudit?: boolean;
  transparencyNotes?: string;

  // Step 10: Administration & Audit
  dataSource?: 'firm' | 'mff' | 'community';
  verifiedBy?: string;
  verificationDate?: string;
  nextReviewDate?: string;
  changelogNotes?: string;
}

interface FirmFormState {
  // Form State
  currentStep: number;
  completedSteps: number[];
  formData: FirmFormData;
  isDraft: boolean;
  isSubmitting: boolean;
  errors: Record<string, string[]>;
  lastSavedAt?: Date;

  // Actions
  setCurrentStep: (step: number) => void;
  setFormData: (data: Partial<FirmFormData>) => void;
  updateStepData: (stepData: Record<string, unknown>) => void;
  markStepCompleted: (step: number) => void;
  markStepIncomplete: (step: number) => void;
  saveDraft: () => Promise<{ success: boolean; error?: string }>;
  submitForm: () => Promise<{ success: boolean; error?: string; firmId?: string }>;
  resetForm: () => void;
  setErrors: (errors: Record<string, string[]>) => void;
  clearErrors: () => void;
  loadDraft: (draftId: string) => Promise<{ success: boolean; error?: string }>;
}

export const useFirmFormStore = create<FirmFormState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentStep: 1,
      completedSteps: [],
      formData: {},
      isDraft: false,
      isSubmitting: false,
      errors: {},
      lastSavedAt: undefined,

      // Actions
      setCurrentStep: (step) => {
        set({ currentStep: step });
      },
      
      setFormData: (data) => {
        set({ formData: { ...get().formData, ...data } });
      },
      
      updateStepData: (stepData) => {
        set((state) => ({
          formData: { ...state.formData, ...stepData },
          lastSavedAt: new Date()
        }));
      },
      
      markStepCompleted: (step) => {
        set((state) => ({
          completedSteps: [...new Set([...state.completedSteps, step])]
        }));
      },
      
      markStepIncomplete: (step) => {
        set((state) => ({
          completedSteps: state.completedSteps.filter(s => s !== step)
        }));
      },
      
      saveDraft: async () => {
        const { formData } = get();
        set({ isSubmitting: true, errors: {} });
        
        try {
          // Create FormData for file uploads
          const formDataToSend = new FormData();
          
          // Add all form fields
          Object.entries(formData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              if (key === 'logoFile' && value instanceof File) {
                formDataToSend.append('logoFile', value);
              } else if (key === 'challenges' && Array.isArray(value)) {
                formDataToSend.append(key, JSON.stringify(value));
              } else if (typeof value === 'object' && value !== null) {
                formDataToSend.append(key, JSON.stringify(value));
              } else {
                formDataToSend.append(key, String(value));
              }
            }
          });

          formDataToSend.append('isDraft', 'true');
          formDataToSend.append('currentStep', String(get().currentStep));
          formDataToSend.append('completedSteps', JSON.stringify(get().completedSteps));

          const response = await fetch('/api/firms/draft', {
            method: 'POST',
            body: formDataToSend
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to save draft');
          }

          await response.json();
          set({ 
            isDraft: true,
            lastSavedAt: new Date()
          });

          return { success: true };
        } catch (error) {
          console.error('Error saving draft:', error);
          set({ 
            errors: { 
              general: [error instanceof Error ? error.message : 'Failed to save draft'] 
            } 
          });
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to save draft' 
          };
        } finally {
          set({ isSubmitting: false });
        }
      },
      
      submitForm: async () => {
        const { formData } = get();
        set({ isSubmitting: true, errors: {} });
        
        try {
          // Create FormData for file uploads
          const formDataToSend = new FormData();
          
          // Add all form fields
          Object.entries(formData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              if (key === 'logoFile' && value instanceof File) {
                formDataToSend.append('logoFile', value);
              } else if (key === 'challenges' && Array.isArray(value)) {
                formDataToSend.append(key, JSON.stringify(value));
              } else if (typeof value === 'object' && value !== null) {
                formDataToSend.append(key, JSON.stringify(value));
              } else {
                formDataToSend.append(key, String(value));
              }
            }
          });

          formDataToSend.append('isDraft', 'false');

          const response = await fetch('/api/firms', {
            method: 'POST',
            body: formDataToSend
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to submit form');
          }

          const result = await response.json();
          set({ 
            isDraft: false,
            lastSavedAt: new Date()
          });

          return { success: true, firmId: result.firmId };
        } catch (error) {
          console.error('Error submitting form:', error);
          set({ 
            errors: { 
              general: [error instanceof Error ? error.message : 'Failed to submit form'] 
            } 
          });
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to submit form' 
          };
        } finally {
          set({ isSubmitting: false });
        }
      },
      
      resetForm: () => {
        set({
          currentStep: 1,
          completedSteps: [],
          formData: {},
          isDraft: false,
          errors: {},
          lastSavedAt: undefined
        });
      },
      
      setErrors: (errors) => {
        set({ errors });
      },
      
      clearErrors: () => {
        set({ errors: {} });
      },

      loadDraft: async (draftId) => {
        set({ isSubmitting: true, errors: {} });
        
        try {
          const response = await fetch(`/api/firms/draft/${draftId}`);
          
          if (!response.ok) {
            throw new Error('Failed to load draft');
          }

          const draftData = await response.json();
          
          set({
            formData: draftData.formData || {},
            currentStep: draftData.currentStep || 1,
            completedSteps: draftData.completedSteps || [],
            isDraft: true,
            lastSavedAt: draftData.updatedAt ? new Date(draftData.updatedAt) : undefined
          });

          return { success: true };
        } catch (error) {
          console.error('Error loading draft:', error);
          set({ 
            errors: { 
              general: [error instanceof Error ? error.message : 'Failed to load draft'] 
            } 
          });
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to load draft' 
          };
        } finally {
          set({ isSubmitting: false });
        }
      }
    }),
    {
      name: 'firm-form-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        formData: state.formData,
        isDraft: state.isDraft,
        lastSavedAt: state.lastSavedAt
      })
    }
  )
);

// Helper hooks for specific form sections
export const useFirmBasicInfo = () => {
  const { formData, updateStepData } = useFirmFormStore();
  
  return {
    data: {
      firmName: formData.firmName,
      logoUrl: formData.logoUrl,
      logoFile: formData.logoFile,
      legalEntityName: formData.legalEntityName,
      registrationNumber: formData.registrationNumber,
      jurisdiction: formData.jurisdiction,
      yearFounded: formData.yearFounded,
      headquartersAddress: formData.headquartersAddress,
      ceoFounderName: formData.ceoFounderName,
      leadershipLinks: formData.leadershipLinks,
      officialWebsite: formData.officialWebsite,
      status: formData.status,
      shortDescription: formData.shortDescription
    },
    update: (data: Partial<typeof formData>) => updateStepData(data)
  };
};

export const useFirmChallenges = () => {
  const { formData, updateStepData } = useFirmFormStore();
  
  return {
    challenges: formData.challenges || [],
    update: (challenges: typeof formData.challenges) => updateStepData({ challenges })
  };
};

export const useFirmFormProgress = () => {
  const { currentStep, completedSteps, isDraft, isSubmitting, lastSavedAt } = useFirmFormStore();
  
  return {
    currentStep,
    completedSteps,
    isDraft,
    isSubmitting,
    lastSavedAt,
    progressPercentage: (completedSteps.length / 10) * 100
  };
};
