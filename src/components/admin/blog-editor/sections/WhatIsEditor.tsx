"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EditableText from '../EditableText';
import EditableTextarea from '../EditableTextarea';
import EditableArray from '../EditableArray';
import { Star, Search, Scale, BarChart3, TrendingUp, LucideIcon } from 'lucide-react';
import { FirmReview } from '@/types/firm-review';

const iconMap: Record<string, LucideIcon> = {
    Star,
    Search,
    Scale,
    BarChart3,
    TrendingUp,
};

interface WhatIsEditorProps {
    reviewData: FirmReview;
    onUpdate: (updates: Partial<FirmReview>) => void;
}

export default function WhatIsEditor({ reviewData, onUpdate }: WhatIsEditorProps) {
    return (
        <Card className="border-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {React.createElement(iconMap[reviewData.whatIs.icon] || Search, { className: "h-5 w-5" })}
                    <EditableText
                        value={reviewData.whatIs.title}
                        onSave={(newValue) => onUpdate({
                            whatIs: { ...reviewData.whatIs, title: newValue }
                        })}
                        className="text-xl font-semibold"
                    />
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Content</label>
                    <EditableTextarea
                        value={reviewData.whatIs.content}
                        onSave={(newValue) => onUpdate({
                            whatIs: { ...reviewData.whatIs, content: newValue }
                        })}
                    />
                </div>

                {reviewData.whatIs.highlights && (
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">
                            <EditableText
                                value={reviewData.whatIs.highlights.title}
                                onSave={(newValue) => onUpdate({
                                    whatIs: {
                                        ...reviewData.whatIs,
                                        highlights: {
                                            ...reviewData.whatIs.highlights!,
                                            title: newValue
                                        }
                                    }
                                })}
                                className="font-semibold"
                            />
                        </label>
                        <EditableArray
                            items={reviewData.whatIs.highlights.items}
                            onSave={(newItems) => onUpdate({
                                whatIs: {
                                    ...reviewData.whatIs,
                                    highlights: {
                                        ...reviewData.whatIs.highlights!,
                                        items: newItems
                                    }
                                }
                            })}
                            placeholder="Add highlight item"
                        />
                    </div>
                )}

                {reviewData.whatIs.conclusion && (
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Conclusion</label>
                        <EditableTextarea
                            value={reviewData.whatIs.conclusion}
                            onSave={(newValue) => onUpdate({
                                whatIs: { ...reviewData.whatIs, conclusion: newValue }
                            })}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

