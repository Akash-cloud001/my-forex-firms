"use client";

import React from 'react';
import { CheckCircle, Search, LucideIcon } from 'lucide-react';
import AnimatedSection from '@/components/website/AnimatedSection';
import { WhatIsSection } from '@/types/firm-review';

interface BlogWhatIsProps {
    whatIs: WhatIsSection;
    iconMap: Record<string, LucideIcon>;
}

export default function BlogWhatIs({ whatIs, iconMap }: BlogWhatIsProps) {
    if (!whatIs) return null;

    const IconComponent = iconMap[whatIs.icon] || Search;

    return (
        <AnimatedSection id="blog-what-is">
            <section id={whatIs.id} className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <IconComponent className="h-6 sm:h-8 w-6 sm:w-8 text-primary" />
                    {whatIs.title}
                </h2>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                    <p className="mb-4">
                        {whatIs.content}
                    </p>

                    {whatIs.highlights && (
                        <div className="bg-accent/20 border border-accent/30 rounded-lg p-6 my-6">
                            <h4 className="font-semibold text-foreground mb-3">{whatIs.highlights.title}</h4>
                            <ul className="space-y-2">
                                {whatIs.highlights.items.map((item: string, index: number) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {whatIs.conclusion && (
                        <p>
                            {whatIs.conclusion}
                        </p>
                    )}
                </div>
            </section>
        </AnimatedSection>
    );
}

