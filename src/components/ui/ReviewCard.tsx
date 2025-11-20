import { Paperclip } from 'lucide-react'
import React from 'react'

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
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  issueType,
  customIssueType,
  description,
  files = [],
  userId,
  userName
}) => {
  // Format issue type for display


  // Get display name
  const displayName = userName || userId || 'Anonymous'

  // Format attachment text
  const attachmentCount = files?.length || 0
  const attachmentText = attachmentCount === 1 ? '1 attachment' : `${attachmentCount} attachments`

  return (
    <div className='border border-primary/60 rounded-sm w-[320px] aspect-square relative overflow-hidden flex flex-col '>
        <div className='flex items-center justify-between w-full p-5 bg-primary/80 font-geist-sans shrink-0'>
            <p className='text-white text-sm font-medium uppercase'>
                issueType
            </p>
            <p className='text-white text-sm font-medium'>
                @{displayName}
            </p>
        </div>
        <div className='p-5 font-geist-mono text-base font-light tracking-tight overflow-y-auto flex-1'>
            {description}
        </div>
        {attachmentCount > 0 && (
          <div className='flex items-center justify-end w-full p-5 shrink-0'>
              <Paperclip className='h-4 w-4 text-primary' />
              <p className='text-primary text-sm font-medium font-geist-sans ml-2'>
                  {attachmentText}
              </p>
          </div>
        )}
    </div>
  )
}

export default ReviewCard