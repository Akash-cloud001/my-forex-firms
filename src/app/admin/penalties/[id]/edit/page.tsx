import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EditPenalty({ params }: { params: { id: string } }) {
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Edit Penalty"
        subtitle={`Penalty ID: ${params.id}`}
        description="Update penalty details, type, duration, and rating impact."
        actions={
          <Button variant="outline" asChild>
            <Link href={`/admin/penalties/${params.id}`}>
              Cancel
            </Link>
          </Button>
        }
      />
      <div className="text-muted-foreground">
        {/* Edit penalty form will be displayed here */}
      </div>
    </div>
  );
}

