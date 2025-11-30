"use client";

import React from 'react';
import { AlertTriangle, LucideIcon } from 'lucide-react';
import AnimatedSection from '@/components/website/AnimatedSection';
import { RedFlagsSection } from '@/types/firm-review';

interface BlogRedFlagsProps {
    redFlags: RedFlagsSection;
    iconMap: Record<string, LucideIcon>;
}

export default function BlogRedFlags({ redFlags, iconMap }: BlogRedFlagsProps) {
    if (!redFlags) return null;

    const IconComponent = iconMap[redFlags.icon] || AlertTriangle;

    return (
        <AnimatedSection id="blog-red-flags">
            <section id={redFlags.id} className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
                    <IconComponent className="h-8 w-8 text-primary" />
                    {redFlags.title}
                </h2>

                <div className="rounded-lg border border-border p-8 bg-accent/5">
                    {redFlags.items && redFlags.items.length > 0 ? (
                        <ul className="space-y-4">
                            {redFlags.items.map((item: string, index: number) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="h-2 w-2 rounded-full bg-muted-foreground mt-2 shrink-0" />
                                    <span className="text-sm text-foreground leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">
                            No major red flags identified for this firm.
                        </p>
                    )}
                </div>
            </section>
        </AnimatedSection>
    );
}
