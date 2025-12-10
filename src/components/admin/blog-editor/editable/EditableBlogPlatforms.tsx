"use client";

import React from 'react';
import { CheckCircle, TrendingUp, LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import AnimatedSection from '@/components/website/AnimatedSection';
import { PlatformsExecutionSection } from '@/types/firm-review';
import EditableField from '../EditableField';
import TiptapEditor from '../TiptapEditor';
import ArrayEditor from '../ArrayEditor';
import { iconMap } from '../IconSelector';

interface EditableBlogPlatformsProps {
    platformsExecution: PlatformsExecutionSection;
    onUpdate: (platformsExecution: PlatformsExecutionSection) => void;
}

export default function EditableBlogPlatforms({ platformsExecution, onUpdate }: EditableBlogPlatformsProps) {
    if (!platformsExecution) return null;

    const IconComponent = iconMap[platformsExecution.icon] || TrendingUp;

    const handleTitleChange = (newTitle: string) => {
        onUpdate({ ...platformsExecution, title: newTitle });
    };

    const handlePlatformsChange = (newPlatforms: string[]) => {
        onUpdate({ ...platformsExecution, platforms: newPlatforms });
    };

    const handleInstrumentsChange = (newInstruments: string[]) => {
        onUpdate({ ...platformsExecution, instruments: newInstruments });
    };

    const handleExecutionNotesChange = (newNotes: string) => {
        onUpdate({ ...platformsExecution, executionNotes: newNotes });
    };

    return (
        <AnimatedSection id="blog-platforms">
            <section id={platformsExecution.id} className="mb-12">
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <IconComponent className="h-8 w-8 text-primary" />
                        <div className="flex-1">
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">Title</label>
                            <EditableField
                                value={platformsExecution.title}
                                onSave={handleTitleChange}
                                className="text-2xl sm:text-3xl font-bold text-foreground capitalize"
                                placeholder="Section Title"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="card-custom-grad border-border">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-foreground mb-4 capitalize">Trading Platforms</h3>
                            <ArrayEditor
                                items={platformsExecution.platforms || []}
                                onSave={handlePlatformsChange}
                                placeholder="Add platform"
                                addButtonLabel="Add Platform"
                            />
                        </CardContent>
                    </Card>

                    <Card className="card-custom-grad border-border">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-foreground mb-4 capitalize">Available Instruments</h3>
                            <ArrayEditor
                                items={platformsExecution.instruments || []}
                                onSave={handleInstrumentsChange}
                                placeholder="Add instrument"
                                addButtonLabel="Add Instrument"
                            />
                        </CardContent>
                    </Card>
                </div>

                {platformsExecution.executionNotes && (
                    <div className="mt-6">
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Execution Notes</label>
                        <TiptapEditor
                            content={platformsExecution.executionNotes}
                            onChange={handleExecutionNotesChange}
                            placeholder="Add execution notes..."
                            minHeight="150px"
                        />
                    </div>
                )}
            </section>
        </AnimatedSection>
    );
}

