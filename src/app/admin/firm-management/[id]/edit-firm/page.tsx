"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FirmFormData } from "@/components/crm/firm-management/add-firm/schema/schema";
import FundingFirmForm from "@/components/crm/firm-management/add-firm/AddFirm";
export default function EditFirmPage() {
  const params = useParams();
  const firmId = params.id as string;
  const [initialData, setInitialData] = useState<FirmFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFirmData = async () => {
      try {
        const response = await fetch(`/api/admin/firm/${firmId}`);
        if (!response.ok) throw new Error("Failed to fetch firm data");
        
        const result = await response.json();
        setInitialData(result.data);
      } catch (error) {
        console.error("Error fetching firm:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (firmId) {
      fetchFirmData();
    }
  }, [firmId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading firm data...</p>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load firm data</p>
        </div>
      </div>
    );
  }

  return <FundingFirmForm initialData={initialData} firmId={firmId} isEditMode />;
}