"use client";

import React, { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Shield, 
  Trash2, 
  LogOut, 
  Edit3,
  Camera,
  AlertTriangle
} from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-24 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isSignedIn || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <UserIcon className="h-12 w-12 mx-auto text-muted-foreground" />
              <h2 className="text-xl font-semibold">Please Sign In</h2>
              <p className="text-muted-foreground">
                You need to be signed in to view your profile.
              </p>
              <Button onClick={() => router.push('/sign-in')} className="w-full">
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // Note: Account deletion should be handled through Clerk's API
      // This is a placeholder for the actual implementation
      console.log('Account deletion requested');
      // await user.delete(); // This would be the actual deletion call
      alert('Account deletion functionality needs to be implemented with proper backend integration');
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and personal information
          </p>
        </div>

        <div className="grid gap-6">
          {/* Profile Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your personal details and account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture and Basic Info */}
              <div className="flex items-start gap-6">
                <div className="relative">
                  {user.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt={user.fullName || "Profile"}
                      width={100}
                      height={100}
                      className="rounded-full object-cover border-4 border-background shadow-lg"
                    />
                  ) : (
                    <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback className="text-2xl font-semibold">
                        {user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 shadow-lg"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {user.fullName || "No name set"}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {user.emailAddresses[0]?.emailAddress}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge 
                      variant={user.emailAddresses[0]?.verification?.status === "verified" ? "default" : "secondary"}
                      className="flex items-center gap-1"
                    >
                      <Shield className="h-3 w-3" />
                      {user.emailAddresses[0]?.verification?.status === "verified" ? "Verified" : "Unverified"}
                    </Badge>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Member since {user.createdAt ? formatDate(user.createdAt) : 'Unknown'}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">First Name</h4>
                  <p className="text-muted-foreground">
                    {user.firstName || "Not provided"}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Last Name</h4>
                  <p className="text-muted-foreground">
                    {user.lastName || "Not provided"}
                  </p>
                </div>
                {/* <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Username</h4>
                  <p className="text-muted-foreground">
                    {user.username || "Not set"}
                  </p>
                </div> */}
                {/* <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Phone Number</h4>
                  <p className="text-muted-foreground">
                    {user.phoneNumbers[0]?.phoneNumber || "Not provided"}
                  </p>
                </div> */}
              </div>
            </CardContent>
          </Card>

          {/* Account Actions Card */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                Account Actions
              </CardTitle>
              <CardDescription>
                Manage your account settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Edit Profile</h4>
                  <p className="text-sm text-muted-foreground">
                    Update your personal information and profile picture
                  </p>
                </div>
                <Button variant="outline">
                  Edit Profile
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Change Password</h4>
                  <p className="text-sm text-muted-foreground">
                    Update your account password
                  </p>
                </div>
                <Button variant="outline">
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card> */}

          {/* Danger Zone Card */}
          <Card className="border-destructive/20">
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
                  <h4 className="font-medium text-destructive">Delete Account</h4>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-destructive">
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove all your data from our servers. You will lose access to:
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>All your reviews and ratings</li>
                          <li>Your profile information</li>
                          <li>Any saved preferences</li>
                          <li>Account history and activity</li>
                        </ul>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        {isDeleting ? "Deleting..." : "Yes, delete my account"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
