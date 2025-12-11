"use client";

import React from 'react';
import AnimatedSection from '@/components/website/AnimatedSection';

interface BlogIntroductionProps {
    introduction: string;
}

export default function BlogIntroduction({ introduction }: BlogIntroductionProps) {
    if (!introduction) return null;

    return (
        <AnimatedSection id="blog-introduction" threshold={0} delay={0.1}>
            <div className="prose prose-lg max-w-none mb-12">
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    {introduction}
                </p>
            </div>
        </AnimatedSection>
    );
}

