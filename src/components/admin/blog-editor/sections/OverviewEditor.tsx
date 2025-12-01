"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EditableKeyValue, { KeyValueItem } from '../EditableKeyValue';
import EditableText from '../EditableText';
import { Star, Search, Scale, BarChart3, TrendingUp, LucideIcon } from 'lucide-react';
import { FirmReview } from '@/types/firm-review';

const iconMap: Record<string, LucideIcon> = {
    Star,
    Search,
    Scale,
    BarChart3,
    TrendingUp,
};

interface OverviewEditorProps {
    reviewData: FirmReview;
    onUpdate: (updates: Partial<FirmReview>) => void;
}

export default function OverviewEditor({ reviewData, onUpdate }: OverviewEditorProps) {
    const handleLeftDataUpdate = (newItems: KeyValueItem[]) => {
        onUpdate({
            overview: {
                ...reviewData.overview,
                data: {
                    ...reviewData.overview.data,
                    left: newItems,
                },
            },
        });
    };

    const handleRightDataUpdate = (newItems: KeyValueItem[]) => {
        onUpdate({
            overview: {
                ...reviewData.overview,
                data: {
                    ...reviewData.overview.data,
                    right: newItems,
                },
            },
        });
    };

    return (
        <Card className="border-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {React.createElement(iconMap[reviewData.overview.icon] || Star, { className: "h-5 w-5" })}
                    <EditableText
                        value={reviewData.overview.title}
                        onSave={(newValue) => onUpdate({
                            overview: { ...reviewData.overview, title: newValue }
                        })}
                        className="text-xl font-semibold"
                    />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-4 block">Left Column</label>
                        <EditableKeyValue
                            items={reviewData.overview.data.left}
                            onSave={handleLeftDataUpdate}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-4 block">Right Column</label>
                        <EditableKeyValue
                            items={reviewData.overview.data.right}
                            onSave={handleRightDataUpdate}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

