"use client";

import React from 'react';
import { User } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User as UserIcon, Camera } from 'lucide-react';
import Image from 'next/image';

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          Personal Information
        </CardTitle>
        <CardDescription>
          Update your personal details and profile information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture Section */}
        <div className="flex items-center gap-6">
          <div className="relative">
            {user.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.fullName || "Profile"}
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
            ) : (
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.imageUrl} />
                <AvatarFallback className="text-lg">
                  {user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            )}
            <Button
              size="sm"
              variant="outline"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{user.fullName || "No name set"}</h3>
            <p className="text-muted-foreground">{user.emailAddresses[0]?.emailAddress}</p>
            <Badge variant="secondary" className="mt-1">
              {user.emailAddresses[0]?.verification?.status === "verified" ? "Verified" : "Unverified"}
            </Badge>
          </div>
        </div>

        <Separator />
      </CardContent>
    </Card>
  );
}
