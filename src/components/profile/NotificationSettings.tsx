"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

export default function NotificationSettings() {
  const handleConfigureEmail = () => {
    // TODO: Implement email notification configuration
    console.log('Configure email notifications');
  };

  const handleConfigurePush = () => {
    // TODO: Implement push notification configuration
    console.log('Configure push notifications');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Choose how you want to be notified about updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleConfigureEmail}>
              Configure
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Push Notifications</h4>
              <p className="text-sm text-muted-foreground">Get notified in real-time</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleConfigurePush}>
              Configure
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
