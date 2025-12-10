"use client";

import React from 'react';
import { BarChart3, LucideIcon } from 'lucide-react';
import AnimatedSection from '@/components/website/AnimatedSection';
import { ProgramsComparisonSection } from '@/types/firm-review';
import EditableField from '../EditableField';
import TableEditor, { ComparisonRow } from '../TableEditor';
import { iconMap } from '../IconSelector';
import ArrayEditor from '../ArrayEditor';

interface EditableBlogProgramsComparisonProps {
    programsComparison: ProgramsComparisonSection;
    onUpdate: (programsComparison: ProgramsComparisonSection) => void;
}

export default function EditableBlogProgramsComparison({
    programsComparison,
    onUpdate,
}: EditableBlogProgramsComparisonProps) {
    if (!programsComparison) return null;

    const IconComponent = iconMap[programsComparison.icon] || BarChart3;

    const handleTitleChange = (newTitle: string) => {
        onUpdate({ ...programsComparison, title: newTitle });
    };

    const handleHeadersChange = (newHeaders: string[]) => {
        onUpdate({ ...programsComparison, headers: newHeaders });
    };

    const handleRowsChange = (newRows: ComparisonRow[]) => {
        onUpdate({ ...programsComparison, rows: newRows });
    };

    return (
        <AnimatedSection id="blog-programs-comparison">
            <section id={programsComparison.id} className="mb-12">
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <IconComponent className="h-8 w-8 text-primary" />
                        <div className="flex-1">
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">Title</label>
                            <EditableField
                                value={programsComparison.title}
                                onSave={handleTitleChange}
                                className="text-2xl sm:text-3xl font-bold text-foreground capitalize"
                                placeholder="Section Title"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Table Headers</label>
                        <ArrayEditor
                            items={programsComparison.headers}
                            onSave={handleHeadersChange}
                            placeholder="Add header"
                            addButtonLabel="Add Header"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Comparison Rows</label>
                        <TableEditor
                            headers={programsComparison.headers}
                            rows={programsComparison.rows}
                            onHeadersChange={handleHeadersChange}
                            onRowsChange={handleRowsChange}
                        />
                    </div>
                </div>
            </section>
        </AnimatedSection>
    );
}

