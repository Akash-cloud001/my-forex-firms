import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FirmsList() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Firm Management"
        description="Search, filter, and manage all forex firms on the platform."
        actions={
          <Button asChild>
            <Link href="/admin/firms/new">
              Add New Firm
            </Link>
          </Button>
        }
      />
      <div className="text-muted-foreground">
        {/* Search, filters, pagination, and firm list will be displayed here */}
      </div>
    </div>
  );
}

