import { PageHeader } from "@/components/page-header";

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your platform's activity, recent complaints, and key metrics."
      />
      <div className="text-muted-foreground">
        {/* Summary cards, quick-links, and recent activity will be displayed here */}
      </div>
    </div>
  );
}

