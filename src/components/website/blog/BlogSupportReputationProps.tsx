"use client";

import React from 'react';
import { Users, MessageCircle, Star, TrendingUp, LucideIcon } from 'lucide-react';
import AnimatedSection from '@/components/website/AnimatedSection';
import { SupportReputationSection } from '@/types/firm-review';

interface BlogSupportReputationProps {
    supportReputation: SupportReputationSection;
    iconMap: Record<string, LucideIcon>;
}

export default function BlogSupportReputation({ supportReputation, iconMap }: BlogSupportReputationProps) {
    if (!supportReputation) return null;

    const IconComponent = iconMap[supportReputation.icon] || Users;

    // Define card icons
    const cardIcons = {
        support: MessageCircle,
        trustpilot: Star,
        community: TrendingUp,
    };

    return (
        <AnimatedSection id="blog-support-reputation">
            <section id={supportReputation.id} className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
                    <IconComponent className="h-8 w-8 text-primary" />
                    {supportReputation.title}
                </h2>

                {/* Top Cards - Support Quality, Ratings, Community */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Support Quality Card */}
                    <div className="rounded-lg border border-border p-6 bg-gradient-to-br from-blue-500/5 to-transparent hover:border-blue-500/50 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-blue-500/20 rounded-lg">
                                <MessageCircle className="h-6 w-6 text-blue-400" />
                            </div>
                        </div>
                        <h3 className="font-semibold text-foreground mb-3">Support Quality</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            {supportReputation.supportQuality.description}
                        </p>
                        <div className="text-xs font-medium text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full w-fit">
                            {supportReputation.supportQuality.responseTime}
                        </div>
                    </div>

                    {/* Trustpilot Rating Card */}
                    <div className="rounded-lg border border-border p-6 bg-gradient-to-br from-yellow-500/5 to-transparent hover:border-yellow-500/50 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-yellow-500/20 rounded-lg">
                                <Star className="h-6 w-6 text-yellow-400" />
                            </div>
                        </div>
                        <h3 className="font-semibold text-foreground mb-3">Trustpilot Rating</h3>
                        <p className="text-xs text-muted-foreground mb-3">
                            Independent reviews from real users
                        </p>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-yellow-400">
                                {supportReputation.ratings.trustpilot}
                            </span>
                            <span className="text-xs text-muted-foreground mb-1">/5</span>
                        </div>
                    </div>

                    {/* Community Size Card */}
                    <div className="rounded-lg border border-border p-6 bg-gradient-to-br from-green-500/5 to-transparent hover:border-green-500/50 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-green-500/20 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-green-400" />
                            </div>
                        </div>
                        <h3 className="font-semibold text-foreground mb-3">Community Size</h3>
                        <p className="text-xs text-muted-foreground mb-3">
                            Active traders using this platform
                        </p>
                        <div className="text-2xl font-bold text-green-400">
                            {supportReputation.ratings.communitySize}
                        </div>
                    </div>
                </div>

                {/* Most Loved & Most Complained */}
                <div className="hidden grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Most Loved */}
                    {supportReputation.mostLoved && supportReputation.mostLoved.length > 0 && (
                        <div className="rounded-lg border border-green-500/30 p-6 bg-green-500/5">
                            <h3 className="font-semibold text-green-400 mb-4 flex items-center gap-2">
                                <Star className="h-5 w-5" />
                                Most Loved
                            </h3>
                            <ul className="space-y-3">
                                {supportReputation.mostLoved.map((item: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                                        <div className="h-2 w-2 rounded-full bg-green-400 mt-1.5 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Most Complained */}
                    {supportReputation.mostComplained && supportReputation.mostComplained.length > 0 && (
                        <div className="rounded-lg border border-red-500/30 p-6 bg-red-500/5">
                            <h3 className="font-semibold text-red-400 mb-4 flex items-center gap-2">
                                <MessageCircle className="h-5 w-5" />
                                Most Complained About
                            </h3>
                            <ul className="space-y-3">
                                {supportReputation.mostComplained.map((item: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                                        <div className="h-2 w-2 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                        {item}
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
