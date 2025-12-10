"use client";

import React from 'react';
import { CheckCircle, XCircle, Scale, LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import AnimatedSection from '@/components/website/AnimatedSection';
import { HowDiffersSection, ProsConsItem } from '@/types/firm-review';
import EditableField from '../EditableField';
import TiptapEditor from '../TiptapEditor';
import { iconMap } from '../IconSelector';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditableBlogHowDiffersProps {
    howDiffers: HowDiffersSection;
    onUpdate: (howDiffers: HowDiffersSection) => void;
}

export default function EditableBlogHowDiffers({ howDiffers, onUpdate }: EditableBlogHowDiffersProps) {
    if (!howDiffers) return null;

    const IconComponent = iconMap[howDiffers.icon] || Scale;

    const handleTitleChange = (newTitle: string) => {
        onUpdate({ ...howDiffers, title: newTitle });
    };

    const handleAdvantageChange = (index: number, field: 'title' | 'description', value: string) => {
        const updated = [...howDiffers.advantages];
        updated[index] = { ...updated[index], [field]: value };
        onUpdate({ ...howDiffers, advantages: updated });
    };

    const handleLimitationChange = (index: number, field: 'title' | 'description', value: string) => {
        const updated = [...howDiffers.limitations];
        updated[index] = { ...updated[index], [field]: value };
        onUpdate({ ...howDiffers, limitations: updated });
    };

    const handleAddAdvantage = () => {
        onUpdate({
            ...howDiffers,
            advantages: [...howDiffers.advantages, { title: 'New Advantage', description: '' }],
        });
    };

    const handleAddLimitation = () => {
        onUpdate({
            ...howDiffers,
            limitations: [...howDiffers.limitations, { title: 'New Limitation', description: '' }],
        });
    };

    const handleRemoveAdvantage = (index: number) => {
        onUpdate({
            ...howDiffers,
            advantages: howDiffers.advantages.filter((_, i) => i !== index),
        });
    };

    const handleRemoveLimitation = (index: number) => {
        onUpdate({
            ...howDiffers,
            limitations: howDiffers.limitations.filter((_, i) => i !== index),
        });
    };

    return (
        <AnimatedSection id="blog-how-differs">
            <section id={howDiffers.id} className="mb-12">
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <IconComponent className="h-8 w-8 text-primary" />
                        <div className="flex-1">
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">Title</label>
                            <EditableField
                                value={howDiffers.title}
                                onSave={handleTitleChange}
                                className="text-2xl sm:text-3xl font-bold text-foreground capitalize"
                                placeholder="Section Title"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-green-500/20 bg-green-500/5">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-green-400 flex items-center gap-2 capitalize">
                                    <CheckCircle className="h-5 w-5" />
                                    Advantages
                                </h3>
                                <Button size="sm" variant="outline" onClick={handleAddAdvantage}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add
                                </Button>
                            </div>
                            <ul className="space-y-3">
                                {howDiffers.advantages.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2 group">
                                        <CheckCircle className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                                        <div className="flex-1 space-y-2">
                                            <EditableField
                                                value={item.title}
                                                onSave={(newValue) => handleAdvantageChange(index, 'title', newValue)}
                                                className="font-semibold"
                                                placeholder="Advantage title"
                                            />
                                            <div>
                                                <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                                                <TiptapEditor
                                                    content={item.description || ''}
                                                    onChange={(newValue) => handleAdvantageChange(index, 'description', newValue)}
                                                    placeholder="Add description..."
                                                    minHeight="100px"
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleRemoveAdvantage(index)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0 text-red-500"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-red-500/20 bg-red-500/5">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-red-500 flex items-center gap-2">
                                    <XCircle className="h-5 w-5" />
                                    Limitations
                                </h3>
                                <Button size="sm" variant="outline" onClick={handleAddLimitation}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add
                                </Button>
                            </div>
                            <ul className="space-y-3">
                                {howDiffers.limitations.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2 group">
                                        <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                        <div className="flex-1 space-y-2">
                                            <EditableField
                                                value={item.title}
                                                onSave={(newValue) => handleLimitationChange(index, 'title', newValue)}
                                                className="font-semibold"
                                                placeholder="Limitation title"
                                            />
                                            <div>
                                                <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                                                <TiptapEditor
                                                    content={item.description || ''}
                                                    onChange={(newValue) => handleLimitationChange(index, 'description', newValue)}
                                                    placeholder="Add description..."
                                                    minHeight="100px"
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleRemoveLimitation(index)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0 text-red-500"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </AnimatedSection>
    );
}

