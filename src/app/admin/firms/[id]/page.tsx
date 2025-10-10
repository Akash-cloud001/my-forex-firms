import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FirmDetail({ params }: { params: { id: string } }) {
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Firm Details"
        subtitle={`ID: ${params.id}`}
        description="View complete firm profile, ratings, and associated complaints."
        actions={
          <Button asChild>
            <Link href={`/admin/firms/${params.id}/edit`}>
              Edit Firm
            </Link>
          </Button>
        }
      />
      <div className="text-muted-foreground">
        {/* Firm profile details, ratings, and complaints will be displayed here */}
      </div>
    </div>
  );
}

