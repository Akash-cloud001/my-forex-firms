/* eslint-disable */
// @ts-nocheck

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

function SupportTab({ firmData }: any) {
  const support = firmData?.support || {};

  return (
    <TabsContent value="support">
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <MessageSquare className="h-5 w-5" />
            Customer Support
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Core Support Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Avg. Resolution Time</Label>
              <p className="text-3xl font-semibold leading-none">
                {support.avgResolutionTime ?? "-"}
                <span className="text-sm text-muted-foreground ml-1">hours</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Support Hours</Label>
              <p className="text-xl font-medium">
                {support.supportHours || "Not Available"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Support Channels */}
          <div className="space-y-4">
            <Label className="text-sm text-muted-foreground">Support Channels</Label>

            <div className="space-y-3">
              {(support.channels || []).map((channel: any) => (
                <Card key={channel._id} className="border rounded-lg shadow-sm">
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{channel.type}</span>

                      <div className="flex gap-2">
                        {channel.preferred && (
                          <Badge className="text-xs">Preferred</Badge>
                        )}
                        <Badge
                          variant={
                            channel.status === "active" ? "default" : "secondary"
                          }
                          className="text-xs capitalize"
                        >
                          {channel.status}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Response Time: {channel.responseTime} hours
                    </p>

                    {channel.link && (
                      <a
                        href={channel.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-xs hover:underline break-all"
                      >
                        {channel.link}
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Fallback */}
              {(!support.channels || support.channels.length === 0) && (
                <div className="text-sm text-muted-foreground p-4 text-center rounded-lg border">
                  No support channel information available
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default SupportTab;
