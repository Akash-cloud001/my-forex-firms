import { Expand, Download, Building2 } from 'lucide-react'
import React, { useState, useEffect } from 'react'
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'

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
  firmName?: string
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
  firmName,
  onClick,
  status,
  getStatusColor
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<{ name: string; type: string; url: string } | null>(null)
  
  // Card carousel state
  const [cardApi, setCardApi] = useState<CarouselApi>()
  const [cardCurrent, setCardCurrent] = useState(0)

  // Format issue type for display
  const formatIssueType = (type: string) => {
    return type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  // Get display name
  const displayName = userName || userId || 'Anonymous'

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

  // Handle expand button click - opens the currently visible file in card carousel
  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    // Prevent multiple opens
    if (isModalOpen) return

    // Get files that can be previewed (images or PDFs)
    const previewableFiles = files.filter(file => isImage(file.type) || isPDF(file.type))
    
    if (previewableFiles.length > 0) {
      // Get the currently visible file from the card carousel
      const currentFile = previewableFiles[cardCurrent]
      setSelectedFile({
        name: currentFile.name,
        type: currentFile.type,
        url: currentFile.url
      })
      setIsModalOpen(true)
    } else if (files.length > 0) {
      // If no previewable files, just open first file
      setSelectedFile({
        name: files[0].name,
        type: files[0].type,
        url: files[0].url
      })
      setIsModalOpen(true)
    }
  }

  // Update card carousel current index
  useEffect(() => {
    if (!cardApi) return

    setCardCurrent(cardApi.selectedScrollSnap())

    cardApi.on('select', () => {
      setCardCurrent(cardApi.selectedScrollSnap())
    })
  }, [cardApi])

  return (
    <div
      className=' w-full p-4 sm:p-6 card-custom-grad rounded-md hover:opacity-90 transition-opacity relative'
    >
      {/* Preview Section with Carousel */}
      <figure className="relative w-full aspect-video max-h-[230px] lg:max-h-[200px] overflow-hidden">
        {(() => {
          // Filter files to only images and PDFs for preview
          const previewableFiles = files.filter(file => isImage(file.type) || isPDF(file.type))
          
          if (previewableFiles.length > 0) {
            return (
              <>
                <Carousel
                  setApi={setCardApi}
                  className="w-full h-full relative"
                  opts={{
                    loop: previewableFiles.length > 1,
                    align: 'start',
                    dragFree: false,
                  }}
                >
                  <CarouselContent className="ml-0 h-full">
                    {previewableFiles.map((file, index) => (
                      <CarouselItem key={index} className="pl-0 basis-full h-full">
                        <div className="relative w-full aspect-video">
                          {isImage(file.type) ? (
                            <Image
                              src={file.url}
                              alt="review"
                              fill
                              className='w-full h-full object-contain opacity-30'
                            />
                          ) : isPDF(file.type) ? (
                            <iframe
                              src={`${file.url}#toolbar=0&navpanes=0&scrollbar=0&zoom=page-fit`}
                              className='w-full h-full opacity-30 pointer-events-none'
                              title="PDF preview"
                            />
                          ) : null}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {previewableFiles.length > 1 && (
                    <>
                      <CarouselPrevious 
                        className="left-1 sm:left-2 h-6 w-6 sm:h-8 sm:w-8 bg-black/50 hover:bg-black/70 border-none text-white z-10"
                      />
                      <CarouselNext 
                        className="right-1 sm:right-2 h-6 w-6 sm:h-8 sm:w-8 bg-black/50 hover:bg-black/70 border-none text-white z-10"
                      />
                    </>
                  )}
                </Carousel>
                <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-black/30 to-transparent z-[1] pointer-events-none'></div>
              </>
            )
          }
          
          // Fallback: only show when no images or PDFs exist
          return (
            <>
              <Image
                src="/website/fallback-review-img.svg"
                alt="review"
                fill
                className='w-full h-full object-contain opacity-30'
              />
              <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-black/30 to-transparent z-[1]'></div>
            </>
          )
        })()}
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
      {status && <Badge className={cn("text-[8px] sm:text-[10px] font-semibold uppercase text-foreground px-4 py-1.5 absolute top-2 right-2 animate-pulse", statusColorClass)}>
        {status === 'pending' ? 'In Review' : status === 'approved' ? 'Posted' : 'Rejected'}
      </Badge>}
      {/* Content Section */}
      <div className='mt-6'>
        {/* Header - Issue Type and Username */}
        <div className='flex items-start gap-2 sm:gap-0 sm:items-center justify-between flex-wrap'>
          <div className='flex items-center gap-2'>
           
            <div className="text-[8px] sm:text-[10px] font-semibold uppercase text-foreground px-4 py-1.5 bg-white/10 rounded-full border border-border">
              ISSUE: {formatIssueType(issueType)}
            </div>
          </div>
          <div className="text-xs font-semibold text-primary py-1.5">
            @{displayName}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm font-geist-sans text-white/70 line-clamp-2 my-4">
          {description}
        </p>

        <div className='flex items-center justify-between gap-1 text-primary'>
          {/* Firm Name */}
          {firmName && (
            <div className='flex items-center gap-1 text-primary font-semibold'>
              <Building2 className='h-3 w-3 mb-px' />
              <p className='text-xs font-medium'>{firmName}</p>
            </div>
          )}

          <Button variant="outline" size="sm" className="text-primary font-semibold text-xs cursor-pointer" onClick={onClick}>
            Read Complaint
          </Button>
        </div>
      </div>

      {/* Attachment View Modal - Single File */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open)
          if (!open) {
            setSelectedFile(null)
          }
        }}
      >
        <DialogContent className="max-w-xs sm:max-w-4xl max-h-[90vh] p-0 border-none bg-background">
          <DialogHeader className="px-4 pt-4 pb-2">
            <DialogTitle className="text-sm font-medium text-foreground/80">
              {selectedFile && <span>{selectedFile.name}</span>}
            </DialogTitle>
          </DialogHeader>
          {selectedFile && (
            <div className="relative w-full">
              <div className="relative w-full h-[70vh] sm:h-[80vh] flex items-center justify-center bg-black/50">
                {isPDF(selectedFile.type) ? (
                  <div className="w-full h-full flex flex-col">
                    <iframe
                      src={`${selectedFile.url}#toolbar=0`}
                      className="w-full h-full border-none"
                      title={selectedFile.name}
                    />
                  </div>
                ) : isImage(selectedFile.type) ? (
                  <Image
                    src={selectedFile.url}
                    alt={selectedFile.name || 'Review attachment'}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 p-8">
                    <p className="text-foreground/60 text-sm">Preview not available</p>
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(selectedFile.url, '_blank', 'noopener,noreferrer')
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download File
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ReviewCard