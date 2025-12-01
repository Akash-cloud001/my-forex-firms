"use client";

import React from 'react';
import { CheckCircle, TrendingUp, LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import AnimatedSection from '@/components/website/AnimatedSection';
import { PlatformsExecutionSection } from '@/types/firm-review';

interface BlogPlatformsProps {
    platformsExecution: PlatformsExecutionSection;
    iconMap: Record<string, LucideIcon>;
}

export default function BlogPlatforms({ platformsExecution, iconMap }: BlogPlatformsProps) {
    if (!platformsExecution) return null;

    const IconComponent = iconMap[platformsExecution.icon] || TrendingUp;

    return (
        <AnimatedSection id="blog-platforms">
            <section id={platformsExecution.id} className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 flex items-center gap-3 capitalize">
                    <IconComponent className="h-8 w-8 text-primary" />
                    {platformsExecution.title}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {platformsExecution.platforms && platformsExecution.platforms.length > 0 && (
                        <Card className="card-custom-grad border-border">
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-foreground mb-4 capitalize">Trading Platforms</h3>
                                <ul className="space-y-2">
                                    {platformsExecution.platforms.map((platform: string, index: number) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                            {platform}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    {platformsExecution.instruments && platformsExecution.instruments.length > 0 && (
                        <Card className="card-custom-grad border-border">
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-foreground mb-4 capitalize">Available Instruments</h3>
                                <ul className="space-y-2">
                                    {platformsExecution.instruments.map((instrument: string, index: number) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                            {instrument}
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

