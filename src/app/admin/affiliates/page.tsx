"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { PageHeader } from "@/components/page-header";

export default function AffiliateTracking() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // Show loading while user data is being fetched
  if (!isLoaded) {
    return <LoadingScreen title="Checking access..." subtitle="Verifying permissions..." />;
  }

  // Check role after user is loaded
  const userRole = user?.publicMetadata?.role as string | undefined;
  if (isLoaded && user && userRole !== 'admin') {
    router.push('/admin/unauthorized');
    return null; // Don't render anything during redirect
  }

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

