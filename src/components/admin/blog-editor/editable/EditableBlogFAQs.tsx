"use client";

import React from 'react';
import AnimatedSection from '@/components/website/AnimatedSection';
import { FaqItem } from '@/types/firm-review';
import { CustomAccordion } from '@/components/ui/custom-accordion';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TiptapEditor from '../TiptapEditor';

interface EditableBlogFAQsProps {
    faqs: FaqItem[];
    onUpdate: (faqs: FaqItem[]) => void;
}

export default function EditableBlogFAQs({ faqs, onUpdate }: EditableBlogFAQsProps) {
    const handleQuestionChange = (index: number, newQuestion: string) => {
        const updated = [...faqs];
        updated[index] = { ...updated[index], question: newQuestion };
        onUpdate(updated);
    };

    const handleAnswerChange = (index: number, newAnswer: string) => {
        const updated = [...faqs];
        updated[index] = { ...updated[index], answer: newAnswer };
        onUpdate(updated);
    };

    const handleAddFAQ = () => {
        onUpdate([...faqs, { question: 'New Question', answer: '' }]);
    };

    const handleRemoveFAQ = (index: number) => {
        onUpdate(faqs.filter((_, i) => i !== index));
    };

    return (
        <AnimatedSection id="faqs">
            <section className="w-full pb-16">
                <div className="flex w-full flex-col gap-10 btn-grad rounded-[32px] py-10 sm:py-16 px-6 sm:px-10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl text-center text-wrap">
                            Frequently Asked Questions
                        </h2>
                        <Button size="sm" variant="outline" onClick={handleAddFAQ}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add FAQ
                        </Button>
                    </div>
                    <div className="relative font-geist-sans w-full md:max-w-4xl mx-auto space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border border-border rounded-lg p-4 bg-background/50 group">
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground mb-2 block">Question</Label>
                                        <Input
                                            value={faq.question}
                                            onChange={(e) => handleQuestionChange(index, e.target.value)}
                                            placeholder="Enter question"
                                            className="font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground mb-2 block">Answer</Label>
                                        <TiptapEditor
                                            content={faq.answer}
                                            onChange={(newValue) => handleAnswerChange(index, newValue)}
                                            placeholder="Enter answer..."
                                            minHeight="150px"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleRemoveFAQ(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {faqs.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>No FAQs added yet. Click "Add FAQ" to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </AnimatedSection>
    );
}


