"use client";

import React from 'react';
import { User } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

interface AccountInfoProps {
  user: User;
}

export default function AccountInfo({ user }: AccountInfoProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Account Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
            <p className="text-foreground">{formatDate(user.createdAt)}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Last Sign In</Label>
            <p className="text-foreground">
              {user.lastSignInAt ? formatDate(user.lastSignInAt) : "Never"}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">User ID</Label>
            <p className="text-foreground font-mono text-sm">{user.id}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Account Status</Label>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Active
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
