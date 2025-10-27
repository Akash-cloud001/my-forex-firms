import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ComplaintDetail({ params }: { params: { id: string } }) {
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Complaint Details"
        subtitle={`Complaint ID: ${params.id}`}
        description="Review proof documents, update verification status, and add administrative comments."
        actions={
          <Button variant="outline" asChild>
            <Link href="/admin/complaints">
              Back to List
            </Link>
          </Button>
        }
      />
      <div className="text-muted-foreground">
        {/* Complaint details, proof images/files, status updates, and comments will be displayed here */}
      </div>
    </div>
  );
}

