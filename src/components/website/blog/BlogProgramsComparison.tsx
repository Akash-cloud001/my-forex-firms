"use client";

import React from 'react';
import { BarChart3, LucideIcon } from 'lucide-react';
import AnimatedSection from '@/components/website/AnimatedSection';
import { ProgramsComparisonSection, ComparisonRow } from '@/types/firm-review';

interface BlogProgramsComparisonProps {
    programsComparison: ProgramsComparisonSection;
    iconMap: Record<string, LucideIcon>;
}

export default function BlogProgramsComparison({ programsComparison, iconMap }: BlogProgramsComparisonProps) {
    if (!programsComparison) return null;

    const IconComponent = iconMap[programsComparison.icon] || BarChart3;

    // ✅ Dynamically extract column keys from the first row
    const getColumnKeys = (): string[] => {
        if (!programsComparison.rows || programsComparison.rows.length === 0) {
            return [];
        }

        const firstRow = programsComparison.rows[0];
        const columnKeys: string[] = [];

        // Check for each possible phase/type column
        if ('instant' in firstRow && firstRow.instant) columnKeys.push('instant');
        if ('phase1' in firstRow && firstRow.phase1) columnKeys.push('phase1');
        if ('phase2' in firstRow && firstRow.phase2) columnKeys.push('phase2');

        return columnKeys;
    };

    const columnKeys = getColumnKeys();

    // ✅ Helper function to get highlight color for a column
    const getHighlightColor = (row: ComparisonRow, column: string): string => {
        const highlightKey = `${column}Highlight` as keyof ComparisonRow;
        const highlight = row[highlightKey];

        if (highlight === 'red') return 'text-red-500';
        if (highlight === 'yellow') return 'text-yellow-500';
        if (highlight === 'success') return 'text-green-400';
        return '';
    };

    // ✅ Helper function to get cell value
    const getCellValue = (row: ComparisonRow, column: string): string => {
        return (row[column as keyof ComparisonRow] as string) || '';
    };

    return (
        <AnimatedSection id="blog-programs-comparison">
            <section id={programsComparison.id} className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <IconComponent className="h-8 w-8 text-primary" />
                    {programsComparison.title}
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border rounded-lg overflow-hidden text-foreground min-w-full">
                        <thead>
                            <tr className="bg-accent/20">
                                {/* Criteria Header */}
                                <th className="text-sm sm:text-base border border-border p-4 text-left font-semibold whitespace-nowrap">
                                    Criteria
                                </th>

                                {/* Dynamic Headers from headers array */}
                                {programsComparison.headers
                                    .filter(header => header !== 'Criteria') // ✅ Filter out 'Criteria' if present
                                    .map((header: string, index: number) => (
                                        <th
                                            key={index}
                                            className="text-sm sm:text-base border border-border p-4 text-center font-semibold whitespace-nowrap"
                                        >
                                            {header}
                                        </th>
                                    ))}
                            </tr>
                        </thead>

                        <tbody>
                            {programsComparison.rows.map((row, rowIndex) => (
                                <tr key={rowIndex} className={rowIndex % 2 === 1 ? 'bg-accent/10' : ''}>
                                    {/* Criteria Column */}
                                    <td className="border border-border p-4 text-sm sm:text-base font-medium whitespace-nowrap">
                                        {row.criteria}
                                    </td>

                                    {/* Dynamic Data Columns */}
                                    {programsComparison.headers
                                        .filter(header => header !== 'Criteria')
                                        .map((header: string, colIndex: number) => {
                                            // ✅ Map header to column key
                                            let columnKey = '';
                                            if (header.includes('Instant')) columnKey = 'instant';
                                            else if (header.includes('1‑Phase') || header.includes('1-Phase')) columnKey = 'phase1';
                                            else if (header.includes('2‑Phase') || header.includes('2-Phase')) columnKey = 'phase2';

                                            const cellValue = getCellValue(row, columnKey);
                                            const highlightColor = getHighlightColor(row, columnKey);

                                            return (
                                                <td
                                                    key={colIndex}
                                                    className={`border border-border p-4 text-sm sm:text-base text-center ${highlightColor}`}
                                                >
                                                    {cellValue}
                                                </td>
                                            );
                                        })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </AnimatedSection>
    );
}
