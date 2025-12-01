"use client";

import React from 'react';
import { Star, CheckCircle, XCircle, LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import AnimatedSection from '@/components/website/AnimatedSection';
import { FinalVerdictSection } from '@/types/firm-review';
import Image from 'next/image';

interface BlogFinalVerdictProps {
    finalVerdict: FinalVerdictSection;
    firmName: string;
    iconMap: Record<string, LucideIcon>;
    trustScore: number;
}

export default function BlogFinalVerdict({ finalVerdict, firmName, iconMap, trustScore }: BlogFinalVerdictProps) {
    if (!finalVerdict) return null;

    const IconComponent = iconMap[finalVerdict.icon] || Star;

    return (
        <AnimatedSection id="blog-final-verdict">
            <section id={finalVerdict.id} className="mb-12">
                <Card className="relative overflow-hidden border border-white/10 bg-linear-to-br from-black/80 via-neutral-900/80 to-black/70">
                    <div className="absolute inset-0 bg-linear-to-b from-white/5 via-transparent to-black/60 pointer-events-none" />
                    <div className="absolute -left-24 top-6 h-60 w-60 rounded-full bg-[#F66435]/20 blur-[120px]" />
                    <div className="absolute -right-24 bottom-6 h-60 w-60 rounded-full bg-[#F66435]/25 blur-[120px]" />
                    <CardContent className="relative p-8 z-10">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 border border-primary/30 mb-4">
                                <IconComponent className="h-10 w-10 text-primary fill-current" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-2">{finalVerdict.title}</h2>
                            <p className="text-white/60 text-base sm:text-lg">{finalVerdict.subtitle}</p>
                        </div>

                        <div className="text-center mb-8">
                            <div className="inline-flex flex-col gap-1 items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                                <figure className=" rounded-[8px] relative flex flex-col items-center justify-end ">
                                    <span className='text-primary text-[32px] font-bold'>
                                    {trustScore}<span className='text-xl font-light'>/10</span>
                                    </span>
                                    <span className='text-base text-foreground/90 -mt-1'>
                                    PTI INDEX
                                    </span>
                                </figure>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-white/80">
                                    <div className="w-2 h-2 bg-success rounded-full"></div>
                                    <span>{finalVerdict.ratingLabel}</span>
                                </div>
                            </div>
                        </div>

                        {finalVerdict.strengths && finalVerdict.strengths.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 text-center">Why <span className='uppercase text-primary'>{firmName} </span> Stands Out</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {finalVerdict.strengths.map((strength, index) => (
                                        <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                                </div>
                                                <span className="font-medium text-white">{strength.title}</span>
                                            </div>
                                            <p className="text-white/70 text-sm">{strength.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {finalVerdict.weaknesses && finalVerdict.weaknesses.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 text-center">Areas for Improvement</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {finalVerdict.weaknesses.map((weakness, index) => (
                                        <div key={index} className="bg-white/5 backdrop-blur-sm border border-red-500/20 rounded-xl p-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                                    <XCircle className="h-4 w-4 text-red-400" />
                                                </div>
                                                <span className="font-medium text-white">{weakness.title}</span>
                                            </div>
                                            <p className="text-white/70 text-sm">{weakness.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {finalVerdict.recommendation && (
                            <div className="bg-linear-to-r from-green-500/10 via-green-500/5 to-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center">
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-green-500/20 items-center justify-center hidden sm:flex">
                                        <CheckCircle className="h-5 w-5 text-green-400" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-semibold text-green-400">{finalVerdict.recommendation.title}</h3>
                                </div>
                                <p className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed mb-6">
                                    {finalVerdict.recommendation.content}
                                </p>
                                {finalVerdict.recommendation.footer && (
                                    <span className="text-white font-medium text-sm sm:text-base">{finalVerdict.recommendation.footer}</span>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>
        </AnimatedSection>
    );
}

