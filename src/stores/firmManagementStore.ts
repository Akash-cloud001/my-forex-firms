import { create } from 'zustand';

// Types for firm management
interface Firm {
  _id: string;
  firmName: string;
  logoUrl?: string;
  legalEntityName: string;
  registrationNumber: string;
  jurisdiction: string;
  yearFounded: number;
  headquartersAddress: string;
  ceoFounderName?: string;
  leadershipLinks?: string;
  officialWebsite: string;
  status: 'active' | 'paused' | 'suspended' | 'closed';
  shortDescription: string;
  
  // Social & Communication
  socialMedia?: {
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
  };

  // Trading Infrastructure
  tradingInfrastructure?: {
    tradingPlatforms: string[];
    dataFeedsLiquidityProviders: string[];
    averageExecutionLatency?: string;
    serverRegions?: string[];
    platformIncidents12m?: string;
  };

  // Payout & Financial
  payoutFinancial?: {
    profitSplit: string;
    firstPayoutTiming?: string;
    regularPayoutCycle?: string;
    minimumPayoutAmount?: string;
    averagePayoutProcessingTime?: string;
    fastestSlowestPayoutDuration?: string;
    payoutMethods: string[];
    payoutFeesFxCosts?: string;
    totalPayoutsAllTime?: string;
    largestSinglePayout?: string;
    monthlyPayoutCounts?: string;
    payoutProofLinks?: string[];
  };

  // Challenges
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

  // Trading Environment
  tradingEnvironment?: {
    typicalSpreads?: string;
    commissions?: string;
    slippageSwapPolicies?: string;
    riskDeskModel?: string;
    copyTradeProviders?: string[];
    mobileSupport?: string[];
    ruleMatrix: {
      newsTrading: boolean;
      weekendHolding: boolean;
      eaUsage: boolean;
      copyTrading: boolean;
      hedging: boolean;
      scalping: boolean;
    };
    ruleDetails?: {
      newsTradingNotes?: string;
      weekendHoldingNotes?: string;
      eaUsageNotes?: string;
      copyTradingNotes?: string;
      hedgingNotes?: string;
      scalpingNotes?: string;
    };
  };

  // Pricing & Promotions
  pricingPromotions?: {
    priceTable: string;
    discountsCoupons?: string;
    refundPolicy: string;
  };

  // Support & Operations
  supportOperations?: {
    supportChannels: string[];
    averageFirstResponseTime?: string;
    averageResolutionTime?: string;
    escalationPolicy?: string;
    kycRequirements?: string;
    restrictedCountries?: string[];
    amlComplianceLink?: string;
  };

  // Transparency & Verification
  transparencyVerification?: {
    ceoPublic: boolean;
    entityOfficeVerified: boolean;
    termsPublicUpdated: boolean;
    payoutProofsPublic: boolean;
    thirdPartyAudit: boolean;
    transparencyNotes?: string;
  };

  // Administration & Audit
  administrationAudit?: {
    dataSource: 'firm' | 'mff' | 'community';
    verifiedBy: string;
    verificationDate: string;
    nextReviewDate?: string;
    changelogNotes?: string;
  };

  // System fields
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  isDraft: boolean;
  isPublished: boolean;
  publishedAt?: string;
  version: number;
}

interface FirmFilters {
  status?: string;
  search?: string;
  jurisdiction?: string;
  yearFounded?: {
    min?: number;
    max?: number;
  };
  isPublished?: boolean;
  isDraft?: boolean;
  createdBy?: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface FirmManagementState {
  // Data
  firms: Firm[];
  currentFirm: Firm | null;
  drafts: Firm[];
  
  // UI State
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  
  // Filters & Pagination
  filters: FirmFilters;
  pagination: Pagination;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  
  // Actions
  fetchFirms: (filters?: Partial<FirmFilters>) => Promise<void>;
  fetchFirmById: (id: string) => Promise<void>;
  fetchDrafts: () => Promise<void>;
  createFirm: (firmData: Partial<Firm>) => Promise<{ success: boolean; firmId?: string; error?: string }>;
  updateFirm: (id: string, firmData: Partial<Firm>) => Promise<{ success: boolean; error?: string }>;
  deleteFirm: (id: string) => Promise<{ success: boolean; error?: string }>;
  publishFirm: (id: string) => Promise<{ success: boolean; error?: string }>;
  unpublishFirm: (id: string) => Promise<{ success: boolean; error?: string }>;
  
  // Filter & Sort Actions
  setFilters: (filters: Partial<FirmFilters>) => void;
  clearFilters: () => void;
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  setPagination: (pagination: Partial<Pagination>) => void;
  
  // Utility Actions
  clearError: () => void;
  clearCurrentFirm: () => void;
  searchFirms: (query: string) => Promise<void>;
  exportFirms: (format: 'csv' | 'excel' | 'pdf') => Promise<void>;
}

export const useFirmManagementStore = create<FirmManagementState>((set, get) => ({
  // Initial State
  firms: [],
  currentFirm: null,
  drafts: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  filters: {},
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  sortBy: 'createdAt',
  sortOrder: 'desc',

  // Data Fetching Actions
  fetchFirms: async (filters = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const { filters: currentFilters, pagination, sortBy, sortOrder } = get();
      
      // Flatten filters and convert to string values
      const flatFilters: Record<string, string> = {};
      
      // Add basic filters
      if (currentFilters.status) flatFilters.status = currentFilters.status;
      if (currentFilters.search) flatFilters.search = currentFilters.search;
      if (currentFilters.jurisdiction) flatFilters.jurisdiction = currentFilters.jurisdiction;
      if (currentFilters.isPublished !== undefined) flatFilters.isPublished = String(currentFilters.isPublished);
      if (currentFilters.isDraft !== undefined) flatFilters.isDraft = String(currentFilters.isDraft);
      if (currentFilters.createdBy) flatFilters.createdBy = currentFilters.createdBy;
      
      // Add year range filters
      if (currentFilters.yearFounded?.min) flatFilters.yearFoundedMin = String(currentFilters.yearFounded.min);
      if (currentFilters.yearFounded?.max) flatFilters.yearFoundedMax = String(currentFilters.yearFounded.max);
      
      // Add date range filters
      if (currentFilters.dateRange?.start) flatFilters.dateRangeStart = currentFilters.dateRange.start;
      if (currentFilters.dateRange?.end) flatFilters.dateRangeEnd = currentFilters.dateRange.end;
      
      // Add new filters
      if (filters.status) flatFilters.status = filters.status;
      if (filters.search) flatFilters.search = filters.search;
      if (filters.jurisdiction) flatFilters.jurisdiction = filters.jurisdiction;
      if (filters.isPublished !== undefined) flatFilters.isPublished = String(filters.isPublished);
      if (filters.isDraft !== undefined) flatFilters.isDraft = String(filters.isDraft);
      if (filters.createdBy) flatFilters.createdBy = filters.createdBy;
      if (filters.yearFounded?.min) flatFilters.yearFoundedMin = String(filters.yearFounded.min);
      if (filters.yearFounded?.max) flatFilters.yearFoundedMax = String(filters.yearFounded.max);
      if (filters.dateRange?.start) flatFilters.dateRangeStart = filters.dateRange.start;
      if (filters.dateRange?.end) flatFilters.dateRangeEnd = filters.dateRange.end;
      
      const queryParams = new URLSearchParams({
        ...flatFilters,
        page: String(pagination.page),
        limit: String(pagination.limit),
        sortBy,
        sortOrder
      });

      const response = await fetch(`/api/firms?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch firms');
      }

      const data = await response.json();
      
      set({
        firms: data.firms,
        pagination: {
          page: data.pagination.page,
          limit: data.pagination.limit,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages
        }
      });
    } catch (error) {
      console.error('Error fetching firms:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to fetch firms' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFirmById: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`/api/firms/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch firm');
      }

      const firm = await response.json();
      set({ currentFirm: firm });
    } catch (error) {
      console.error('Error fetching firm:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to fetch firm' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchDrafts: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/firms?isDraft=true');
      
      if (!response.ok) {
        throw new Error('Failed to fetch drafts');
      }

      const data = await response.json();
      set({ drafts: data.firms });
    } catch (error) {
      console.error('Error fetching drafts:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to fetch drafts' });
    } finally {
      set({ isLoading: false });
    }
  },

  // CRUD Actions
  createFirm: async (firmData) => {
    set({ isCreating: true, error: null });
    
    try {
      const response = await fetch('/api/firms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(firmData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create firm');
      }

      const newFirm = await response.json();
      
      set((state) => ({
        firms: [newFirm, ...state.firms],
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1
        }
      }));

      return { success: true, firmId: newFirm._id };
    } catch (error) {
      console.error('Error creating firm:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create firm';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ isCreating: false });
    }
  },

  updateFirm: async (id, firmData) => {
    set({ isUpdating: true, error: null });
    
    try {
      const response = await fetch(`/api/firms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(firmData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update firm');
      }

      const updatedFirm = await response.json();
      
      set((state) => ({
        firms: state.firms.map(f => f._id === id ? updatedFirm : f),
        currentFirm: state.currentFirm?._id === id ? updatedFirm : state.currentFirm,
        drafts: state.drafts.map(f => f._id === id ? updatedFirm : f)
      }));

      return { success: true };
    } catch (error) {
      console.error('Error updating firm:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update firm';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ isUpdating: false });
    }
  },

  deleteFirm: async (id) => {
    set({ isDeleting: true, error: null });
    
    try {
      const response = await fetch(`/api/firms/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete firm');
      }

      set((state) => ({
        firms: state.firms.filter(f => f._id !== id),
        currentFirm: state.currentFirm?._id === id ? null : state.currentFirm,
        drafts: state.drafts.filter(f => f._id !== id),
        pagination: {
          ...state.pagination,
          total: state.pagination.total - 1
        }
      }));

      return { success: true };
    } catch (error) {
      console.error('Error deleting firm:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete firm';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ isDeleting: false });
    }
  },

  publishFirm: async (id) => {
    set({ isUpdating: true, error: null });
    
    try {
      const response = await fetch(`/api/firms/${id}/publish`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to publish firm');
      }

      const updatedFirm = await response.json();
      
      set((state) => ({
        firms: state.firms.map(f => f._id === id ? updatedFirm : f),
        currentFirm: state.currentFirm?._id === id ? updatedFirm : state.currentFirm
      }));

      return { success: true };
    } catch (error) {
      console.error('Error publishing firm:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to publish firm';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ isUpdating: false });
    }
  },

  unpublishFirm: async (id) => {
    set({ isUpdating: true, error: null });
    
    try {
      const response = await fetch(`/api/firms/${id}/unpublish`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to unpublish firm');
      }

      const updatedFirm = await response.json();
      
      set((state) => ({
        firms: state.firms.map(f => f._id === id ? updatedFirm : f),
        currentFirm: state.currentFirm?._id === id ? updatedFirm : state.currentFirm
      }));

      return { success: true };
    } catch (error) {
      console.error('Error unpublishing firm:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to unpublish firm';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ isUpdating: false });
    }
  },

  // Filter & Sort Actions
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1 } // Reset to first page
    }));
    get().fetchFirms();
  },

  clearFilters: () => {
    set({ filters: {} });
    get().fetchFirms();
  },

  setSorting: (sortBy, sortOrder) => {
    set({ sortBy, sortOrder });
    get().fetchFirms();
  },

  setPagination: (pagination) => {
    set((state) => ({
      pagination: { ...state.pagination, ...pagination }
    }));
    get().fetchFirms();
  },

  // Utility Actions
  clearError: () => {
    set({ error: null });
  },

  clearCurrentFirm: () => {
    set({ currentFirm: null });
  },

  searchFirms: async (query) => {
    set({ filters: { ...get().filters, search: query } });
    get().fetchFirms();
  },

  exportFirms: async (format) => {
    try {
      const { filters, sortBy, sortOrder } = get();
      
      // Flatten filters and convert to string values
      const flatFilters: Record<string, string> = {};
      
      if (filters.status) flatFilters.status = filters.status;
      if (filters.search) flatFilters.search = filters.search;
      if (filters.jurisdiction) flatFilters.jurisdiction = filters.jurisdiction;
      if (filters.isPublished !== undefined) flatFilters.isPublished = String(filters.isPublished);
      if (filters.isDraft !== undefined) flatFilters.isDraft = String(filters.isDraft);
      if (filters.createdBy) flatFilters.createdBy = filters.createdBy;
      if (filters.yearFounded?.min) flatFilters.yearFoundedMin = String(filters.yearFounded.min);
      if (filters.yearFounded?.max) flatFilters.yearFoundedMax = String(filters.yearFounded.max);
      if (filters.dateRange?.start) flatFilters.dateRangeStart = filters.dateRange.start;
      if (filters.dateRange?.end) flatFilters.dateRangeEnd = filters.dateRange.end;
      
      const queryParams = new URLSearchParams({
        ...flatFilters,
        sortBy,
        sortOrder,
        export: format
      });

      const response = await fetch(`/api/firms/export?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to export firms');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `firms-export-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting firms:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to export firms' });
    }
  }
}));

// Helper hooks for specific functionality
export const useFirmList = () => {
  const { firms, isLoading, error, pagination, filters } = useFirmManagementStore();
  
  return {
    firms,
    isLoading,
    error,
    pagination,
    filters,
    hasFirms: firms.length > 0
  };
};

export const useFirmDetails = () => {
  const { currentFirm, isLoading, error } = useFirmManagementStore();
  
  return {
    firm: currentFirm,
    isLoading,
    error,
    hasFirm: !!currentFirm
  };
};

export const useFirmActions = () => {
  const {
    createFirm,
    updateFirm,
    deleteFirm,
    publishFirm,
    unpublishFirm,
    isCreating,
    isUpdating,
    isDeleting
  } = useFirmManagementStore();
  
  return {
    createFirm,
    updateFirm,
    deleteFirm,
    publishFirm,
    unpublishFirm,
    isCreating,
    isUpdating,
    isDeleting
  };
};
