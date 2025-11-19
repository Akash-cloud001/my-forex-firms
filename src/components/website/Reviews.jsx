'use client';
import DomeReviews from './DomeReviews';
import { Suspense } from 'react';
export default function Reviews() {
  return (
    <div className='w-full h-[80vh] bg-background mt-16 mb-24 pb-24'>
        <p className="text-[32px] font-geist-sans font-semibold gradient-text mb-8 text-center">
            Reviews
        </p>
        <Suspense fallback={<div>Loading...</div>}>
            <DomeReviews/>
            {/* <DomeReviews fit='auto' minRadius={600}  segments={34} dragDampening={2} grayscale={false}/> */}
        </Suspense>
    </div>
  );
}