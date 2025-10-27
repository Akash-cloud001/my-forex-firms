"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, UserPlus, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function SetupPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSetupAdmin = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to setup admin');
      }

      setIsSuccess(true);
      toast.success(data.message || 'Admin role assigned successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to setup admin role';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-md mx-auto bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Admin Setup Complete!</h2>
              <p className="text-muted-foreground mb-4">
                The user <strong>{email}</strong> has been granted admin privileges.
              </p>
              <Button 
                onClick={() => window.location.href = '/admin/users'}
                className="w-full"
              >
                Go to User Management
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-md mx-auto bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Admin Setup
          </CardTitle>
          <CardDescription>
            Grant admin privileges to a user account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user email"
              className="mt-1"
            />
          </div>
          
          <Button 
            onClick={handleSetupAdmin}
            disabled={isLoading || !email}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Setting up admin...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Grant Admin Access
              </>
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            This will grant full admin privileges to the specified user account.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
