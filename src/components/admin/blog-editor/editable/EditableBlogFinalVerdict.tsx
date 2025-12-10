"use client";

import React from 'react';
import { Star, CheckCircle, XCircle, LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import AnimatedSection from '@/components/website/AnimatedSection';
import { FinalVerdictSection, VerdictStrength } from '@/types/firm-review';
import EditableField from '../EditableField';
import TiptapEditor from '../TiptapEditor';
import { iconMap } from '../IconSelector';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface EditableBlogFinalVerdictProps {
    finalVerdict: FinalVerdictSection;
    firmName: string;
    trustScore: number;
    onUpdate: (finalVerdict: FinalVerdictSection) => void;
}

export default function EditableBlogFinalVerdict({
    finalVerdict,
    firmName,
    trustScore,
    onUpdate,
}: EditableBlogFinalVerdictProps) {
    if (!finalVerdict) return null;

    const IconComponent = iconMap[finalVerdict.icon] || Star;

    const handleFieldChange = (field: keyof FinalVerdictSection, value: string | number) => {
        onUpdate({ ...finalVerdict, [field]: value } as FinalVerdictSection);
    };

    const handleStrengthChange = (index: number, field: 'title' | 'description', value: string) => {
        const updated = [...finalVerdict.strengths];
        updated[index] = { ...updated[index], [field]: value };
        onUpdate({ ...finalVerdict, strengths: updated });
    };

    const handleWeaknessChange = (index: number, field: 'title' | 'description', value: string) => {
        const updated = [...(finalVerdict.weaknesses || [])];
        updated[index] = { ...updated[index], [field]: value };
        onUpdate({ ...finalVerdict, weaknesses: updated });
    };

    const handleAddStrength = () => {
        onUpdate({
            ...finalVerdict,
            strengths: [...finalVerdict.strengths, { title: 'New Strength', description: '' }],
        });
    };

    const handleAddWeakness = () => {
        onUpdate({
            ...finalVerdict,
            weaknesses: [...(finalVerdict.weaknesses || []), { title: 'New Weakness', description: '' }],
        });
    };

    const handleRemoveStrength = (index: number) => {
        onUpdate({
            ...finalVerdict,
            strengths: finalVerdict.strengths.filter((_, i) => i !== index),
        });
    };

    const handleRemoveWeakness = (index: number) => {
        onUpdate({
            ...finalVerdict,
            weaknesses: (finalVerdict.weaknesses || []).filter((_, i) => i !== index),
        });
    };

    const handleRecommendationChange = (field: 'title' | 'content' | 'footer', value: string) => {
        onUpdate({
            ...finalVerdict,
            recommendation: {
                ...finalVerdict.recommendation,
                [field]: value,
            },
        });
    };

    return (
        <AnimatedSection id="blog-final-verdict">
            <section id={finalVerdict.id} className="mb-12">
                <Card className="relative overflow-hidden border border-white/10 bg-linear-to-br from-black/80 via-neutral-900/80 to-black/70">
                    <CardContent className="relative p-8 z-10">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 border border-primary/30 mb-4">
                                <IconComponent className="h-10 w-10 text-primary fill-current" />
                            </div>
                            <div className="space-y-4 mb-4">
                                <div>
                                    <Label className="text-white/60 text-sm mb-2 block">Title</Label>
                                    <EditableField
                                        value={finalVerdict.title}
                                        onSave={(newValue) => handleFieldChange('title', newValue)}
                                        className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text"
                                        placeholder="Final Verdict Title"
                                    />
                                </div>
                                <div>
                                    <Label className="text-white/60 text-sm mb-2 block">Subtitle</Label>
                                    <EditableField
                                        value={finalVerdict.subtitle}
                                        onSave={(newValue) => handleFieldChange('subtitle', newValue)}
                                        className="text-white/60 text-base sm:text-lg"
                                        placeholder="Subtitle"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-white/60 text-sm mb-2 block">Rating (0-5)</Label>
                                        <Input
                                            type="number"
                                            value={finalVerdict.rating}
                                            onChange={(e) => handleFieldChange('rating', parseFloat(e.target.value) || 0)}
                                            className="bg-white/10 border-white/20 text-white"
                                            min="0"
                                            max="5"
                                            step="0.1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-white/60 text-sm mb-2 block">Rating Label</Label>
                                        <Input
                                            value={finalVerdict.ratingLabel}
                                            onChange={(e) => handleFieldChange('ratingLabel', e.target.value)}
                                            className="bg-white/10 border-white/20 text-white"
                                            placeholder="e.g., Excellent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {finalVerdict.strengths && finalVerdict.strengths.length > 0 && (
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg sm:text-xl font-semibold text-white text-center">
                                        Why <span className="uppercase text-primary">{firmName}</span> Stands Out
                                    </h3>
                                    <Button size="sm" variant="outline" onClick={handleAddStrength}>
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {finalVerdict.strengths.map((strength, index) => (
                                        <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 group">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                                </div>
                                                <EditableField
                                                    value={strength.title}
                                                    onSave={(newValue) => handleStrengthChange(index, 'title', newValue)}
                                                    className="font-medium text-white flex-1"
                                                    placeholder="Strength title"
                                                />
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleRemoveStrength(index)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0 text-red-500"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <div>
                                                <Label className="text-xs text-white/60 mb-1 block">Description</Label>
                                                <TiptapEditor
                                                    content={strength.description}
                                                    onChange={(newValue) => handleStrengthChange(index, 'description', newValue)}
                                                    placeholder="Add description..."
                                                    minHeight="80px"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {finalVerdict.weaknesses && finalVerdict.weaknesses.length > 0 && (
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg sm:text-xl font-semibold text-white text-center">Areas for Improvement</h3>
                                    <Button size="sm" variant="outline" onClick={handleAddWeakness}>
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {finalVerdict.weaknesses.map((weakness, index) => (
                                        <div key={index} className="bg-white/5 backdrop-blur-sm border border-red-500/20 rounded-xl p-4 group">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                                    <XCircle className="h-4 w-4 text-red-400" />
                                                </div>
                                                <EditableField
                                                    value={weakness.title}
                                                    onSave={(newValue) => handleWeaknessChange(index, 'title', newValue)}
                                                    className="font-medium text-white flex-1"
                                                    placeholder="Weakness title"
                                                />
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleRemoveWeakness(index)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0 text-red-500"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <div>
                                                <Label className="text-xs text-white/60 mb-1 block">Description</Label>
                                                <TiptapEditor
                                                    content={weakness.description}
                                                    onChange={(newValue) => handleWeaknessChange(index, 'description', newValue)}
                                                    placeholder="Add description..."
                                                    minHeight="80px"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {finalVerdict.recommendation && (
                            <div className="bg-linear-to-r from-green-500/10 via-green-500/5 to-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center">
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-white/60 text-sm mb-2 block">Recommendation Title</Label>
                                        <EditableField
                                            value={finalVerdict.recommendation.title}
                                            onSave={(newValue) => handleRecommendationChange('title', newValue)}
                                            className="text-lg sm:text-xl font-semibold text-green-400"
                                            placeholder="Recommendation title"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-white/60 text-sm mb-2 block">Recommendation Content</Label>
                                        <TiptapEditor
                                            content={finalVerdict.recommendation.content}
                                            onChange={(newValue) => handleRecommendationChange('content', newValue)}
                                            placeholder="Write recommendation..."
                                            minHeight="150px"
                                        />
                                    </div>
                                    {finalVerdict.recommendation.footer && (
                                        <div>
                                            <Label className="text-white/60 text-sm mb-2 block">Footer</Label>
                                            <Input
                                                value={finalVerdict.recommendation.footer}
                                                onChange={(e) => handleRecommendationChange('footer', e.target.value)}
                                                className="bg-white/10 border-white/20 text-white"
                                                placeholder="Footer text"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>
        </AnimatedSection>
    );
}

