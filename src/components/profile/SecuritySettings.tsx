"use client";

import React from 'react';
import { User } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Key, Mail, Globe } from 'lucide-react';

interface SecuritySettingsProps {
  user: User;
}

export default function SecuritySettings({ user }: SecuritySettingsProps) {
  const handleChangePassword = () => {
    // TODO: Implement password change logic
    console.log('Change password clicked');
  };

  const handleVerifyEmail = () => {
    // TODO: Implement email verification logic
    console.log('Verify email clicked');
  };

  const handleEnable2FA = () => {
    // TODO: Implement 2FA setup logic
    console.log('Enable 2FA clicked');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Settings
        </CardTitle>
        <CardDescription>
          Manage your account security and authentication methods
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5 text-muted-foreground" />
              <div>
                <h4 className="font-medium">Password</h4>
                <p className="text-sm text-muted-foreground">Last updated: Never</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleChangePassword}>
              Change Password
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <h4 className="font-medium">Email Verification</h4>
                <p className="text-sm text-muted-foreground">
                  Status: {user.emailAddresses[0]?.verification?.status === "verified" ? "Verified" : "Unverified"}
                </p>
              </div>
            </div>
            {user.emailAddresses[0]?.verification?.status !== "verified" && (
              <Button variant="outline" size="sm" onClick={handleVerifyEmail}>
                Verify Email
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleEnable2FA}>
              Enable 2FA
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
