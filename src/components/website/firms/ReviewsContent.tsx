import React, { useState } from 'react'
import ReviewCard from '@/components/ui/ReviewCard'
import { FirmReview } from '@/hooks/queries/useFirmReviews'
import { Loader2Icon } from 'lucide-react';
import { ReviewViewModal } from '@/components/reviews';

interface ReviewsContentProps {
  reviews?: FirmReview[];
  isLoading?: boolean;
}

const ReviewsContent: React.FC<ReviewsContentProps> = ({ reviews = [], isLoading = false }) => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<FirmReview | null>(null);

  const handleViewReview = (review: FirmReview) => {
    setSelectedReview(review);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedReview(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
  };
  if (isLoading) {
    return (
      <section className='flex gap-4 justify-center items-center mt-8 border border-border rounded-sm p-8 card-custom-grad'>
        <Loader2Icon className='w-10 h-10 animate-spin text-primary' />
      </section>
    )
  }

  if (!reviews || reviews.length === 0) {
    return (
      <section className='flex flex-wrap gap-4 justify-start items-center mt-8 border border-border rounded-sm p-8 card-custom-grad'>
        <div className="w-full text-center text-foreground/60 py-8">
          <p className="text-lg font-medium">No reviews yet</p>
          <p className="text-sm mt-2">Be the first to share your experience with this firm.</p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8'>
        {reviews.map((review) => (
          <ReviewCard
            key={review._id}
            userName={review.userName}
            firmName={review.firmName}
            issueType={review.issueType}
            description={review.description}
            files={review.files.map(file => ({
              name: file.name,
              type: file.type,
              size: file.size,
              url: file.url,
              uploadedAt: file.uploadedAt ? (typeof file.uploadedAt === 'string' ? new Date(file.uploadedAt) : file.uploadedAt) : undefined,
            }))}
            // status={review.status}
            onClick={() => handleViewReview(review)}
          />
        ))}
      </section>

      <ReviewViewModal
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        review={selectedReview ? {
          ...selectedReview,
          isVerified: true, // Public reviews are always verified/approved
        } : null}
        getStatusColor={getStatusColor}
        formatDate={formatDate}
        onDelete={undefined} // No delete functionality in public view
      />
    </>
  )
}

export default ReviewsContent