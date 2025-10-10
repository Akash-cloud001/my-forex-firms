import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PenaltiesList() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Penalty Log System"
        description="Track and manage rating penalties applied to firms for violations."
        actions={
          <Button asChild>
            <Link href="/admin/penalties/new">
              Add New Penalty
            </Link>
          </Button>
        }
      />
      <div className="text-muted-foreground">
        {/* Penalty list with filters (active/expired, type, firm) will be displayed here */}
      </div>
    </div>
  );
}

