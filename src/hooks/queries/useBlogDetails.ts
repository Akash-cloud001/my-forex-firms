import { apiGet } from "@/lib/api/apiWrapper";
import { useQuery } from "@tanstack/react-query";
import { FirmReview } from "@/types/firm-review";

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    review: T;
}

export const useBlogDetails = (slug: string) => {
    return useQuery<FirmReview>({
        queryKey: ["blog-details", slug],
        queryFn: async () => {
            const response = await apiGet<ApiResponse<FirmReview>>(`/public/firm-reviews/${slug}`);
            if (!response.success) {
                throw new Error(response.message || "Failed to fetch blog");
            }
            return response.review;
        },
        enabled: Boolean(slug),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

