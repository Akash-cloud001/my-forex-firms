"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import AnimatedSection from '@/components/website/AnimatedSection';
import { FirmReview } from '@/types/firm-review';

interface BlogHeroProps {
    reviewData: FirmReview;
}

export default function BlogHero({ reviewData }: BlogHeroProps) {
    const handleShare = async () => {
        console.log('Sharing blog...');
        try {
            const url = window.location.href;
            await navigator.clipboard.writeText(url);
            toast.success('Blog URL copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy URL:', error);
            toast.error('Failed to copy URL. Please try again.');
        }
    };

    return (
        <AnimatedSection id="blog-hero">
            <section className="relative overflow-hidden max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="w-full">
                    <div className="flex items-center justify-between mb-8">
                        <Button
                            asChild
                            variant="link"
                            className="text-white/80 hover:text-white hover:bg-white/10"
                        >
                            <Link href="/blogs" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Blogs
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleShare}
                            className="text-primary/90 font-medium hover:text-primary transition-all duration-300"
                        >
                            <Share2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Share</span>
                        </Button>
                    </div>
                    <div className="">
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight capitalize">
                            {reviewData?.title || 'Loading...'}
                        </h1>
                        <p className="text-lg sm:text-xl text-white/80 max-w-3xl font-light capitalize">
                            {reviewData?.subtitle || ''}
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-white/60 pt-5">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{reviewData?.publishedAt || ''}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{reviewData?.readTime || 0} min read</span>
                        </div>
                    </div>
                    {/* <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-semibold text-foreground">Trust Score: {reviewData?.trustScore || 0}/10</span>
                    </div> */}
                </div>
            </section>
        </AnimatedSection>
    );
}

