"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Users, Search, UserX, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  role: string;
  status: string;
  createdAt: string;
  lastSignInAt: string;
  fullName?: string;
  phone?: string;
  analytics?: {
    loginCount: number;
    lastActivity: string;
    totalFirmsCreated: number;
    totalReviewsCreated: number;
  };
}

const roleColors = {
  admin: 'destructive',
  moderator: 'default',
  editor: 'secondary',
  user: 'outline'
} as const;

const roleLabels = {
  admin: 'Admin',
  moderator: 'Moderator', 
  editor: 'Editor',
  user: 'User'
} as const;

const statusColors = {
  active: 'default',
  inactive: 'secondary',
  suspended: 'destructive',
  pending: 'outline'
} as const;

const statusLabels = {
  active: 'Active',
  inactive: 'Inactive',
  suspended: 'Suspended',
  pending: 'Pending'
} as const;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (search?: string) => {
    try {
      setLoading(true);
      const url = search ? `/api/admin/users?search=${encodeURIComponent(search)}` : '/api/admin/users';
      const response = await fetch(url);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data.users);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const seedUsers = async () => {
    try {
      setSeeding(true);
      const response = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Users seeded successfully!');
        
        // Show detailed results
        const { summary } = data;
        if (summary.clerkImport) {
          toast.success(`Imported ${summary.clerkImport.imported} users from Clerk`);
        }
        if (summary.adminEmailProcessing) {
          toast.success(`Processed ${summary.adminEmailProcessing.seeded} admin emails`);
        }
        
        // Refresh the user list
        fetchUsers();
      } else {
        toast.error(data.error || 'Failed to seed users');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to seed users';
      toast.error(errorMessage);
    } finally {
      setSeeding(false);
    }
  };


  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        fetchUsers(searchTerm);
      } else {
        fetchUsers();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Users className="h-8 w-8" />
            User Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage user roles and permissions
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 text-white"
            />
          </div>
          <Button
            onClick={seedUsers}
            disabled={seeding}
            className="bg-primary hover:bg-primary/90"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {seeding ? 'Seeding...' : 'Seed Users'}
          </Button>
        </div>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border/30 hover:bg-card/30 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={user.imageUrl} alt={user.firstName} />
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {user.firstName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-white text-sm">
                            {user.firstName} {user.lastName}
                          </h3>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={roleColors[user.role as keyof typeof roleColors]}>
                        {roleLabels[user.role as keyof typeof roleLabels]}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={statusColors[user.status as keyof typeof statusColors]}>
                        {statusLabels[user.status as keyof typeof statusLabels]}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {users.length === 0 && (
              <div className="text-center py-8">
                <UserX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No users found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search terms' : 'No users found in the database'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
