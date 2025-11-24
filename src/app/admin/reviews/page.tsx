"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MessageSquare, Search, Star, FileText, Building, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ISSUE_CATEGORIES } from '@/components/website/constant/constants';

interface Review {
  _id: string;
  userId: string;
  firmId?: string;
  firmName: string;
  issueCategory: string; // Added
  issueType: string;
  customIssueType?: string;
  description: string;
  files?: Array<{
    name: string;
    type: string;
    size: number;
    url: string;
  }>;
  status: 'pending' | 'approved' | 'rejected';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  userDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    imageUrl: string;
  };
}

const statusColors = {
  approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
} as const;

const statusLabels = {
  approved: 'Approved',
  pending: 'Pending',
  rejected: 'Rejected'
} as const;

export default function ReviewsList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      // Use the new admin reviews API that fetches everything in one request
      const response = await fetch('/api/admin/reviews?sortBy=createdAt&sortOrder=desc');

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data.reviews);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch reviews';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const updateReviewStatus = async (reviewId: string, status: 'approved' | 'rejected') => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update review status');
      }

      // Update local state
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review._id === reviewId
            ? { ...review, status }
            : review
        )
      );

      toast.success(`Review ${status} successfully`);
      setIsModalOpen(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update review status';
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch =
      // Search in firm name
      review.firmName.toLowerCase().includes(searchLower) ||
      // Search in issue type
      review.issueType.toLowerCase().includes(searchLower) ||
      // Search in description
      review.description.toLowerCase().includes(searchLower) ||
      // Search in user email
      (review.userDetails?.email && review.userDetails.email.toLowerCase().includes(searchLower)) ||
      // Search in user name (first name + last name)
      (review.userDetails?.firstName && review.userDetails.firstName.toLowerCase().includes(searchLower)) ||
      (review.userDetails?.lastName && review.userDetails.lastName.toLowerCase().includes(searchLower)) ||
      // Search in full name combination
      (review.userDetails?.firstName && review.userDetails?.lastName &&
        `${review.userDetails.firstName} ${review.userDetails.lastName}`.toLowerCase().includes(searchLower));

    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-500';
    if (rating >= 3) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getIssueCategoryLabel = (categoryId: string) => {
    const category = ISSUE_CATEGORIES.find(c => c.id === categoryId);
    return category ? category.label : categoryId;
  };

  const handleReviewClick = (review: Review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="h-8 w-8" />
            Review Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Review, verify, and manage user-submitted complaints affecting firm ratings.
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by user, email, firm, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Firm</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Issue Category</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Issue Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review) => (
                <tr
                  key={review._id}
                  className="border-b border-border/30 hover:bg-card/30 transition-colors cursor-pointer"
                  onClick={() => handleReviewClick(review)}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-medium text-white text-sm">
                          {review.userDetails ? `${review.userDetails.firstName} ${review.userDetails.lastName}` : 'Loading...'}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {review.userDetails?.email || 'Unknown email'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Building className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium text-white text-sm">
                          {review.firmName}
                        </h3>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="outline" className="text-xs">
                      {getIssueCategoryLabel(review.issueCategory)}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-white capitalize">
                      {review.issueType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={statusColors[review.status]}>
                      {statusLabels[review.status]}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredReviews.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No reviews found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try searching by user name, email, firm name, or review content'
                  : 'No reviews have been submitted yet'
                }
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Review Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto text-white border-none">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2 capitalize">
              <MessageSquare className="h-5 w-5" />
              Review Details
            </DialogTitle>
            <DialogDescription>
              Review information and management actions
            </DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="">
              {/* User Details */}
              {selectedReview.userDetails && (
                <div className="bg-muted/10 rounded-lg mb-4">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                      <p className="text-white font-medium text-sm">
                        {selectedReview.userDetails.firstName} {selectedReview.userDetails.lastName}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <p className="text-white text-sm">{selectedReview.userDetails.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Review Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Firm Name</Label>
                  <p className="text-white font-medium capitalize text-sm">{selectedReview.firmName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Issue Category</Label>
                  <p className="text-white capitalize text-sm">{getIssueCategoryLabel(selectedReview.issueCategory)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Issue Sub-Category</Label>
                  <p className="text-white capitalize text-sm">{selectedReview.issueType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                </div>
                {selectedReview.customIssueType && (
                  <div className="col-span-1 md:col-span-2">
                    <Label className="text-sm font-medium text-muted-foreground">Custom Issue Type</Label>
                    <p className="text-white text-sm break-words mt-1 bg-muted/20 p-2 rounded-md">
                      {selectedReview.customIssueType}
                    </p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge className={statusColors[selectedReview.status]}>
                    {statusLabels[selectedReview.status]}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                  <p className="text-white text-sm">{formatDate(selectedReview.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                  <p className="text-white text-sm">{formatDate(selectedReview.updatedAt)}</p>
                </div>
              </div>

              {/* Description */}
              <div className="my-4">
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <div className="mt-2 bg-muted/20 rounded-lg">
                  <p className="text-white whitespace-pre-wrap text-sm first-letter:capitalize">{selectedReview.description}</p>
                </div>
              </div>

              {/* Files */}
              {selectedReview.files && selectedReview.files.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Attachments</Label>
                  <div className="mt-2 space-y-2">
                    {selectedReview.files.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-primary text-sm underline"
                        >
                          {file.name}
                        </a>
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                <Button
                  onClick={() => updateReviewStatus(selectedReview._id, 'approved')}
                  disabled={isUpdating || selectedReview.status === 'approved'}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => updateReviewStatus(selectedReview._id, 'rejected')}
                  disabled={isUpdating || selectedReview.status === 'rejected'}
                  variant="destructive"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

