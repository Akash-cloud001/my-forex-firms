import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EditFirm({ params }: { params: { id: string } }) {
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Edit Firm"
        subtitle={`ID: ${params.id}`}
        description="Update firm profile information, ratings, and upload assets."
        actions={
          <Button variant="outline" asChild>
            <Link href={`/admin/firms/${params.id}`}>
              Cancel
            </Link>
          </Button>
        }
      />
      <div className="text-muted-foreground">
        {/* Edit form with profile fields and asset upload will be displayed here */}
      </div>
    </div>
  );
}

