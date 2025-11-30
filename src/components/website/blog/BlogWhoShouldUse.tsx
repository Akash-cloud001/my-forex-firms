"use client";

import React from 'react';
import { Target, CheckCircle, XCircle, LucideIcon } from 'lucide-react';
import AnimatedSection from '@/components/website/AnimatedSection';
import { WhoShouldUseSection } from '@/types/firm-review';

interface BlogWhoShouldUseProps {
    whoShouldUse: WhoShouldUseSection;
    iconMap: Record<string, LucideIcon>;
}

export default function BlogWhoShouldUse({ whoShouldUse, iconMap }: BlogWhoShouldUseProps) {
    if (!whoShouldUse) return null;

    const IconComponent = iconMap[whoShouldUse.icon] || Target;

    return (
        <AnimatedSection id="blog-who-should-use">
            <section id={whoShouldUse.id} className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
                    <IconComponent className="h-8 w-8 text-primary" />
                    {whoShouldUse.title}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Perfect For */}
                    {whoShouldUse.perfectFor && whoShouldUse.perfectFor.length > 0 && (
                        <div className="rounded-lg border border-border p-8 bg-accent/5">
                            <div className="flex items-center gap-3 mb-6">
                                <CheckCircle className="h-6 w-6 text-muted-foreground" />
                                <h3 className="font-semibold text-foreground text-lg">Perfect For</h3>
                            </div>
                            <ul className="space-y-3">
                                {whoShouldUse.perfectFor.map((item: string, index: number) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-2 shrink-0" />
                                        <span className="text-sm text-foreground">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Not Ideal For */}
                    {whoShouldUse.notIdealFor && whoShouldUse.notIdealFor.length > 0 && (
                        <div className="rounded-lg border border-border p-8 bg-accent/5">
                            <div className="flex items-center gap-3 mb-6">
                                <XCircle className="h-6 w-6 text-muted-foreground" />
                                <h3 className="font-semibold text-foreground text-lg">Not Ideal For</h3>
                            </div>
                            <ul className="space-y-3">
                                {whoShouldUse.notIdealFor.map((item: string, index: number) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-2 shrink-0" />
                                        <span className="text-sm text-foreground">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </section>
        </AnimatedSection>
    );
}
