"use client";

import React from 'react';
import { Users, MessageCircle, Star, TrendingUp, LucideIcon } from 'lucide-react';
import AnimatedSection from '@/components/website/AnimatedSection';
import { SupportReputationSection } from '@/types/firm-review';
import EditableField from '../EditableField';
import TiptapEditor from '../TiptapEditor';
import ArrayEditor from '../ArrayEditor';
import { iconMap } from '../IconSelector';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EditableBlogSupportReputationProps {
    supportReputation: SupportReputationSection;
    onUpdate: (supportReputation: SupportReputationSection) => void;
}

export default function EditableBlogSupportReputation({
    supportReputation,
    onUpdate,
}: EditableBlogSupportReputationProps) {
    if (!supportReputation) return null;

    const IconComponent = iconMap[supportReputation.icon] || Users;

    const handleTitleChange = (newTitle: string) => {
        onUpdate({ ...supportReputation, title: newTitle });
    };

    const handleResponseTimeChange = (newTime: string) => {
        onUpdate({
            ...supportReputation,
            supportQuality: {
                ...supportReputation.supportQuality,
                responseTime: newTime,
            },
        });
    };

    const handleSupportDescriptionChange = (newDescription: string) => {
        onUpdate({
            ...supportReputation,
            supportQuality: {
                ...supportReputation.supportQuality,
                description: newDescription,
            },
        });
    };

    const handleTrustpilotChange = (newRating: number) => {
        onUpdate({
            ...supportReputation,
            ratings: {
                ...supportReputation.ratings,
                trustpilot: newRating,
            },
        });
    };

    const handleCommunitySizeChange = (newSize: string) => {
        onUpdate({
            ...supportReputation,
            ratings: {
                ...supportReputation.ratings,
                communitySize: newSize,
            },
        });
    };

    const handleMostLovedChange = (newItems: string[]) => {
        onUpdate({ ...supportReputation, mostLoved: newItems });
    };

    const handleMostComplainedChange = (newItems: string[]) => {
        onUpdate({ ...supportReputation, mostComplained: newItems });
    };

    return (
        <AnimatedSection id="blog-support-reputation">
            <section id={supportReputation.id} className="mb-6">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <IconComponent className="h-8 w-8 text-primary" />
                        <div className="flex-1">
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">Title</label>
                            <EditableField
                                value={supportReputation.title}
                                onSave={handleTitleChange}
                                className="text-2xl sm:text-3xl font-bold text-foreground"
                                placeholder="Section Title"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="rounded-lg border border-border p-6 bg-gradient-to-br from-blue-500/5 to-transparent">
                        <h3 className="font-semibold text-foreground mb-3">Support Quality</h3>
                        <div className="space-y-4">
                            <div>
                                <Label className="text-xs text-muted-foreground mb-1 block">Response Time</Label>
                                <Input
                                    value={supportReputation.supportQuality.responseTime}
                                    onChange={(e) => handleResponseTimeChange(e.target.value)}
                                    placeholder="e.g., < 2 hours"
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground mb-1 block">Description</Label>
                                <TiptapEditor
                                    content={supportReputation.supportQuality.description}
                                    onChange={handleSupportDescriptionChange}
                                    placeholder="Describe support quality..."
                                    minHeight="100px"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-border p-6 bg-gradient-to-br from-yellow-500/5 to-transparent">
                        <h3 className="font-semibold text-foreground mb-3">Trustpilot Rating</h3>
                        <div>
                            <Label className="text-xs text-muted-foreground mb-1 block">Rating (0-5)</Label>
                            <Input
                                type="number"
                                value={supportReputation.ratings.trustpilot}
                                onChange={(e) => handleTrustpilotChange(parseFloat(e.target.value) || 0)}
                                placeholder="4.5"
                                min="0"
                                max="5"
                                step="0.1"
                            />
                        </div>
                    </div>

                    <div className="rounded-lg border border-border p-6 bg-gradient-to-br from-green-500/5 to-transparent">
                        <h3 className="font-semibold text-foreground mb-3">Community Size</h3>
                        <div>
                            <Label className="text-xs text-muted-foreground mb-1 block">Size</Label>
                            <Input
                                value={supportReputation.ratings.communitySize}
                                onChange={(e) => handleCommunitySizeChange(e.target.value)}
                                placeholder="e.g., 50,000+ traders"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label className="text-sm font-medium text-muted-foreground mb-2 block">Most Loved</Label>
                        <ArrayEditor
                            items={supportReputation.mostLoved || []}
                            onSave={handleMostLovedChange}
                            placeholder="Add item"
                            addButtonLabel="Add Item"
                        />
                    </div>
                    <div>
                        <Label className="text-sm font-medium text-muted-foreground mb-2 block">Most Complained About</Label>
                        <ArrayEditor
                            items={supportReputation.mostComplained || []}
                            onSave={handleMostComplainedChange}
                            placeholder="Add item"
                            addButtonLabel="Add Item"
                        />
                    </div>
                </div>
            </section>
        </AnimatedSection>
    );
}

