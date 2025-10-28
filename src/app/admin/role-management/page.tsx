"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Shield, Crown, UserCheck, Edit3, Search, UserPlus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
}

export default function EmailManagementPage() {
  const { user } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('admins');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const currentUserEmail = user?.emailAddresses[0]?.emailAddress;

  useEffect(() => {
    fetchUsers();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data.users);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
      console.error('Error fetching users:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/admin/users?search=${encodeURIComponent(term)}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to search users');
      }
      
      const data = await response.json();
      setSearchResults(data.users);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search users';
      console.error('Error searching users:', errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSearching(false);
    }
  };

  const assignRole = async () => {
    if (!selectedUser || !selectedRole) {
      toast.error('Please select a user and role');
      return;
    }

    setIsAssigning(true);
    try {
      const response = await fetch('/api/admin/users/assign-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          role: selectedRole
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Role ${selectedRole} assigned to ${selectedUser.email}`);
        setSelectedUser(null);
        setSelectedRole('');
        setSearchTerm('');
        setSearchResults([]);
        setIsModalOpen(false);
        // Clear any pending search timeout
        if (searchTimeout) {
          clearTimeout(searchTimeout);
          setSearchTimeout(null);
        }
        fetchUsers(); // Refresh the user list
      } else {
        toast.error(data.error || 'Failed to assign role');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to assign role';
      toast.error(errorMessage);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // If search term is empty, clear results immediately
    if (!value.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      searchUsers(value);
    }, 300); // 300ms debounce delay
    
    setSearchTimeout(timeout);
  };

  // Helper functions to filter users by role
  const getUsersByRole = (role: string) => {
    return users.filter(user => user.role === role);
  };

  const admins = getUsersByRole('admin');
  const moderators = getUsersByRole('moderator');
  const editors = getUsersByRole('editor');

  // Component to render user cards
  const UserCard = ({ user, roleIcon: Icon }: { user: User; roleIcon: React.ComponentType<{ className?: string }> }) => (
    <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="font-medium text-white">{user.firstName} {user.lastName}</div>
          <div className="text-xs text-muted-foreground">{user.email}</div>
          <div className="text-xs text-muted-foreground">
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={user.status === 'active' ? 'default' : 'outline'}>
          {user.status}
        </Badge>
        {user.email === currentUserEmail && (
          <Badge variant="secondary" className="text-xs">You</Badge>
        )}
      </div>
    </div>
  );




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
            <Shield className="h-8 w-8" />
            Role Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage user roles and permissions across the platform
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <UserPlus className="h-4 w-4 mr-2" />
              Assign Role
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] text-white border-none">
            <DialogHeader>
              <DialogTitle>Assign User Role</DialogTitle>
              <DialogDescription>
                Search for a user and assign them a role. This will update their permissions across the platform.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Search Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search User</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                    disabled={isSearching}
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    </div>
                  )}
                </div>
                {isSearching && (
                  <p className="text-xs text-muted-foreground">Searching...</p>
                )}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <div className="max-h-44 overflow-y-auto space-y-2">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className={`p-3 rounded-sm border cursor-pointer transition-colors ${
                          selectedUser?.id === user.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:bg-card/50'
                        }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-xs">{user.firstName} {user.lastName}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                          <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results State */}
              {searchTerm && !isSearching && searchResults.length === 0 && (
                <div className="text-center py-4">
                  <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No users found</p>
                  <p className="text-xs text-muted-foreground">Try a different search term</p>
                </div>
              )}

              {/* Role Selection */}
              {selectedUser && (
                <div className="space-y-2 w-full">
                  <label className="text-sm font-medium">Assign Role</label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Selected User Summary */}
              {selectedUser && selectedRole && (
                <div className="p-4 rounded-lg bg-card/50 border border-border">
                  <div className="text-sm">
                    <div className="font-medium">Assignment Summary:</div>
                    <div className="text-muted-foreground mt-3">
                      <strong>{selectedUser.firstName} {selectedUser.lastName}</strong> ({selectedUser.email})
                    </div>
                    <div className="flex items-center gap-2 justify-between">
                      <div className="text-muted-foreground mt-3">
                        Current: <Badge variant="outline" className="ml-1">{selectedUser.role}</Badge>
                      </div>
                      <div className="text-muted-foreground mt-3">
                        New: <Badge variant="default" className="ml-1">{selectedRole}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedUser(null);
                  setSelectedRole('');
                  setSearchTerm('');
                  setSearchResults([]);
                  // Clear any pending search timeout
                  if (searchTimeout) {
                    clearTimeout(searchTimeout);
                    setSearchTimeout(null);
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={assignRole}
                disabled={!selectedUser || !selectedRole || isAssigning}
              >
                {isAssigning ? 'Assigning...' : 'Assign Role'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Role Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card/30">
          <TabsTrigger value="admins" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Admins ({admins.length})
          </TabsTrigger>
          <TabsTrigger value="moderators" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Moderators ({moderators.length})
          </TabsTrigger>
          <TabsTrigger value="editors" className="flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Editors ({editors.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="admins" className="space-y-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Administrators ({admins.length})
              </CardTitle>
              <CardDescription>
                Full system access and control over all features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {admins.map((admin) => (
                  <UserCard key={admin.id} user={admin} roleIcon={Crown} />
                ))}
                {admins.length === 0 && (
                  <div className="text-center py-8">
                    <Crown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No administrators found</h3>
                    <p className="text-muted-foreground">
                      No users with admin role in the database
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderators" className="space-y-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Moderators ({moderators.length})
              </CardTitle>
              <CardDescription>
                Content moderation and user management capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {moderators.map((moderator) => (
                  <UserCard key={moderator.id} user={moderator} roleIcon={UserCheck} />
                ))}
                {moderators.length === 0 && (
                  <div className="text-center py-8">
                    <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No moderators found</h3>
                    <p className="text-muted-foreground">
                      No users with moderator role in the database
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editors" className="space-y-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                Editors ({editors.length})
              </CardTitle>
              <CardDescription>
                Content creation and editing permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {editors.map((editor) => (
                  <UserCard key={editor.id} user={editor} roleIcon={Edit3} />
                ))}
                {editors.length === 0 && (
                  <div className="text-center py-8">
                    <Edit3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No editors found</h3>
                    <p className="text-muted-foreground">
                      No users with editor role in the database
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Role Explanations */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Role Permissions
          </CardTitle>
          <CardDescription>
            Understanding the different user roles and their capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <h3 className="font-semibold text-white">Administrator</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Full system access including user management, role assignments, system settings, 
                and all administrative functions. Can create, modify, and delete any content or user.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-white">Moderator</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Content moderation and user management capabilities. Can review, approve, 
                or reject content, manage user comments, and handle user reports. Limited administrative access.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold text-white">Editor</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Content creation and editing permissions. Can create, edit, and publish content, 
                manage their own posts, and collaborate on content. No administrative or moderation powers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
