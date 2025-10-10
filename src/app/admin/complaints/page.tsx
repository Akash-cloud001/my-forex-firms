import { PageHeader } from "@/components/page-header";

export default function ComplaintsList() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Complaint Verification Panel"
        description="Review, verify, and manage user-submitted complaints affecting firm ratings."
      />
      <div className="text-muted-foreground">
        {/* Complaint list with filters (status, date, firm) will be displayed here */}
      </div>
    </div>
  );
}

