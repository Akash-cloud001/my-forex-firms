"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import AnimatedSection from '@/components/website/AnimatedSection';
import { OverviewSection } from '@/types/firm-review';
import { Star } from 'lucide-react';
import KeyValueEditor, { KeyValueItem } from '../KeyValueEditor';
import { iconMap } from '../IconSelector';

interface EditableBlogOverviewProps {
    overview: OverviewSection;
    onUpdate: (overview: OverviewSection) => void;
    firmName?: string;
}

export default function EditableBlogOverview({ overview, onUpdate, firmName }: EditableBlogOverviewProps) {
    const IconComponent = iconMap[overview?.icon] || Star;

    // Sync Firm Name in key-value pairs with firmName from Hero
    React.useEffect(() => {
        if (!overview || firmName === undefined || !firmName) return;

        let needsUpdate = false;
        const updatedLeft = [...overview.data.left];
        const updatedRight = [...overview.data.right];

        // Update Firm Name in left column
        const leftIndex = overview.data.left.findIndex(item => 
            item.label.toLowerCase().trim() === 'firm name' ||
            item.label.toLowerCase().trim().includes('firm name')
        );
        if (leftIndex !== -1 && updatedLeft[leftIndex].value !== firmName) {
            updatedLeft[leftIndex] = { ...updatedLeft[leftIndex], value: firmName };
            needsUpdate = true;
        }

        // Also check right column
        const rightIndex = overview.data.right.findIndex(item => 
            item.label.toLowerCase().trim() === 'firm name' ||
            item.label.toLowerCase().trim().includes('firm name')
        );
        if (rightIndex !== -1 && updatedRight[rightIndex].value !== firmName) {
            updatedRight[rightIndex] = { ...updatedRight[rightIndex], value: firmName };
            needsUpdate = true;
        }

        if (needsUpdate) {
            onUpdate({
                ...overview,
                data: {
                    ...overview.data,
                    left: updatedLeft,
                    right: updatedRight,
                },
            });
        }
    }, [firmName, overview, onUpdate]);

    if (!overview) return null;

    const handleLeftDataChange = (newItems: KeyValueItem[]) => {
        onUpdate({
            ...overview,
            data: {
                ...overview.data,
                left: newItems,
            },
        });
    };

    const handleRightDataChange = (newItems: KeyValueItem[]) => {
        onUpdate({
            ...overview,
            data: {
                ...overview.data,
                right: newItems,
            },
        });
    };

    return (
        <AnimatedSection id="blog-overview" delay={0.3}>
            <Card id="overview" className="mb-12 card-custom-grad border-border">
                <CardContent className="p-8">
                    <div className="space-y-6 mb-6">
                        <div className="flex items-center gap-3">
                            <IconComponent className="h-6 w-6 text-primary" />
                            <div className="flex-1">
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">Title</label>
                                <div className="text-2xl font-bold text-foreground capitalize">
                                    {overview.title}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">Left Column Data</label>
                                <KeyValueEditor
                                    items={overview.data.left}
                                    onSave={handleLeftDataChange}
                                    nonDeletableLabels={['Firm Name:', 'Founded:', 'Headquarters:', 'Max Funding:']}
                                    disabledValueLabels={['Firm Name:']}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">Right Column Data</label>
                                <KeyValueEditor
                                    items={overview.data.right}
                                    onSave={handleRightDataChange}
                                    nonDeletableLabels={['Profit Split:', 'Trust Score:', 'Funding Model:', 'Best For:']}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </AnimatedSection>
    );
}

