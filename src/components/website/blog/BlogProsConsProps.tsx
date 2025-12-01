"use client";

import React from 'react';
import { CheckCircle, XCircle, LucideIcon } from 'lucide-react';
import AnimatedSection from '@/components/website/AnimatedSection';
import { ProsConsSection } from '@/types/firm-review';

interface BlogProsConsProps {
    prosCons: ProsConsSection;
    iconMap: Record<string, LucideIcon>;
}

export default function BlogProsCons({ prosCons, iconMap }: BlogProsConsProps) {
    if (!prosCons) return null;

    const IconComponent = iconMap[prosCons.icon] || CheckCircle;

    // Get max length to ensure both columns have equal rows
    const maxLength = Math.max(
        prosCons.pros?.length || 0,
        prosCons.cons?.length || 0
    );

    return (
        <AnimatedSection id="blog-pros-cons">
            <section id={prosCons.id} className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
                    <IconComponent className="h-8 w-8 text-primary" />
                    {prosCons.title}
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-foreground">
                        <thead>
                            <tr className="border-b-2 border-border">
                                <th className="py-4 px-4 sm:px-6 text-left font-semibold text-foreground">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-muted-foreground" />
                                        Pros
                                    </div>
                                </th>
                                <th className="py-4 px-4 sm:px-6 text-left font-semibold text-foreground">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="h-5 w-5 text-muted-foreground" />
                                        Cons
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: maxLength }).map((_, index) => (
                                <tr key={index} className="border-b border-border">
                                    {/* Pros Column */}
                                    <td className="py-4 px-4 sm:px-6">
                                        {prosCons.pros && prosCons.pros[index] ? (
                                            <div className="flex items-start gap-3">
                                                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
                                                <span className="text-sm text-foreground">{prosCons.pros[index]}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-transparent">-</span>
                                        )}
                                    </td>

                                    {/* Cons Column */}
                                    <td className="py-4 px-4 sm:px-6">
                                        {prosCons.cons && prosCons.cons[index] ? (
                                            <div className="flex items-start gap-3">
                                                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
                                                <span className="text-sm text-foreground">{prosCons.cons[index]}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-transparent">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </AnimatedSection>
    );
}
