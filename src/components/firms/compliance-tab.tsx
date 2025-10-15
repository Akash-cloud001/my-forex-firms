"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TransparencyVerification {
  ceoPublic: boolean;
  entityOfficeVerified: boolean;
  termsPublicUpdated: boolean;
  payoutProofsPublic: boolean;
  thirdPartyAudit: boolean;
  transparencyNotes: string;
}

interface AdministrationAudit {
  dataSource: string;
  verifiedBy: string;
  verificationDate: string;
  nextReviewDate?: string;
  changelogNotes: string;
}

interface Firm {
  transparencyVerification?: TransparencyVerification;
  administrationAudit?: AdministrationAudit;
}

interface ComplianceTabProps {
  firm: Firm;
}

export function ComplianceTab({ firm }: ComplianceTabProps) {
  return (
    <div className="space-y-6">
      {/* Transparency & Verification */}
      {firm.transparencyVerification && (
        <Card>
          <CardHeader>
            <CardTitle>Transparency & Verification</CardTitle>
            <CardDescription>Public transparency and verification measures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Transparency Checklist */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Transparency Checklist</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant={firm.transparencyVerification.ceoPublic ? "default" : "secondary"}>
                      {firm.transparencyVerification.ceoPublic ? "Yes" : "No"}
                    </Badge>
                    <span className="text-sm">CEO Public</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={firm.transparencyVerification.entityOfficeVerified ? "default" : "secondary"}>
                      {firm.transparencyVerification.entityOfficeVerified ? "Yes" : "No"}
                    </Badge>
                    <span className="text-sm">Entity Office Verified</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={firm.transparencyVerification.termsPublicUpdated ? "default" : "secondary"}>
                      {firm.transparencyVerification.termsPublicUpdated ? "Yes" : "No"}
                    </Badge>
                    <span className="text-sm">Terms Public & Updated</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={firm.transparencyVerification.payoutProofsPublic ? "default" : "secondary"}>
                      {firm.transparencyVerification.payoutProofsPublic ? "Yes" : "No"}
                    </Badge>
                    <span className="text-sm">Payout Proofs Public</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={firm.transparencyVerification.thirdPartyAudit ? "default" : "secondary"}>
                      {firm.transparencyVerification.thirdPartyAudit ? "Yes" : "No"}
                    </Badge>
                    <span className="text-sm">Third Party Audit</span>
                  </div>
                </div>
              </div>

              {/* Transparency Notes */}
              {firm.transparencyVerification.transparencyNotes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Transparency Notes</label>
                  <p className="font-medium mt-2">{firm.transparencyVerification.transparencyNotes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Administration & Audit */}
      {firm.administrationAudit && (
        <Card>
          <CardHeader>
            <CardTitle>Administration & Audit</CardTitle>
            <CardDescription>Data source, verification, and audit information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-0.5 capitalize" >
                  <label className="text-sm font-medium text-muted-foreground">Data Source</label>
                  <Badge variant="outline" className="mt-1">{firm.administrationAudit.dataSource}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Verified By</label>
                  <p className="font-medium">{firm.administrationAudit.verifiedBy}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Verification Date</label>
                  <p className="font-medium">{firm.administrationAudit.verificationDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Next Review Date</label>
                  <p className="font-medium">{firm.administrationAudit.nextReviewDate || 'Not scheduled'}</p>
                </div>
              </div>

              {/* Changelog Notes */}
              {firm.administrationAudit.changelogNotes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Changelog Notes</label>
                  <p className="font-medium mt-2">{firm.administrationAudit.changelogNotes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Data Message */}
      {!firm.transparencyVerification && !firm.administrationAudit && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">No compliance information available.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
