import { apiPost } from "@/lib/api/apiWrapper";
import { useQuery } from "@tanstack/react-query";

export interface ReviewFile {
    name: string;
    type: string;
    size: number;
    url: string;
    thumbnail_url?: string;
    uploadedAt?: string | Date;
}

export interface FirmReview {
    _id: string;
    userName: string;
    userImage: string | null;
    firmName: string;
    issueCategory: string;
    issueType: string;
    description: string;
    files: ReviewFile[];
    status: string;
    createdAt: string;
}

interface ReviewsApiResponse {
    success: boolean;
    data: FirmReview[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    error?: string;
}

export const useFirmReviews = (firmId: string, page: number = 1, limit: number = 10) => {
    return useQuery<FirmReview[]>({
        queryKey: ["firm-reviews", firmId, page, limit],
        queryFn: async () => {
            const response = await apiPost<ReviewsApiResponse>("/public/review-list", {
                firmId: firmId,
                page,
                limit,
            });
            if (!response.success) {
                throw new Error(response.error || "Failed to fetch reviews");
            }
            return response.data;
        },
        enabled: Boolean(firmId),
        staleTime: 1000 * 60 * 5,
    });
};

