import { create } from 'zustand';

// Types for FAQ
export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  order: number;
  categoryId: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FaqState {
  // Data
  faqs: FaqItem[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchFaqs: (category?: string) => Promise<void>;
  clearError: () => void;
}

export const useFaqStore = create<FaqState>((set, get) => ({
  // Initial State
  faqs: [],
  isLoading: false,
  error: null,

  // Fetch FAQs
  fetchFaqs: async (category) => {
    set({ isLoading: true, error: null });
    
    try {
      // Build query params
      const params = new URLSearchParams();
      if (category) {
        params.append('category', category);
      }

      const url = `/api/public/faqs${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch FAQs');
      }

      const data = await response.json();
      
      if (data.success) {
        set({ faqs: data.data || [] });
      } else {
        throw new Error(data.error || 'Failed to fetch FAQs');
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch FAQs',
        faqs: [] // Clear FAQs on error
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

// Helper hook for FAQ list
export const useFaqList = () => {
  const { faqs, isLoading, error, fetchFaqs } = useFaqStore();
  
  // Transform FAQs to match CustomAccordion format
  const accordionItems = faqs.map((faq) => ({
    question: faq.question,
    answer: faq.answer,
  }));
  
  return {
    faqs,
    accordionItems,
    isLoading,
    error,
    hasFaqs: faqs.length > 0,
    fetchFaqs,
  };
};

