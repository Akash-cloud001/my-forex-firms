import { apiGet } from "@/lib/api/apiWrapper";
import { useQuery } from "@tanstack/react-query";
import { IFundingFirm } from "@/models/FirmDetails";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const useEvalFirmDetails = () => {
    return useQuery<IFundingFirm>({
        queryKey: ["eval-firm-details"],
        queryFn: async () => {
            const response = await apiGet<ApiResponse<IFundingFirm>>(`/admin/point-eval/firms-list`);
            return response.data;
        },
        staleTime: 1000 * 60 * 5,
    });
};
