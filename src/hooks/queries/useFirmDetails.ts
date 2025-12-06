import { apiGet } from "@/lib/api/apiWrapper";
import { useQuery } from "@tanstack/react-query";
import { IFundingFirm } from "@/models/FirmDetails";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const useFirmDetails = (id: string) => {
    return useQuery<IFundingFirm>({
        queryKey: ["firm-details", id],
        queryFn: async () => {
            const response = await apiGet<ApiResponse<IFundingFirm>>(`/public/firm-details/${id}`);
            return response.data;
        },
        enabled: Boolean(id),
        staleTime: 1000 * 60 * 5,
    });
};


// export cont useFirmsReviews = (id: string) =>{
//     return useQuer
// }