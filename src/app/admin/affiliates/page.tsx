import { PageHeader } from "@/components/page-header";

export default function AffiliateTracking() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Affiliate Link Tracking"
        description="Monitor affiliate link performance, track clicks, conversions, and identify top referrers."
      />
      <div className="text-muted-foreground">
        {/* Affiliate link overview, performance metrics, and top referrers will be displayed here */}
      </div>
    </div>
  );
}

