import { apiGet } from "@/lib/api/apiWrapper";
import { useQuery } from "@tanstack/react-query";
import { IProgram } from "@/models/FirmProgram";

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
    pagination?: Pagination;
}

export interface UseFirmProgramListParams {
    slug: string;
    type?: string;
    size?: number;
    page?: number;
    limit?: number;
}

export const useFirmProgramList = ({ slug, type, size, page = 1, limit = 10 }: UseFirmProgramListParams) => {
    return useQuery<{ programs: IProgram[], pagination: Pagination }>({
        queryKey: ["firm-programs", slug, type, size, page, limit],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (type) params.append("type", type);
            if (size) params.append("size", size.toString());
            params.append("page", page.toString());
            params.append("limit", limit.toString());

            const response = await apiGet<ApiResponse<IProgram[]>>(`/public/firm-details/${slug}/program?${params.toString()}`);

            return {
                programs: response.data,
                pagination: response.pagination!
            };
        },
        enabled: Boolean(slug),
        staleTime: 1000 * 60 * 5,
    });
};
