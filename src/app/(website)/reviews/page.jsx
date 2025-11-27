"use client"
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { MessageSquare } from 'lucide-react'
import { getReviews, deleteReview } from '@/lib/reviewApi'
import { useUser } from '@clerk/nextjs'
import { ReviewCard, ReviewViewModal, ReviewDeleteModal, LoadingSkeleton } from '@/components/reviews'

const ReviewsPage = () => {
  const { user, isLoaded } = useUser()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // all, pending, approved, rejected
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState(null)

  useEffect(() => {
    if (isLoaded && user) {
      fetchReviews()
    }
  }, [filter, isLoaded, user])

  const fetchReviews = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const response = await getReviews({
        userId: user.id,
        status: filter === 'all' ? undefined : filter,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      })
      setReviews(response.reviews)
      console.log(response.reviews,'response.reviews')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-success'
    if (rating >= 3) return 'text-yellow-500'
    return 'text-red-500'
  }

  const handleDeleteClick = (review) => {
    setReviewToDelete(review);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return;
    
    try {
      setLoading(true);
      await deleteReview(reviewToDelete._id);
      await fetchReviews(); // Refresh the reviews list
      setError(null); // Clear any previous errors
      setDeleteModalOpen(false);
      setReviewToDelete(null);
    } catch (err) {
      console.error('Error deleting review:', err);
      setError(err.message || 'Failed to delete review');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setReviewToDelete(null);
  };

  const handleViewReview = (review) => {
    setSelectedReview(review);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedReview(null);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`
    return `${Math.floor(diffInSeconds / 31536000)}y ago`
  }

  if (!isLoaded || loading) {
    return <LoadingSkeleton />
  }

  if (!user) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4 headline-grad">Your Reviews</h1>
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
              <p className="text-yellow-800 dark:text-yellow-200">Please sign in to view your reviews.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4 headline-grad">Your Reviews</h1>
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <p className="text-red-800 dark:text-red-200">Error loading reviews: {error}</p>
              <Button onClick={fetchReviews} className="mt-4">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 headline-grad">Your Reviews</h1>
          <p className="text-base text-muted-foreground">
            Manage and track your submitted reviews
          </p>
        </div>

        {/* Reviews Grid */}
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No reviews found</h3>
            <p className="text-muted-foreground mb-4">
              {filter === 'all' 
                ? "You haven't submitted any reviews yet." 
                : `No ${filter} reviews found.`
              }
            </p>
            <Button asChild>
              <a href="/post-review">Submit Your First Review</a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onView={handleViewReview}
                onDelete={handleDeleteClick}
                getStatusColor={getStatusColor}
                getRatingColor={getRatingColor}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}

        {/* Pagination would go here if needed */}
      </div>

      {/* Delete Confirmation Modal */}
      <ReviewDeleteModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={loading}
      />

      {/* View Review Modal */}
      <ReviewViewModal
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        review={selectedReview}
        getStatusColor={getStatusColor}
        getRatingColor={getRatingColor}
        formatDate={formatDate}
      />
    </div>
  )
}

export default ReviewsPage