"use client";

import React from 'react';
import { Search } from 'lucide-react';
import AnimatedSection from '@/components/website/AnimatedSection';
import { WhatIsSection } from '@/types/firm-review';
import EditableField from '../EditableField';
import { Textarea } from '@/components/ui/textarea';
import ArrayEditor from '../ArrayEditor';
import { iconMap } from '../IconSelector';

interface EditableBlogWhatIsProps {
    whatIs: WhatIsSection;
    onUpdate: (whatIs: WhatIsSection) => void;
    firmName?: string;
}

export default function EditableBlogWhatIs({ whatIs, onUpdate, firmName = '' }: EditableBlogWhatIsProps) {
    if (!whatIs) return null;

    const IconComponent = iconMap[whatIs.icon] || Search;

    // Replace [Firm Name] placeholder in title with actual firm name
    const displayTitle = firmName 
        ? whatIs.title.replace(/\[Firm Name\]/gi, firmName)
        : whatIs.title;

    const handleContentChange = (newContent: string) => {
        onUpdate({ ...whatIs, content: newContent });
    };

    const handleHighlightsTitleChange = (newTitle: string) => {
        onUpdate({
            ...whatIs,
            highlights: {
                ...whatIs.highlights!,
                title: newTitle,
            },
        });
    };

    const handleHighlightsItemsChange = (newItems: string[]) => {
        onUpdate({
            ...whatIs,
            highlights: {
                ...whatIs.highlights!,
                items: newItems,
            },
        });
    };

    const handleConclusionChange = (newConclusion: string) => {
        onUpdate({ ...whatIs, conclusion: newConclusion });
    };

    return (
        <AnimatedSection id="blog-what-is">
            <section id={whatIs.id} className="mb-12">
                <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                        <IconComponent className="h-6 sm:h-8 w-6 sm:w-8 text-primary" />
                        <div className="flex-1">
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">Title</label>
                            <div className="text-2xl sm:text-3xl font-bold text-foreground capitalize">
                                {displayTitle}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Content</label>
                        <Textarea
                            value={whatIs.content || ''}
                            onChange={(e) => handleContentChange(e.target.value)}
                            placeholder="Write the main content..."
                            className="min-h-[200px] w-full"
                        />
                    </div>

                    {whatIs.highlights && (
                        <div className="bg-accent/20 border border-accent/30 rounded-lg p-6 my-6">
                            <div className="mb-4">
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">Highlights Title</label>
                                <EditableField
                                    value={whatIs.highlights.title}
                                    onSave={handleHighlightsTitleChange}
                                    className="font-semibold text-foreground"
                                    placeholder="Highlights Title"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">Highlight Items</label>
                                <ArrayEditor
                                    items={whatIs.highlights.items}
                                    onSave={handleHighlightsItemsChange}
                                    placeholder="Add highlight item"
                                    addButtonLabel="Add Highlight"
                                />
                            </div>
                        </div>
                    )}

                    {whatIs.conclusion && (
                        <div>
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">Conclusion</label>
                            <Textarea
                                value={whatIs.conclusion || ''}
                                onChange={(e) => handleConclusionChange(e.target.value)}
                                placeholder="Write the conclusion..."
                                className="min-h-[150px] w-full"
                            />
                        </div>
                    )}
                </div>
            </section>
        </AnimatedSection>
    );
}

