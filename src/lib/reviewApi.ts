// Review API utility functions

export interface ReviewData {
  firmName: string;
  customFirmName?: string;
  issueType: string;
  customIssueType?: string;
  description: string;
  rating: number;
  files?: File[];
}

export interface ReviewResponse {
  _id: string;
  userId: string;
  firmId?: string;
  firmName: string;
  issueType: string;
  description: string;
  rating: number;
  files?: Array<{
    name: string;
    type: string;
    size: number;
    url: string;
  }>;
  status: 'pending' | 'approved' | 'rejected';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsListResponse {
  reviews: ReviewResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Create a new review
export async function createReview(reviewData: ReviewData): Promise<{ review: ReviewResponse; message: string }> {
  const formData = new FormData();
  
  // Add text fields
  formData.append('firmName', reviewData.firmName);
  if (reviewData.customFirmName) {
    formData.append('customFirmName', reviewData.customFirmName);
  }
  formData.append('issueType', reviewData.issueType);
  if (reviewData.customIssueType) {
    formData.append('customIssueType', reviewData.customIssueType);
  }
  formData.append('description', reviewData.description);
  formData.append('rating', reviewData.rating.toString());
  
  // Add files
  if (reviewData.files && reviewData.files.length > 0) {
    reviewData.files.forEach(file => {
      formData.append('files', file);
    });
  }
  
  const response = await fetch('/api/reviews', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create review');
  }
  
  return response.json();
}

// Get reviews with optional filters
export async function getReviews(params: {
  page?: number;
  limit?: number;
  firmId?: string;
  firmName?: string;
  issueType?: string;
  rating?: number;
  status?: string;
  isVerified?: boolean;
  userId?: string;
  dateRangeStart?: string;
  dateRangeEnd?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} = {}): Promise<ReviewsListResponse> {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });
  
  const response = await fetch(`/api/reviews?${searchParams.toString()}`, {
    method: 'GET',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch reviews');
  }
  
  return response.json();
}

// Get a specific review by ID
export async function getReviewById(id: string): Promise<{ review: ReviewResponse }> {
  const response = await fetch(`/api/reviews/${id}`, {
    method: 'GET',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch review');
  }
  
  return response.json();
}

// Update a review
export async function updateReview(id: string, updateData: Partial<ReviewData>): Promise<{ review: ReviewResponse; message: string }> {
  const response = await fetch(`/api/reviews/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update review');
  }
  
  return response.json();
}

// Delete a review
export async function deleteReview(id: string): Promise<{ message: string; deletedId: string }> {
  const response = await fetch(`/api/reviews/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete review');
  }
  
  return response.json();
}

// Delete all reviews (admin function)
export async function deleteAllReviews(): Promise<{ message: string; deletedCount: number }> {
  const response = await fetch('/api/reviews?deleteAll=true', {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete reviews');
  }
  
  return response.json();
}
