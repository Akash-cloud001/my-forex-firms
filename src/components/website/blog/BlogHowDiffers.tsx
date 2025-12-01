"use client";

import React from 'react';
import { CheckCircle, XCircle, Scale, LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import AnimatedSection from '@/components/website/AnimatedSection';
import { HowDiffersSection } from '@/types/firm-review';

interface BlogHowDiffersProps {
    howDiffers: HowDiffersSection;
    iconMap: Record<string, LucideIcon>;
}

export default function BlogHowDiffers({ howDiffers, iconMap }: BlogHowDiffersProps) {
    if (!howDiffers) return null;

    const IconComponent = iconMap[howDiffers.icon] || Scale;

    return (
        <AnimatedSection id="blog-how-differs">
            <section id={howDiffers.id} className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 flex items-center gap-3 capitalize">
                    <IconComponent className="h-8 w-8 text-primary" />
                    {howDiffers.title}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {howDiffers.advantages && howDiffers.advantages.length > 0 && (
                        <Card className="border-green-500/20 bg-green-500/5">
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-green-400 mb-4 flex items-center gap-2 capitalize">
                                    <CheckCircle className="h-5 w-5" />
                                    Advantages
                                </h3>
                                <ul className="space-y-3">
                                    {howDiffers.advantages.map((item, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                                            <div>
                                                <strong>{item.title}</strong>
                                                {item.description && (
                                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    {howDiffers.limitations && howDiffers.limitations.length > 0 && (
                        <Card className="border-red-500/20 bg-red-500/5">
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-red-500 mb-4 flex items-center gap-2">
                                    <XCircle className="h-5 w-5" />
                                    Limitations
                                </h3>
                                <ul className="space-y-3">
                                    {howDiffers.limitations.map((item, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                            <div>
                                                <strong>{item.title}</strong>
                                                {item.description && (
                                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>
        </AnimatedSection>
    );
}

