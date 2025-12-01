import { Paperclip, Expand } from 'lucide-react'
import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from './badge'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ReviewCardProps {
  issueType: string
  customIssueType?: string
  description: string
  files?: Array<{
    name: string
    type: string
    size: number
    url: string
    uploadedAt?: Date
  }>
  userId?: string
  userName?: string
  onClick?: () => void
  status?: string
  getStatusColor?: (status: string) => string
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  issueType,
  description,
  files = [],
  userId,
  userName,
  onClick,
  status,
  getStatusColor
}) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)

  // Format issue type for display
  const formatIssueType = (type: string) => {
    return type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  // Get display name
  const displayName = userName || userId || 'Anonymous'

  // Format attachment text
  const attachmentCount = files?.length || 0
  const attachmentText = attachmentCount === 1 ? '1 attachment' : `${attachmentCount} attachments`

  // Get status color class
  const statusColorClass = getStatusColor && status ? getStatusColor(status) : ''

  // Check if file is PDF
  const isPDF = (fileType: string) => {
    return fileType === 'application/pdf' || fileType === 'application/x-pdf'
  }

  // Check if file is image
  const isImage = (fileType: string) => {
    return fileType.startsWith('image/')
  }

  // Handle expand button click
  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    
    // Prevent multiple opens
    if (isImageModalOpen) return
    
    if (files.length > 0) {
      const firstFile = files[0]
      
      if (isPDF(firstFile.type)) {
        // Open PDF in new tab
        window.open(firstFile.url, '_blank', 'noopener,noreferrer')
      } else if (isImage(firstFile.type)) {
        // Open image in modal
        setSelectedImageUrl(firstFile.url)
        setIsImageModalOpen(true)
      } else {
        // Fallback: try to open in new tab
        window.open(firstFile.url, '_blank', 'noopener,noreferrer')
      }
    }
  }

  return (
    <div 
      onClick={onClick}
      className=' w-full p-4 sm:p-6 card-custom-grad rounded-md cursor-pointer hover:opacity-90 transition-opacity'
    >
      {/* Image Section */}
      <figure className="relative w-full aspect-video max-h-[200px]">
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-black/30 to-transparent z-[1]'></div>
          {files.length > 0 ? <Image 
            src={files[0].url} 
            alt="review" 
            fill 
            className='w-full h-full object-contain opacity-30' 
          /> : <Image 
            src="/website/fallback-review-img.svg" 
            alt="review" 
            fill 
            className='w-full h-full object-contain opacity-30' 
          />}
          {files.length > 0 && (
            <Button 
              variant="ghost" 
              className='absolute bottom-0 right-0 text-white/80 hover:text-white cursor-pointer z-[2]'
              onClick={handleExpandClick}
              type="button"
            >
              <Expand className='h-3 w-3 text-white/80 hover:text-white cursor-pointer' />
            </Button>
          )}
      </figure>

      {/* Content Section */}
      <div className='mt-8'>
        {/* Header - Issue Type and Username */}
        <div className='flex items-start gap-2 sm:gap-0 sm:items-center justify-between flex-wrap'>
          <div className='flex items-center gap-2'>
            <Badge className={cn("text-[10px] sm:text-xs font-semibold uppercase text-foreground px-4 py-1.5", statusColorClass)}>
                {status === 'pending' ? 'In Review' : status === 'approved' ? 'Posted' : 'Rejected'}
            </Badge>
            <div className="text-[10px] sm:text-xs font-semibold uppercase text-foreground px-4 py-1.5 bg-white/10 rounded-full border border-border">
              {formatIssueType(issueType)}
            </div>
          </div>
          <div className="text-xs font-semibold text-primary">
            @{displayName}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm font-geist-sans text-white/70 line-clamp-2 my-4">
          {description}
        </p>

        {/* Attachments */}
        {attachmentCount > 0 ? (
          <div className='flex items-center justify-end gap-1 text-primary'>
            <Paperclip className='h-3 w-3 text-primary' />
            <p className='text-xs font-medium text-primary'>{attachmentText}</p>
          </div>
        ) : (
          <div className='flex items-center justify-end gap-1 text-primary'>
            <Paperclip className='h-3 w-3 text-primary' />
            <p className='text-xs font-medium text-primary'>0 attachments</p>
          </div>
        )}
      </div>

      {/* Image View Modal */}
      <Dialog 
        open={isImageModalOpen} 
        onOpenChange={(open) => {
          setIsImageModalOpen(open)
          if (!open) {
            // Clear selected image when modal closes
            setSelectedImageUrl(null)
          }
        }}
      >
        <DialogContent className="max-w-xs sm:max-w-4xl max-h-[90vh] p-0 border-none bg-background">
          <DialogHeader className="sr-only">
            <DialogTitle>View Image</DialogTitle>
          </DialogHeader>
          {selectedImageUrl && (
            <div className="relative w-full h-[80vh] flex items-center justify-center bg-black/50">
              <Image
                src={selectedImageUrl}
                alt="Review attachment"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ReviewCard