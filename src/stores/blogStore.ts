import { create } from 'zustand';
import { FirmReview } from '@/types/firm-review';

// Blog state interface
export interface BlogState {
  // Data
  blogs: FirmReview[];
  currentBlog: FirmReview | null;
  
  // UI State
  isLoading: boolean;
  isLoadingBlog: boolean;
  error: string | null;
  
  // Actions
  fetchBlogs: () => Promise<void>;
  fetchBlogBySlug: (slug: string) => Promise<void>;
  clearError: () => void;
  clearCurrentBlog: () => void;
}

export const useBlogStore = create<BlogState>((set, get) => ({
  // Initial State
  blogs: [],
  currentBlog: null,
  isLoading: false,
  isLoadingBlog: false,
  error: null,

  // Fetch all blogs
  fetchBlogs: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/public/firm-reviews');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch blogs');
      }

      const data = await response.json();
      
      if (data.success && data.reviews) {
        set({ blogs: data.reviews });
      } else {
        throw new Error(data.error || 'Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch blogs',
        blogs: [] // Clear blogs on error
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch single blog by slug
  fetchBlogBySlug: async (slug: string) => {
    set({ isLoadingBlog: true, error: null });
    
    try {
      const response = await fetch(`/api/public/firm-reviews/${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Blog not found');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch blog');
      }

      const data = await response.json();
      
      if (data.success && data.review) {
        set({ currentBlog: data.review });
      } else {
        throw new Error(data.error || 'Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch blog',
        currentBlog: null // Clear current blog on error
      });
    } finally {
      set({ isLoadingBlog: false });
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Clear current blog
  clearCurrentBlog: () => {
    set({ currentBlog: null });
  },
}));

// Helper hook for blog list
export const useBlogList = () => {
  const { blogs, isLoading, error, fetchBlogs } = useBlogStore();
  
  return {
    blogs,
    isLoading,
    error,
    hasBlogs: blogs.length > 0,
    fetchBlogs,
  };
};

// Helper hook for single blog (use in components with useEffect)
export const useBlog = () => {
  const { currentBlog, isLoadingBlog, error, fetchBlogBySlug, clearCurrentBlog } = useBlogStore();
  
  return {
    blog: currentBlog,
    isLoading: isLoadingBlog,
    error,
    fetchBlog: fetchBlogBySlug,
    clearBlog: clearCurrentBlog,
  };
};

