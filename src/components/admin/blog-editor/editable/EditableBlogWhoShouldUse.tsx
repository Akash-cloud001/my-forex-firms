"use client";

import React from 'react';
import { Target, CheckCircle, XCircle, LucideIcon } from 'lucide-react';
import AnimatedSection from '@/components/website/AnimatedSection';
import { WhoShouldUseSection } from '@/types/firm-review';
import EditableField from '../EditableField';
import ArrayEditor from '../ArrayEditor';
import { iconMap } from '../IconSelector';

interface EditableBlogWhoShouldUseProps {
    whoShouldUse: WhoShouldUseSection;
    onUpdate: (whoShouldUse: WhoShouldUseSection) => void;
}

export default function EditableBlogWhoShouldUse({ whoShouldUse, onUpdate }: EditableBlogWhoShouldUseProps) {
    if (!whoShouldUse) return null;

    const IconComponent = iconMap[whoShouldUse.icon] || Target;

    const handleTitleChange = (newTitle: string) => {
        onUpdate({ ...whoShouldUse, title: newTitle });
    };

    const handlePerfectForChange = (newItems: string[]) => {
        onUpdate({ ...whoShouldUse, perfectFor: newItems });
    };

    const handleNotIdealForChange = (newItems: string[]) => {
        onUpdate({ ...whoShouldUse, notIdealFor: newItems });
    };

    return (
        <AnimatedSection id="blog-who-should-use">
            <section id={whoShouldUse.id} className="mb-12">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <IconComponent className="h-8 w-8 text-primary" />
                        <div className="flex-1">
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">Title</label>
                            <EditableField
                                value={whoShouldUse.title}
                                onSave={handleTitleChange}
                                className="text-2xl sm:text-3xl font-bold text-foreground capitalize"
                                placeholder="Section Title"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-lg border border-border p-8 bg-accent/5">
                        <div className="flex items-center gap-3 mb-6">
                            <CheckCircle className="h-6 w-6 text-muted-foreground" />
                            <h3 className="font-semibold text-foreground text-lg">Perfect For</h3>
                        </div>
                        <ArrayEditor
                            items={whoShouldUse.perfectFor || []}
                            onSave={handlePerfectForChange}
                            placeholder="Add item"
                            addButtonLabel="Add Item"
                        />
                    </div>

                    <div className="rounded-lg border border-border p-8 bg-accent/5">
                        <div className="flex items-center gap-3 mb-6">
                            <XCircle className="h-6 w-6 text-muted-foreground" />
                            <h3 className="font-semibold text-foreground text-lg">Not Ideal For</h3>
                        </div>
                        <ArrayEditor
                            items={whoShouldUse.notIdealFor || []}
                            onSave={handleNotIdealForChange}
                            placeholder="Add item"
                            addButtonLabel="Add Item"
                        />
                    </div>
                </div>
            </section>
        </AnimatedSection>
    );
}

