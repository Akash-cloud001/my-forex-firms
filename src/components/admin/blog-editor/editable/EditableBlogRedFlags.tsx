"use client";

import React from 'react';
import { AlertTriangle, LucideIcon } from 'lucide-react';
import AnimatedSection from '@/components/website/AnimatedSection';
import { RedFlagsSection } from '@/types/firm-review';
import EditableField from '../EditableField';
import ArrayEditor from '../ArrayEditor';
import { iconMap } from '../IconSelector';

interface EditableBlogRedFlagsProps {
    redFlags: RedFlagsSection;
    onUpdate: (redFlags: RedFlagsSection) => void;
}

export default function EditableBlogRedFlags({ redFlags, onUpdate }: EditableBlogRedFlagsProps) {
    if (!redFlags) return null;

    const IconComponent = iconMap[redFlags.icon] || AlertTriangle;

    const handleTitleChange = (newTitle: string) => {
        onUpdate({ ...redFlags, title: newTitle });
    };

    const handleItemsChange = (newItems: string[]) => {
        onUpdate({ ...redFlags, items: newItems });
    };

    return (
        <AnimatedSection id="blog-red-flags">
            <section id={redFlags.id} className="mb-12">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <IconComponent className="h-8 w-8 text-primary" />
                        <div className="flex-1">
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">Title</label>
                            <EditableField
                                value={redFlags.title}
                                onSave={handleTitleChange}
                                className="text-2xl sm:text-3xl font-bold text-foreground"
                                placeholder="Section Title"
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-border p-8 bg-accent/5">
                    <ArrayEditor
                        items={redFlags.items || []}
                        onSave={handleItemsChange}
                        placeholder="Add red flag"
                        addButtonLabel="Add Red Flag"
                    />
                </div>
            </section>
        </AnimatedSection>
    );
}

