/* eslint-disable */
// @ts-nocheck


import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";


function SupportTab({ firmData }: any) {
  return (
    <TabsContent value="support">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Customer Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Average Resolution Time
              </label>
              <p className="text-2xl font-bold">
                {firmData.support.avgResolutionTime} hours
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Support Hours
              </label>
              <p className="text-2xl font-bold">
                {firmData.support.supportHours}
              </p>
            </div>
          </div>
          <Separator />
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-3 block">
              Support Channels
            </label>
            <div className="space-y-3">
              {firmData.support.channels.map((channel: any) => (
                <Card key={channel._id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">
                        {channel.type}
                      </span>
                      <div className="flex gap-2">
                        {channel.preferred && <Badge>Preferred</Badge>}
                        <Badge
                          variant={
                            channel.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {channel.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Response Time: {channel.responseTime} hours
                    </p>
                    <a
                      href={channel.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      {channel.link}
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default SupportTab;
