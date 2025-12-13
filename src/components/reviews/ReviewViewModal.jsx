"use client"
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { FileText, Calendar, Building2, AlertCircle, Paperclip, CheckCircle2, Shield, Trash2, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const ReviewViewModal = ({ 
  isOpen, 
  onClose, 
  review, 
  getStatusColor, 
  formatDate,
  onDelete
}) => {
  if (!review) return null

  const formatIssueType = (type) => {
    return type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'pending': return 'In Review'
      case 'approved': return 'Posted'
      case 'rejected': return 'Rejected'
      default: return status
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xs sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-none bg-background">
        <div className="card-custom-grad rounded-lg overflow-hidden">
          {/* Header Image Section */}
          <div className="relative w-full ">
            <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/90 via-black/50 to-transparent z-[1]'></div>
            <Image 
              src="/website/review.svg" 
              alt="review" 
              fill 
              className='w-full h-full object-cover' 
            />
            <div className="absolute bottom-4 left-6 right-6 z-[2]">
              <DialogTitle className="text-2xl font-bold text-white mb-2">
                Review Details
              </DialogTitle>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className={cn("text-xs capitalize px-3 py-1", getStatusColor(review.status))}>
                  {getStatusDisplay(review.status)}
                </Badge>
                {review.isVerified && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs px-3 py-1">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 sm:p-6 space-y-6 mt-6">
            {/* All Fields in One Div */}
            <div className="flex flex-col gap-4">
              {/* Firm Name */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-white/60 uppercase tracking-wide">Firm Name</span>
                </div>
                <p className="text-white font-semibold capitalize">{review.firmName}</p>
              </div>

              {/* Issue Type */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-white/60 uppercase tracking-wide">Issue Type</span>
                </div>
                <p className="text-white font-semibold">{formatIssueType(review.issueType)}</p>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-white/60 uppercase tracking-wide">Status</span>
                </div>
                <Badge className={cn("text-sm capitalize", getStatusColor(review.status))}>
                  {getStatusDisplay(review.status)}
                </Badge>
              </div>

              {/* Date */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-white/60 uppercase tracking-wide">Created</span>
                </div>
                <p className="text-white font-semibold">{formatDate(review.createdAt)}</p>
              </div>
            </div>

            {/* Description Section */}
            <div className="">
              <h3 className="text-sm font-geist-sans font-semibold text-white/80 mb-2 uppercase tracking-wide flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-white/60 uppercase tracking-wide">Description</span>
              </h3>
              <div className="bg-black/20 rounded-lg p-4">
                <p className="text-white/90 font-geist-inter text-sm leading-relaxed whitespace-pre-wrap first-letter:capitalize">
                  {review.description}
                </p>
              </div>
            </div>
            {/* Additional Info and Actions */}
            { (review.status === 'pending' || review.status === 'rejected') && <div className="flex items-end justify-end">
              
              { onDelete && (
                <Button
                  onClick={() => {
                    onClose();
                    onDelete(review);
                  }}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Review
                </Button>
              )}
            </div>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ReviewViewModal
