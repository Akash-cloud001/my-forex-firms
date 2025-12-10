"use client"
import React, { Suspense } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { ReviewForm } from '@/components/website/post-review'

const ReviewPageContent: React.FC = () => {
  const searchParams = useSearchParams()
  const firmId = searchParams.get('firmId')

  return (
    <div className="min-h-screen pt-24 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="col-span-1">
        <div className="text-center flex flex-col items-center justify-center gap-4 lg:sticky lg:top-20">
          <Image
            src="/website/review.svg"
            alt="review"
            width={500}
            height={500}
            className='hidden md:block opacity-20 max-w-full h-auto'
          />
          <h1 className="text-4xl font-geist-sans opacity-50 font-bold text-foreground -mt-12">
            Submit Your Review
          </h1>
        </div>
      </div>

      <div className="col-span-1 px-4">
        <ReviewForm initialFirmId={firmId ?? undefined} />
      </div>
    </div>
  )
}

const ReviewPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReviewPageContent />
    </Suspense>
  )
}

export default ReviewPage