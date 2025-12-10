"use client";

import React from 'react';
import AnimatedSection from '@/components/website/AnimatedSection';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface EditableBlogIntroductionProps {
    introduction: string;
    onUpdate: (introduction: string) => void;
}

export default function EditableBlogIntroduction({ 
    introduction, 
    onUpdate 
}: EditableBlogIntroductionProps) {
    return (
        <AnimatedSection id="blog-introduction" delay={0.1}>
            <div className="prose prose-lg max-w-none mb-12">
                <div className="mb-2">
                    <Label className="text-sm font-medium text-muted-foreground">Introduction</Label>
                </div>
                <Textarea
                    value={introduction || ''}
                    onChange={(e) => onUpdate(e.target.value)}
                    placeholder="Write the introduction to your blog review..."
                    className="min-h-[150px] w-full text-foreground"
                />
            </div>
        </AnimatedSection>
    );
}

