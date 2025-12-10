"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AnimatedSection from '@/components/website/AnimatedSection';
import { FirmReview } from '@/types/firm-review';
import EditableField from '../EditableField';
import { cn } from '@/lib/utils';

interface EditableBlogHeroProps {
    reviewData: FirmReview;
    onUpdate: (updates: Partial<FirmReview>) => void;
}

export default function EditableBlogHero({ reviewData, onUpdate }: EditableBlogHeroProps) {
    const [publishedDate, setPublishedDate] = React.useState<Date | undefined>(
        reviewData?.publishedAt ? new Date(reviewData.publishedAt) : undefined
    );

    React.useEffect(() => {
        if (reviewData?.publishedAt) {
            const date = new Date(reviewData.publishedAt);
            if (!isNaN(date.getTime())) {
                setPublishedDate(date);
            }
        }
    }, [reviewData?.publishedAt]);

    const handleDateSelect = (date: Date | undefined) => {
        setPublishedDate(date);
        if (date) {
            onUpdate({ publishedAt: format(date, 'MMMM d, yyyy') });
        }
    };

    return (
        <AnimatedSection id="blog-hero">
            <section className="relative overflow-hidden max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="w-full">
                    <div className="flex items-center justify-between mb-4">
                        <Button
                            asChild
                            variant="link"
                            className="text-white/80 hover:text-white hover:bg-white/10"
                        >
                            <Link href="/admin/blogs" className="hidden items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Blogs
                            </Link>
                        </Button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <Label className="text-white/60 text-sm mb-2 block">Title</Label>
                            <EditableField
                                value={reviewData?.title || ''}
                                onSave={(newValue) => onUpdate({ title: newValue })}
                                className="text-5xl font-bold text-white leading-tight capitalize w-full"
                                placeholder="Enter blog title"
                            />
                        </div>
                        <div>
                            <Label className="text-white/60 text-sm mb-2 block">Subtitle</Label>
                            <EditableField
                                value={reviewData?.subtitle || ''}
                                onSave={(newValue) => onUpdate({ subtitle: newValue })}
                                className="text-lg sm:text-xl text-white/80 font-light capitalize"
                                placeholder="Enter blog subtitle"
                            />
                        </div>
                        <div>
                            <Label className="text-white/60 text-sm mb-2 block">Firm Name</Label>
                            <EditableField
                                value={reviewData?.firmName || ''}
                                onSave={(newValue) => onUpdate({ firmName: newValue })}
                                className="text-white"
                                placeholder="Enter firm name"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            <div>
                                <Label className="text-white/60 text-sm mb-2 block">Published Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20",
                                                !publishedDate && "text-white/40"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {publishedDate ? format(publishedDate, 'MMMM d, yyyy') : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={publishedDate}
                                            onSelect={handleDateSelect}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div>
                                <Label className="text-white/60 text-sm mb-2 block">Read Time (minutes)</Label>
                                <Input
                                    type="number"
                                    value={reviewData?.readTime || 0}
                                    onChange={(e) => onUpdate({ readTime: parseInt(e.target.value) || 0 })}
                                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                                    placeholder="5"
                                    min="0"
                                />
                            </div>
                            <div>
                                <Label className="text-white/60 text-sm mb-2 block">PTI (0-10)</Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="w-full">
                                                <Slider
                                                    value={[reviewData?.trustScore || 0]}
                                                    onValueChange={(value) => onUpdate({ trustScore: value[0] })}
                                                    min={0}
                                                    max={10}
                                                    step={0.1}
                                                    className="w-full"
                                                />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{reviewData?.trustScore?.toFixed(1) || '0.0'}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <div className="text-white/60 text-xs mt-1 text-center">
                                    {reviewData?.trustScore?.toFixed(1) || '0.0'}
                                </div>
                            </div>
                            <div>
                                <Label className="text-white/60 text-sm mb-2 block">Rating (0-5)</Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="w-full">
                                                <Slider
                                                    value={[reviewData?.rating || 0]}
                                                    onValueChange={(value) => onUpdate({ rating: value[0] })}
                                                    min={0}
                                                    max={5}
                                                    step={0.1}
                                                    className="w-full"
                                                />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{reviewData?.rating?.toFixed(1) || '0.0'}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <div className="text-white/60 text-xs mt-1 text-center">
                                    {reviewData?.rating?.toFixed(1) || '0.0'}
                                </div>
                            </div>
                            <div>
                                <Label className="text-white/60 text-sm mb-2 block">Rating Label</Label>
                                <EditableField
                                    value={reviewData?.ratingLabel || ''}
                                    onSave={(newValue) => onUpdate({ ratingLabel: newValue })}
                                    className="text-white"
                                    placeholder="e.g., Excellent"
                                />
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-white/60 pt-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <CalendarIcon className="h-4 w-4" />
                                        <span>{reviewData?.publishedAt || ''}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{reviewData?.readTime || 0} min read</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AnimatedSection>
    );
}

