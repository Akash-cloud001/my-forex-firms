"use client";

import React, { useState } from 'react';
import { SignedIn, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Shield, 
  Camera,
  ArrowRight,
  LogOut
} from 'lucide-react';
import Image from 'next/image';
import LogoutConfirmation from '@/components/profile/LogoutConfirmation';

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  // const { signOut } = useClerk();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  // const [isSigningOut, setIsSigningOut] = useState(false);

  // const handleSignOut = async () => {
  //   setIsSigningOut(true);
  //   try {
  //     await signOut();
  //     router.push('/');
  //   } catch (error) {
  //     console.error('Error signing out:', error);
  //   } finally {
  //     setIsSigningOut(false);
  //     setShowLogoutModal(false);
  //   }
  // };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 lg:py-8">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-muted rounded w-1/3 sm:w-1/4 mb-4 sm:mb-6"></div>
            <div className="space-y-4 sm:space-y-6">
              <div className="h-24 sm:h-32 bg-muted rounded"></div>
              <div className="h-20 sm:h-24 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isSignedIn || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full mx-auto">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <UserIcon className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground" />
              <h2 className="text-lg sm:text-xl font-semibold">Please Sign In</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
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



  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-4 sm:pb-6 lg:pb-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text tracking-tight">My Profile</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage your account settings and personal information
            </p>
          </div>
          {/* <Button 
            onClick={() => router.push('/reviews')} 
            variant="outline" 
            className="text-white/80 hover:text-white font-semibold w-full sm:w-auto"
          >
            View Reviews
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button> */}
        </div>

        <div className="grid gap-6"></div>
          {/* Profile Information Card */}
          <Card>
            {/* <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your personal details and account information
              </CardDescription>
            </CardHeader> */}
            <CardContent className="space-y-4 sm:space-y-6">
              {/* Profile Picture and Basic Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                <div className="relative shrink-0">
                  {user.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt={user.fullName || "Profile"}
                      width={100}
                      height={100}
                      className="rounded-full object-cover border-4 border-primary/70 shadow-lg w-20 h-20 sm:w-24 sm:h-24"
                    />
                  ) : (
                    <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-background shadow-lg">
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback className="text-lg sm:text-2xl font-semibold">
                        {user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  {/* <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 h-6 w-6 sm:h-8 sm:w-8 rounded-full p-0 shadow-lg"
                  >
                    <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button> */}
                </div>
                
                <div className="flex-1 space-y-3 text-left md:text-center sm:text-left">
                  <div>
                    <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                      {user.fullName || "No name set"}
                    </h3>
                    <Badge 
                      variant={user.emailAddresses[0]?.verification?.status === "verified" ? "default" : "secondary"}
                      className="flex items-center gap-1 text-xs"
                    >
                      <Shield className="h-3 w-3" />
                      {user.emailAddresses[0]?.verification?.status === "verified" ? "Verified" : "Unverified"}
                    </Badge>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                      <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground text-sm sm:text-base break-all">
                        {user.emailAddresses[0]?.emailAddress}
                      </span>
                    </div>
                  </div>
                  
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                      <span className="text-center sm:text-left">
                        Member since {user.createdAt ? formatDate(user.createdAt) : 'Unknown'}
                      </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Additional Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground text-sm sm:text-base">First Name</h4>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    {user.firstName || "Not provided"}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground text-sm sm:text-base">Last Name</h4>
                  <p className="text-muted-foreground text-sm sm:text-base">
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
          <SignedIn>
            <Button onClick={() => setShowLogoutModal(true)} className="mt-4">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </SignedIn>
         
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
          {/* <Card className="border-destructive/20 mt-4">
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <div className="flex-1">
                  <h4 className="font-medium text-destructive text-sm sm:text-base">Delete Account</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                      <Trash2 className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Delete Account</span>
                      <span className="sm:hidden">Delete</span>
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
          </Card> */}
        </div>
        <LogoutConfirmation isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
      </div>
    );
}
