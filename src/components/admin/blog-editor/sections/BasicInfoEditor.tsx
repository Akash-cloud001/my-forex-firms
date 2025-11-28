"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EditableText from '../EditableText';
import EditableTextarea from '../EditableTextarea';
import { FirmReview } from '@/types/firm-review';

interface BasicInfoEditorProps {
    reviewData: FirmReview;
    onUpdate: (updates: Partial<FirmReview>) => void;
}

export default function BasicInfoEditor({ reviewData, onUpdate }: BasicInfoEditorProps) {
    return (
        <Card className="border-border">
            <CardHeader>
                <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Slug</label>
                    <div className="px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground">
                        {reviewData.slug}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Slug cannot be changed</p>
                </div>

                <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Firm Name</label>
                    <EditableText
                        value={reviewData.firmName}
                        onSave={(newValue) => onUpdate({ firmName: newValue })}
                        className="text-lg font-semibold"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Title</label>
                    <EditableText
                        value={reviewData.title}
                        onSave={(newValue) => onUpdate({ title: newValue })}
                        className="text-2xl font-bold"
                        as="h2"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Subtitle</label>
                    <EditableText
                        value={reviewData.subtitle}
                        onSave={(newValue) => onUpdate({ subtitle: newValue })}
                        className="text-lg"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Introduction</label>
                    <EditableTextarea
                        value={reviewData.introduction}
                        onSave={(newValue) => onUpdate({ introduction: newValue })}
                        className="text-base"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Published Date</label>
                        <EditableText
                            value={reviewData.publishedAt}
                            onSave={(newValue) => onUpdate({ publishedAt: newValue })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Read Time (minutes)</label>
                        <EditableText
                            value={reviewData.readTime.toString()}
                            onSave={(newValue) => {
                                const num = parseInt(newValue);
                                if (!isNaN(num)) onUpdate({ readTime: num });
                            }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Trust Score</label>
                        <EditableText
                            value={reviewData.trustScore.toString()}
                            onSave={(newValue) => {
                                const num = parseFloat(newValue);
                                if (!isNaN(num)) onUpdate({ trustScore: num });
                            }}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Rating</label>
                        <EditableText
                            value={reviewData.rating.toString()}
                            onSave={(newValue) => {
                                const num = parseFloat(newValue);
                                if (!isNaN(num)) onUpdate({ rating: num });
                            }}
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Rating Label</label>
                    <EditableText
                        value={reviewData.ratingLabel}
                        onSave={(newValue) => onUpdate({ ratingLabel: newValue })}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

