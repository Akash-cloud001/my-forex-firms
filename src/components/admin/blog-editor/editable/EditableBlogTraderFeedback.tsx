"use client";

import React from 'react';
import { MessageCircle, ThumbsUp, ThumbsDown, LucideIcon } from 'lucide-react';
import AnimatedSection from '@/components/website/AnimatedSection';
import { TraderFeedbackSection } from '@/types/firm-review';
import ArrayEditor from '../ArrayEditor';

interface EditableBlogTraderFeedbackProps {
    traderFeedback: TraderFeedbackSection;
    onUpdate: (traderFeedback: TraderFeedbackSection) => void;
}

export default function EditableBlogTraderFeedback({
    traderFeedback,
    onUpdate,
}: EditableBlogTraderFeedbackProps) {
    if (!traderFeedback) return null;

    const handlePraisedChange = (newItems: string[]) => {
        onUpdate({ ...traderFeedback, praised: newItems });
    };

    const handleComplaintsChange = (newItems: string[]) => {
        onUpdate({ ...traderFeedback, complaints: newItems });
    };

    return (
        <AnimatedSection id="blog-trader-feedback">
            <section id={traderFeedback.id} className="mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-lg border border-border p-8 bg-accent/5">
                        <div className="flex items-center gap-3 mb-6">
                            <ThumbsUp className="h-6 w-6 text-muted-foreground" />
                            <h3 className="font-semibold text-foreground text-lg">What Traders Praise</h3>
                        </div>
                        <ArrayEditor
                            items={traderFeedback.praised || []}
                            onSave={handlePraisedChange}
                            placeholder="Add praise item"
                            addButtonLabel="Add Praise"
                        />
                    </div>

                    <div className="rounded-lg border border-border p-8 bg-accent/5">
                        <div className="flex items-center gap-3 mb-6">
                            <ThumbsDown className="h-6 w-6 text-muted-foreground" />
                            <h3 className="font-semibold text-foreground text-lg">Common Complaints</h3>
                        </div>
                        <ArrayEditor
                            items={traderFeedback.complaints || []}
                            onSave={handleComplaintsChange}
                            placeholder="Add complaint"
                            addButtonLabel="Add Complaint"
                        />
                    </div>
                </div>
            </section>
        </AnimatedSection>
    );
}


