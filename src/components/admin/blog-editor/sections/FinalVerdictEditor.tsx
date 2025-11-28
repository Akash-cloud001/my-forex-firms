"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EditableText from '../EditableText';
import EditableTextarea from '../EditableTextarea';
import EditableProsCons from '../EditableProsCons';
import { Star, Search, Scale, BarChart3, TrendingUp, LucideIcon } from 'lucide-react';
import { FirmReview } from '@/types/firm-review';

const iconMap: Record<string, LucideIcon> = {
    Star,
    Search,
    Scale,
    BarChart3,
    TrendingUp,
};

interface FinalVerdictEditorProps {
    reviewData: FirmReview;
    onUpdate: (updates: Partial<FirmReview>) => void;
}

export default function FinalVerdictEditor({ reviewData, onUpdate }: FinalVerdictEditorProps) {
    return (
        <Card className="border-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {React.createElement(iconMap[reviewData.finalVerdict.icon] || Star, { className: "h-5 w-5" })}
                    <EditableText
                        value={reviewData.finalVerdict.title}
                        onSave={(newValue) => onUpdate({
                            finalVerdict: { ...reviewData.finalVerdict, title: newValue }
                        })}
                        className="text-xl font-semibold"
                    />
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Subtitle</label>
                    <EditableText
                        value={reviewData.finalVerdict.subtitle}
                        onSave={(newValue) => onUpdate({
                            finalVerdict: { ...reviewData.finalVerdict, subtitle: newValue }
                        })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Rating</label>
                        <EditableText
                            value={reviewData.finalVerdict.rating.toString()}
                            onSave={(newValue) => {
                                const num = parseFloat(newValue);
                                if (!isNaN(num)) onUpdate({
                                    finalVerdict: { ...reviewData.finalVerdict, rating: num }
                                });
                            }}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Rating Label</label>
                        <EditableText
                            value={reviewData.finalVerdict.ratingLabel}
                            onSave={(newValue) => onUpdate({
                                finalVerdict: { ...reviewData.finalVerdict, ratingLabel: newValue }
                            })}
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium text-muted-foreground mb-4 block">Strengths</label>
                    <EditableProsCons
                        items={reviewData.finalVerdict.strengths}
                        onSave={(newItems) => onUpdate({
                            finalVerdict: {
                                ...reviewData.finalVerdict,
                                strengths: newItems
                            }
                        })}
                        type="pros"
                    />
                </div>

                {reviewData.finalVerdict.weaknesses && (
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-4 block">Weaknesses</label>
                        <EditableProsCons
                            items={reviewData.finalVerdict.weaknesses}
                            onSave={(newItems) => onUpdate({
                                finalVerdict: {
                                    ...reviewData.finalVerdict,
                                    weaknesses: newItems
                                }
                            })}
                            type="cons"
                        />
                    </div>
                )}

                {reviewData.finalVerdict.recommendation && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">Recommendation Title</label>
                            <EditableText
                                value={reviewData.finalVerdict.recommendation.title}
                                onSave={(newValue) => onUpdate({
                                    finalVerdict: {
                                        ...reviewData.finalVerdict,
                                        recommendation: {
                                            ...reviewData.finalVerdict.recommendation,
                                            title: newValue
                                        }
                                    }
                                })}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">Recommendation Content</label>
                            <EditableTextarea
                                value={reviewData.finalVerdict.recommendation.content}
                                onSave={(newValue) => onUpdate({
                                    finalVerdict: {
                                        ...reviewData.finalVerdict,
                                        recommendation: {
                                            ...reviewData.finalVerdict.recommendation,
                                            content: newValue
                                        }
                                    }
                                })}
                            />
                        </div>
                        {reviewData.finalVerdict.recommendation.footer && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">Footer Text</label>
                                <EditableText
                                    value={reviewData.finalVerdict.recommendation.footer}
                                    onSave={(newValue) => onUpdate({
                                        finalVerdict: {
                                            ...reviewData.finalVerdict,
                                            recommendation: {
                                                ...reviewData.finalVerdict.recommendation,
                                                footer: newValue
                                            }
                                        }
                                    })}
                                />
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

