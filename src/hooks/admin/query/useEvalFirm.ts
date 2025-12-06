import { apiGet, apiPost } from "@/lib/api/apiWrapper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface IEvalFirm {
    id: string;
    name: string;
    isEvaluated: boolean;
    evaluatedAt?: string;
}

export const useEvalFirmDetails = () => {
    return useQuery<IEvalFirm[]>({
        queryKey: ["eval-firm-details"],
        queryFn: async () => {
            const response = await apiGet<ApiResponse<IEvalFirm[]>>(`/admin/point-eval/firms-list`);
            // console.log("🚀 ~ useEvalFirmDetails ~ full response:", response);


            if (Array.isArray(response)) {
                return response;
            }

            console.warn("Unexpected API response structure:", response);
            return [];
        },
        staleTime: 1000 * 60 * 5,
    });
};

export const useEvaluateFirm = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (firmId: string) => {
            return apiPost(`/admin/point-eval`, { firmId });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["eval-firm-details"] });
        },
    });
};