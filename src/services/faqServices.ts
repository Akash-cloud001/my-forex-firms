import { toast } from "sonner";
// Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface IFaqCategory {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  totalFaq?: number;
}

export interface IFaq {
  _id: string;
  question: string;
  answer: string;
  categoryId: string | { _id: string; name: string };
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryWithFaqs extends IFaqCategory {
  faqs: IFaq[];
}

// ============================================
// CATEGORY SERVICES
// ============================================

/**
 * Fetch all active categories
 */
export const getAllCategories = async (): Promise<IFaqCategory[]> => {
  try {
    const response = await fetch("/api/admin/faq/faq-categories", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const result: ApiResponse<IFaqCategory[]> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to fetch categories");
    }

    return result.data || [];
  } catch (error: unknown) {
    console.error("getAllCategories error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to fetch categories";

    toast.error(message);

    throw error;
  }
};

/**
 * Fetch single category with its FAQs
 */
export const getCategoryWithFaqs = async (
  categoryId: string
): Promise<CategoryWithFaqs> => {
  try {
    const response = await fetch(
      `/api/admin/faq/faq-categories/${categoryId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const result: ApiResponse<CategoryWithFaqs> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to fetch category");
    }

    return result.data!;
  } catch (error: unknown) {
    console.error("getCategoryWithFaqs error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch category";
    toast.error(message);
    throw error;
  }
};

/**
 * Create new category
 */
export const createCategory = async (data: {
  name: string;
  description?: string;
}): Promise<IFaqCategory> => {
  try {
    console.log("Creating category:", data);

    const response = await fetch("/api/admin/faq/faq-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<IFaqCategory> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to create category");
    }

    toast.success("Category created successfully");
    return result.data!;
  } catch (error: unknown) {
    console.error("createCategory error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create category";
    toast.error(message);
    throw error;
  }
};

/**
 * Update category
 */
export const updateCategory = async (
  categoryId: string,
  data: {
    name?: string;
    description?: string;
    isActive?: boolean;
  }
): Promise<IFaqCategory> => {
  try {
    console.log("Updating category:", categoryId, data);

    const response = await fetch(
      `/api/admin/faq/faq-categories/${categoryId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const result: ApiResponse<IFaqCategory> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to update category");
    }

    toast.success("Category updated successfully");
    return result.data!;
  } catch (error: unknown) {
    console.error("updateCategory error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update category";
    toast.error(message);
    throw error;
  }
};

/**
 * Delete category (soft delete)
 */
export const deleteCategory = async (categoryId: string): Promise<void> => {
  try {
    console.log("Deleting category:", categoryId);

    const response = await fetch(
      `/api/admin/faq/faq-categories/${categoryId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    const result: ApiResponse<void> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to delete category");
    }

    toast.success("Category deleted successfully");
  } catch (error: unknown) {
    console.error("deleteCategory error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete category";
    toast.error(message);
    throw error;
  }
};

// ============================================
// FAQ SERVICES
// ============================================

/**
 * Fetch all FAQs (optionally filtered by category)
 */
export const getAllFaqs = async (categoryId?: string): Promise<IFaq[]> => {
  try {
    const url = categoryId
      ? `/api/admin/faq/faqs?categoryId=${categoryId}`
      : "/api/admin/faq/faqs";

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const result: ApiResponse<IFaq[]> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to fetch FAQs");
    }

    return result.data || [];
  } catch (error: unknown) {
    console.error("getAllFaqs error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch FAQs";
    toast.error(message);
    throw error;
  }
};

/**
 * Fetch single FAQ
 */
export const getFaq = async (faqId: string): Promise<IFaq> => {
  try {
    const response = await fetch(`/api/admin/faq/faqs/${faqId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const result: ApiResponse<IFaq> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to fetch FAQ");
    }

    return result.data!;
  } catch (error: unknown) {
    console.error("getFaq error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch FAQ";
    toast.error(message);
    throw error;
  }
};

/**
 * Create new FAQ
 */
export const createFaq = async (data: {
  question: string;
  answer: string;
  categoryId: string;
  order?: number;
}): Promise<IFaq> => {
  try {
    console.log("Creating FAQ:", data);

    const response = await fetch("/api/admin/faq/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<IFaq> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to create FAQ");
    }

    toast.success("FAQ created successfully");
    return result.data!;
  } catch (error: unknown) {
    console.error("createFaq error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create FAQ";
    toast.error(message);
    throw error;
  }
};

/**
 * Update FAQ
 */
export const updateFaq = async (
  faqId: string,
  data: {
    question?: string;
    answer?: string;
    order?: number;
    isActive?: boolean;
  }
): Promise<IFaq> => {
  try {
    console.log("Updating FAQ:", faqId, data);

    const response = await fetch(`/api/admin/faq/faqs/${faqId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<IFaq> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to update FAQ");
    }

    toast.success("FAQ updated successfully");
    return result.data!;
  } catch (error: unknown) {
    console.error("updateFaq error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update FAQ";
    toast.error(message);
    throw error;
  }
};

/**
 * Delete FAQ (soft delete)
 */
export const deleteFaq = async (faqId: string): Promise<void> => {
  try {
    console.log("Deleting FAQ:", faqId);

    const response = await fetch(`/api/admin/faq/faqs/${faqId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const result: ApiResponse<void> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to delete FAQ");
    }

    toast.success("FAQ deleted successfully");
  } catch (error: unknown) {
    console.error("deleteFaq error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete FAQ";
    toast.error(message);
    throw error;
  }
};

/**
 * Reorder FAQs
 */
export const reorderFaqs = async (
  faqs: Array<{ id: string; order: number }>
): Promise<void> => {
  try {
    console.log("Reordering FAQs:", faqs);

    const response = await fetch("/api/admin/faq/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ faqs }),
    });

    const result: ApiResponse<void> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to reorder FAQs");
    }

    toast.success("FAQs reordered successfully");
  } catch (error: unknown) {
    console.error("reorderFaqs error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to reorder FAQs";
    toast.error(message);
    throw error;
  }
};
