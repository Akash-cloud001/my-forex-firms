"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, LogOut, Trash2 } from 'lucide-react';
import LogoutConfirmation from './LogoutConfirmation';

interface DangerZoneProps {
  onSignOut: () => void;
}

export default function DangerZone({ onSignOut }: DangerZoneProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    onSignOut();
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion logic with confirmation dialog
    console.log('Delete account clicked');
  };

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </CardTitle>
        <CardDescription>
          Irreversible and destructive actions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
          <div>
            <h4 className="font-medium text-destructive">Sign Out</h4>
            <p className="text-sm text-muted-foreground">Sign out of your account on this device</p>
          </div>
          <Button variant="destructive" onClick={handleLogoutClick}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
          <div>
            <h4 className="font-medium text-destructive">Delete Account</h4>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data
            </p>
          </div>
          <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </CardContent>
      
      <LogoutConfirmation
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </Card>
  );
}
