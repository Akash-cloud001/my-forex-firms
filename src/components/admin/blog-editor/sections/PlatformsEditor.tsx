"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EditableText from '../EditableText';
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

interface PlatformsEditorProps {
    reviewData: FirmReview;
    onUpdate: (updates: Partial<FirmReview>) => void;
}

export default function PlatformsEditor({ reviewData, onUpdate }: PlatformsEditorProps) {
    return (
        <Card className="border-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {React.createElement(iconMap[reviewData.platformsExecution.icon] || TrendingUp, { className: "h-5 w-5" })}
                    <EditableText
                        value={reviewData.platformsExecution.title}
                        onSave={(newValue) => onUpdate({
                            platformsExecution: { ...reviewData.platformsExecution, title: newValue }
                        })}
                        className="text-xl font-semibold"
                    />
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-4 block">Trading Platforms</label>
                        <EditableArray
                            items={reviewData.platformsExecution.platforms}
                            onSave={(newItems) => onUpdate({
                                platformsExecution: {
                                    ...reviewData.platformsExecution,
                                    platforms: newItems
                                }
                            })}
                            placeholder="Add platform"
                            addButtonLabel="Add Platform"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-4 block">Available Instruments</label>
                        <EditableArray
                            items={reviewData.platformsExecution.instruments}
                            onSave={(newItems) => onUpdate({
                                platformsExecution: {
                                    ...reviewData.platformsExecution,
                                    instruments: newItems
                                }
                            })}
                            placeholder="Add instrument"
                            addButtonLabel="Add Instrument"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

