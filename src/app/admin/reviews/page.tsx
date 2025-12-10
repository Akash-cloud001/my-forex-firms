"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@clerk/nextjs';
import {
  ReviewsTable,

  Review,
  ReviewStatus
} from '@/components/admin/reviews';
import ReviewDetailModal from '@/components/admin/reviews/ReviewDetailModal';

export default function ReviewsList() {
  const { userId } = useAuth();
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

  const updateReviewStatus = async (reviewId: string, status: ReviewStatus) => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
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

  const handleRequestInfo = async (reviewId: string, subject: string, message: string) => {
    try {
      setIsUpdating(true);
      const response = await fetch('/api/admin/firm-reviews/request-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId,
          subject,
          message,
          senderId: userId
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to request info');
      }

      const data = await response.json();

      // Update local state with new review data
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review._id === reviewId
            ? { ...review, ...data.review }
            : review
        )
      );

      // Update selected review if it's the same
      if (selectedReview?._id === reviewId) {
        setSelectedReview(prev => prev ? { ...prev, ...data.review } : null);
      }

      toast.success('Information request sent successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to request info';
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch =
      review.firmName.toLowerCase().includes(searchLower) ||
      review.issueType.toLowerCase().includes(searchLower) ||
      review.description.toLowerCase().includes(searchLower) ||
      (review.userDetails?.email && review.userDetails.email.toLowerCase().includes(searchLower)) ||
      (review.userDetails?.firstName && review.userDetails.firstName.toLowerCase().includes(searchLower)) ||
      (review.userDetails?.lastName && review.userDetails.lastName.toLowerCase().includes(searchLower)) ||
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
                <SelectItem value="info-requested">Info Requested</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <ReviewsTable
          reviews={filteredReviews}
          onReviewClick={handleReviewClick}
          formatDate={formatDate}
        />

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
      </Card>

      <ReviewDetailModal
        review={selectedReview}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onApprove={(id) => updateReviewStatus(id, 'approved')}
        onReject={(id) => updateReviewStatus(id, 'rejected')}
        onRequestInfo={handleRequestInfo}
        isUpdating={isUpdating}
        formatDate={formatDate}
      />
    </div>
  );
}
