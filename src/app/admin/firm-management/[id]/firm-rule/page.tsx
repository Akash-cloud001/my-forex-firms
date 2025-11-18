"use client";

import { FirmRuleForm } from "@/components/crm/firm-management/firm-rules/FirmRuleForm";
import { FirmRuleFormData } from "@/components/crm/firm-management/firm-rules/types";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function CreateFirmRulePage() {
  const router = useRouter();
  const { id: firmId } = useParams();
  const handleSubmit = async (data: FirmRuleFormData) => {
    await fetch("/api/admin/firm-rule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    router.push(`/admin/firm-management/${firmId}/firm-detail`);
  };

  return (
    <>
      <div className="mb-4 p-4 hover:text-red-700">
        <Link
          href={`/admin/firm-management/${firmId}/firm-rule/edit`}
          className="text-sm text-primary hover:underline"
        >
          Edit existing rule set
        </Link>
      </div>

      <FirmRuleForm firmId={firmId as string} onSubmit={handleSubmit} />
    </>
  );
}