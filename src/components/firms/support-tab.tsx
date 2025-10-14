"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SupportOperations {
  supportChannels: string[];
  supportHours: string;
  responseTime: string;
}

interface Firm {
  supportOperations?: SupportOperations;
}

interface SupportTabProps {
  firm: Firm;
}

export function SupportTab({ firm }: SupportTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Support & Operations</CardTitle>
          <CardDescription>Customer support channels and operational details</CardDescription>
        </CardHeader>
        <CardContent>
          {firm.supportOperations ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Support Channels</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {firm.supportOperations.supportChannels?.map((channel, index) => (
                    <Badge key={index} variant="secondary">{channel}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Support Hours</label>
                <p className="font-medium">{firm.supportOperations.supportHours || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Response Time</label>
                <p className="font-medium">{firm.supportOperations.responseTime || 'N/A'}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No support information available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
