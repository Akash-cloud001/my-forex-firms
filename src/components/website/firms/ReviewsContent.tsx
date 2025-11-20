import React from 'react'
import ReviewCard from '@/components/ui/ReviewCard'

const ReviewsContent = () => {
  return (
    <section className='flex flex-wrap gap-4 justify-start items-center mt-8 border border-border rounded-sm p-8 bg-card'>
        <ReviewCard userName='Akash Parmar' issueType='user-complaints' description='I was facing issue Convert VehicleWithPosts to Vehicle by omitting the extra properties' files={[{ name: 'attachment.pdf', type: 'application/pdf', size: 100, url: 'https://www.google.com' }]} />
        <ReviewCard userId='123' issueType='payout-delays' description='I was facing issue Convert VehicleWithPosts to Vehicle by omitting the extra properties' files={[{ name: 'attachment.pdf', type: 'application/pdf', size: 100, url: 'https://www.google.com' }]} />
        <ReviewCard issueType='slippage-reports' description='I was facing issue Convert VehicleWithPosts to Vehicle by omitting the extra properties' files={[{ name: 'attachment.pdf', type: 'application/pdf', size: 100, url: 'https://www.google.com' }]} />
        <ReviewCard issueType='payout-denials' description='I was facing issue Convert VehicleWithPosts to Vehicle by omitting the extra properties' files={[{ name: 'attachment.pdf', type: 'application/pdf', size: 100, url: 'https://www.google.com' }]} />
        <ReviewCard issueType='poor-practices' description='I was facing issue Convert VehicleWithPosts to Vehicle by omitting the extra properties' files={[{ name: 'attachment.pdf', type: 'application/pdf', size: 100, url: 'https://www.google.com' }]} />
        <ReviewCard issueType='platform-instability' description='I was facing issue Convert VehicleWithPosts to Vehicle by omitting the extra properties' files={[{ name: 'attachment.pdf', type: 'application/pdf', size: 100, url: 'https://www.google.com' }]} />
    </section>
  )
}

export default ReviewsContent