import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NewPenalty() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Add New Penalty"
        description="Create a new penalty record to apply rating deductions to a firm."
        actions={
          <Button variant="outline" asChild>
            <Link href="/admin/penalties">
              Cancel
            </Link>
          </Button>
        }
      />
      <div className="text-muted-foreground">
        {/* New penalty creation form will be displayed here */}
      </div>
    </div>
  );
}

