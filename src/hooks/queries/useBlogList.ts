import { apiGet } from "@/lib/api/apiWrapper";
import { useQuery } from "@tanstack/react-query";
import { FirmReview } from "@/types/firm-review";

interface ApiResponse {
    success: boolean;
    reviews: FirmReview[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

interface UseBlogListParams {
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export const useBlogList = (params?: UseBlogListParams) => {
    const { search = "", page = 1, limit = 50, sortBy = "createdAt", sortOrder = "desc" } = params || {};

    return useQuery<FirmReview[]>({
        queryKey: ["blog-list", search, page, limit, sortBy, sortOrder],
        queryFn: async () => {
            const queryParams: Record<string, string> = {};
            if (search) queryParams.search = search;
            queryParams.page = page.toString();
            queryParams.limit = limit.toString();
            queryParams.sortBy = sortBy;
            queryParams.sortOrder = sortOrder;

            const response = await apiGet<ApiResponse>("/public/firm-reviews", queryParams);
            if (!response.success) {
                throw new Error("Failed to fetch blogs");
            }
            return response.reviews;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

