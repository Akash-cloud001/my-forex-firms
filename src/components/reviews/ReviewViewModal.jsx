"use client"
import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Star, MessageSquare, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

const ReviewViewModal = ({ 
  isOpen, 
  onClose, 
  review, 
  getStatusColor, 
  getRatingColor, 
  formatDate 
}) => {
  if (!review) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xs sm:max-w-2xl max-h-[90vh] overflow-y-auto text-white border-none">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            Review Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Review Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Firm Name</Label>
              <p className="text-foreground font-medium capitalize">{review.firmName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Issue Type</Label>
              <p className="text-foreground capitalize">{review.issueType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Rating</Label>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < review.rating ? "fill-current" : "text-muted-foreground",
                      getRatingColor(review.rating)
                    )}
                  />
                ))}
                <span className="text-foreground ml-1">{review.rating}/5</span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Status</Label>
              <Badge className={cn("text-xs capitalize", getStatusColor(review.status))}>
                {review.status === 'pending' ? 'In Review' : review.status === 'approved' ? 'Posted' : 'Rejected'}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Created</Label>
              <p className="text-foreground">{formatDate(review.createdAt)}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
              <p className="text-foreground">{formatDate(review.updatedAt)}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Description</Label>
            <div className="mt-2 bg-muted/20 rounded-lg">
              <p className="text-foreground whitespace-pre-wrap first-letter:capitalize">{review.description}</p>
            </div>
          </div>

          {/* Files */}
          {review.files && review.files.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Attachments</Label>
              <div className="mt-2 space-y-2">
                {review.files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={file.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 text-sm underline"
                    >
                      {file.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verification Status */}
          {review.isVerified && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                Verified
              </Badge>
              <span className="text-sm text-green-700 dark:text-green-300">This review has been verified</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ReviewViewModal
