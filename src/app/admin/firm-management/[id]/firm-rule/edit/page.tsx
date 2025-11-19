"use client";

import { FirmRuleForm } from "@/components/crm/firm-management/firm-rules/FirmRuleForm";
import { FirmRuleFormData } from "@/components/crm/firm-management/firm-rules/types";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditFirmRulePage() {
  const router = useRouter();
  const { id: firmId } = useParams();               
  const [ruleData, setRuleData] = useState<FirmRuleFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRule() {
      try {
        const res = await fetch(`/api/admin/firm-rule/${firmId}`);
        if (!res.ok) throw new Error("Failed to load rule");
        const data: FirmRuleFormData = await res.json();
        setRuleData(data);
      }catch (err) {
        const message =
          err instanceof Error ? err.message : "Unexpected error";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchRule();
  }, [firmId]);

  const handleSubmit = async (data: FirmRuleFormData) => {
    await fetch(`/api/admin/firm-rule/${firmId}`, {
      method: "PATCH",                    
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    router.push(`/admin/firm-management/${firmId}/firm-detail`);
  };

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-destructive">{error}</div>;
  if (!ruleData) return null;

  return (
    <FirmRuleForm
      firmId={firmId as string}
      existingData={ruleData}         
      onSubmit={handleSubmit}
    />
  );
}