import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PenaltyDetail({ params }: { params: { id: string } }) {
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Penalty Details"
        subtitle={`Penalty ID: ${params.id}`}
        description="View complete penalty information and history."
        actions={
          <>
            <Button asChild>
              <Link href={`/admin/penalties/${params.id}/edit`}>
                Edit Penalty
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/penalties">
                Back to List
              </Link>
            </Button>
          </>
        }
      />
      <div className="text-muted-foreground">
        {/* Penalty details, associated firm, type, dates, and impact will be displayed here */}
      </div>
    </div>
  );
}

