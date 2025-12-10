"use client";

import React from 'react';
import { CheckCircle, XCircle, LucideIcon } from 'lucide-react';
import AnimatedSection from '@/components/website/AnimatedSection';
import { ProsConsSection } from '@/types/firm-review';
import EditableField from '../EditableField';
import ArrayEditor from '../ArrayEditor';
import { iconMap } from '../IconSelector';

interface EditableBlogProsConsProps {
    prosCons: ProsConsSection;
    onUpdate: (prosCons: ProsConsSection) => void;
}

export default function EditableBlogProsCons({ prosCons, onUpdate }: EditableBlogProsConsProps) {
    if (!prosCons) return null;

    const IconComponent = iconMap[prosCons.icon] || CheckCircle;

    const handleTitleChange = (newTitle: string) => {
        onUpdate({ ...prosCons, title: newTitle });
    };

    const handleProsChange = (newPros: string[]) => {
        onUpdate({ ...prosCons, pros: newPros });
    };

    const handleConsChange = (newCons: string[]) => {
        onUpdate({ ...prosCons, cons: newCons });
    };

    return (
        <AnimatedSection id="blog-pros-cons">
            <section id={prosCons.id} className="mb-12">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <IconComponent className="h-8 w-8 text-primary" />
                        <div className="flex-1">
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">Title</label>
                            <EditableField
                                value={prosCons.title}
                                onSave={handleTitleChange}
                                className="text-2xl sm:text-3xl font-bold text-foreground"
                                placeholder="Section Title"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-semibold text-foreground">Pros</h3>
                        </div>
                        <ArrayEditor
                            items={prosCons.pros || []}
                            onSave={handleProsChange}
                            placeholder="Add pro"
                            addButtonLabel="Add Pro"
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <XCircle className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-semibold text-foreground">Cons</h3>
                        </div>
                        <ArrayEditor
                            items={prosCons.cons || []}
                            onSave={handleConsChange}
                            placeholder="Add con"
                            addButtonLabel="Add Con"
                        />
                    </div>
                </div>
            </section>
        </AnimatedSection>
    );
}

