"use client";

import React from 'react';
import { BarChart3, LucideIcon } from 'lucide-react';
import AnimatedSection from '@/components/website/AnimatedSection';
import { ProgramsComparisonSection } from '@/types/firm-review';

interface BlogProgramsComparisonProps {
    programsComparison: ProgramsComparisonSection;
    iconMap: Record<string, LucideIcon>;
}

export default function BlogProgramsComparison({ programsComparison, iconMap }: BlogProgramsComparisonProps) {
    if (!programsComparison) return null;

    const IconComponent = iconMap[programsComparison.icon] || BarChart3;

    return (
        <AnimatedSection id="blog-programs-comparison">
            <section id={programsComparison.id} className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <IconComponent className="h-8 w-8 text-primary" />
                    {programsComparison.title}
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border rounded-lg overflow-hidden text-foreground">
                        <thead>
                            <tr className="bg-accent/20">
                                {programsComparison.headers.map((header: string, index: number) => (
                                    <th 
                                        key={index} 
                                        className={`text-sm sm:text-base border border-border p-4 ${index === 0 ? 'text-left' : 'text-center'} font-semibold`}
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {programsComparison.rows.map((row, rowIndex) => (
                                <tr key={rowIndex} className={rowIndex % 2 === 1 ? 'bg-accent/10' : ''}>
                                    <td className="border border-border p-4 text-sm sm:text-base font-medium">{row.criteria}</td>
                                    <td className={`border border-border p-4 text-sm sm:text-base text-center ${
                                        row.instantHighlight === 'red' ? 'text-red-500' :
                                        row.instantHighlight === 'yellow' ? 'text-yellow-500' :
                                        row.instantHighlight === 'success' ? 'text-green-400' : ''
                                    }`}>
                                        {row.instant || ''}
                                    </td>
                                    <td className={`border border-border p-4 text-center text-sm sm:text-base ${
                                        row.phase1Highlight === 'red' ? 'text-red-500' :
                                        row.phase1Highlight === 'yellow' ? 'text-yellow-500' :
                                        row.phase1Highlight === 'success' ? 'text-green-400' : ''
                                    }`}>
                                        {row.phase1 || ''}
                                    </td>
                                    <td className={`border border-border p-4 text-sm sm:text-base text-center ${
                                        row.phase2Highlight === 'red' ? 'text-red-500' :
                                        row.phase2Highlight === 'yellow' ? 'text-yellow-500' :
                                        row.phase2Highlight === 'success' ? 'text-green-400' : ''
                                    }`}>
                                        {row.phase2 || ''}
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

