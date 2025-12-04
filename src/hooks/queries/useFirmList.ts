import { apiGet } from "@/lib/api/apiWrapper";
import { useQuery } from "@tanstack/react-query";

export interface Firm {
    id: string;
    name: string;
    totalPayout: number | null;
    image: {
        url?: string;
        publicId?: string;
        thumbnail?: string;
    } | null;
    yearFounded: number | null;
    slug: string | null;
    totalReview: number;
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface FirmListResponse {
    success: boolean;
    data: Firm[];
    pagination: Pagination;
}

export interface UseFirmListParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: "name" | "yearFounded";
    order?: "asc" | "desc";
}

export const useFirmList = (params: UseFirmListParams) => {
    return useQuery<FirmListResponse>({
        queryKey: ["firm-list", params],
        queryFn: async () => {
            return apiGet<FirmListResponse>("/public/firm-list", params);
        },
        placeholderData: (previousData) => previousData,
    });
};
