"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Trash2, Plus, Shield, Mail } from 'lucide-react';

interface AdminEmailData {
  _id: string;
  email: string;
  addedBy: string;
  addedAt: string;
  status: string;
}

export default function EmailManagementPage() {
  const { user } = useUser();
  const [adminEmails, setAdminEmails] = useState<AdminEmailData[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);
  const currentUserEmail = user?.emailAddresses[0]?.emailAddress;

  useEffect(() => {
    fetchAdminEmails();
  }, []);

  const fetchAdminEmails = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/emails');
      const data = await response.json();
      
      if (response.ok) {
        setAdminEmails(data.emails);
      } else {
        toast.error(data.error || 'Failed to load admin emails');
      }
    } catch {
      toast.error('Error loading admin emails');
    } finally {
      setLoading(false);
    }
  };

  const addAdminEmail = async () => {
    if (!newEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setAdding(true);
    try {
      const response = await fetch('/api/admin/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail.trim() })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Admin email added successfully');
        setNewEmail('');
        fetchAdminEmails();
      } else {
        toast.error(data.error || 'Failed to add admin email');
      }
    } catch {
      toast.error('Error adding admin email');
    } finally {
      setAdding(false);
    }
  };

  const removeAdminEmail = async (email: string) => {
    setDeletingEmail(email);
    try {
      const response = await fetch('/api/admin/emails', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Admin email removed successfully');
        fetchAdminEmails();
      } else {
        toast.error(data.error || 'Failed to remove admin email');
      }
    } catch {
      toast.error('Error removing admin email');
    } finally {
      setDeletingEmail(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading admin emails...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Email Access Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage which emails have access to the dashboard
          </p>
        </div>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Admin Email Access ({adminEmails.length})
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Only listed emails can access the dashboard. Others will be redirected to the home page.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Admin Email */}
          <div>
            <h3 className="text-sm font-medium mb-3 text-white">Add New Admin Email</h3>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="email@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addAdminEmail()}
                className="flex-1"
              />
              <Button 
                onClick={addAdminEmail} 
                disabled={adding || !newEmail.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                {adding ? 'Adding...' : 'Add Email'}
              </Button>
            </div>
          </div>

          {/* Current Admin List */}
          <div>
            <h3 className="text-sm font-medium mb-3 text-white">
              Current Admin Emails ({adminEmails.length})
            </h3>
            <div className="space-y-3">
              {adminEmails.map((admin) => (
                <div
                  key={admin._id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{admin.email}</div>
                      <div className="text-xs text-muted-foreground">
                        Added {new Date(admin.addedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {admin.email === currentUserEmail && (
                      <Badge variant="secondary" className="text-xs">You</Badge>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={admin.email === currentUserEmail || deletingEmail === admin.email}
                          className="text-white border-border hover:bg-card/50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Admin Access</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove admin access for {admin.email}? 
                            They will no longer be able to access the dashboard.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => removeAdminEmail(admin.email)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Remove Access
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}

              {adminEmails.length === 0 && (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No admin emails found</h3>
                  <p className="text-muted-foreground">
                    Add the first admin email to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
