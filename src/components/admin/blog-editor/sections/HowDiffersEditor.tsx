"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EditableText from '../EditableText';
import { Star, Search, Scale, BarChart3, TrendingUp, LucideIcon } from 'lucide-react';
import { FirmReview } from '@/types/firm-review';
import EditableProsCons from '../EditableProsCons';

const iconMap: Record<string, LucideIcon> = {
    Star,
    Search,
    Scale,
    BarChart3,
    TrendingUp,
};

interface HowDiffersEditorProps {
    reviewData: FirmReview;
    onUpdate: (updates: Partial<FirmReview>) => void;
}

export default function HowDiffersEditor({ reviewData, onUpdate }: HowDiffersEditorProps) {
    return (
        <Card className="border-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {React.createElement(iconMap[reviewData.howDiffers.icon] || Scale, { className: "h-5 w-5" })}
                    <EditableText
                        value={reviewData.howDiffers.title}
                        onSave={(newValue) => onUpdate({
                            howDiffers: { ...reviewData.howDiffers, title: newValue }
                        })}
                        className="text-xl font-semibold"
                    />
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-4 block">Advantages</label>
                        <EditableProsCons
                            items={reviewData.howDiffers.advantages}
                            onSave={(newItems) => onUpdate({
                                howDiffers: {
                                    ...reviewData.howDiffers,
                                    advantages: newItems
                                }
                            })}
                            type="pros"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-4 block">Limitations</label>
                        <EditableProsCons
                            items={reviewData.howDiffers.limitations}
                            onSave={(newItems) => onUpdate({
                                howDiffers: {
                                    ...reviewData.howDiffers,
                                    limitations: newItems
                                }
                            })}
                            type="cons"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

