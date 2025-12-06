import { apiGet } from "@/lib/api/apiWrapper";
import { useQuery } from "@tanstack/react-query";
import { IFundingFirm } from "@/models/FirmDetails";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface IEvalFirm {
    id: string;
    name: string;
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