"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import AnimatedSection from '@/components/website/AnimatedSection';
import { OverviewSection } from '@/types/firm-review';
import { Star, LucideIcon } from 'lucide-react';

interface BlogOverviewProps {
    overview: OverviewSection;
    iconMap: Record<string, LucideIcon>;
}

export default function BlogOverview({ overview, iconMap }: BlogOverviewProps) {
    if (!overview) return null;

    const IconComponent = iconMap[overview.icon] || Star;

    return (
        <AnimatedSection id="blog-overview" delay={0.3}>
            <Card id="overview" className="mb-12 card-custom-grad border-border">
                <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <IconComponent className="h-6 w-6 text-primary" />
                        <h2 className="text-2xl font-bold text-foreground">{overview.title}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            {overview.data.left.map((item, index) => (
                                <div key={index} className="flex justify-between items-center py-2 border-b border-border/50">
                                    <span className="text-muted-foreground">{item.label}</span>
                                    <span className={`text-right font-semibold ${item.highlight ? 'text-primary' : 'text-foreground'}`}>
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            {overview.data.right.map((item, index) => (
                                <div key={index} className="flex justify-between items-center py-2 border-b border-border/50">
                                    <span className="text-muted-foreground">{item.label}</span>
                                    <span className={`text-right font-semibold ${
                                        item.highlight === 'success' ? 'text-green-400' : 
                                        item.highlight ? 'text-primary' : 
                                        'text-foreground'
                                    }`}>
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </AnimatedSection>
    );
}

