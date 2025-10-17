"use client";

import React from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileHeader from '@/components/profile/ProfileHeader';
import PersonalInfoForm from '@/components/profile/PersonalInfoForm';
import AccountInfo from '@/components/profile/AccountInfo';
import SecuritySettings from '@/components/profile/SecuritySettings';
import NotificationSettings from '@/components/profile/NotificationSettings';
import DangerZone from '@/components/profile/DangerZone';

export default function ProfilePage() {
  const { user } = useUser();
  const { signOut } = useClerk();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger disabled value="security">Security</TabsTrigger>
          <TabsTrigger disabled value="notifications">Notifications</TabsTrigger>
          <TabsTrigger disabled value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileHeader  />
          <PersonalInfoForm  />
          <AccountInfo  />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecuritySettings  />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="danger" className="space-y-6">
          <DangerZone onSignOut={handleSignOut} />
        </TabsContent>
      </Tabs>
    </div>
  );
}