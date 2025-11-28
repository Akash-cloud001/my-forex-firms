"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import EditableText from '../EditableText';
import EditableField from '../EditableField';
import { Star, Search, Scale, BarChart3, TrendingUp, LucideIcon } from 'lucide-react';
import { FirmReview, ComparisonRow } from '@/types/firm-review';

const iconMap: Record<string, LucideIcon> = {
    Star,
    Search,
    Scale,
    BarChart3,
    TrendingUp,
};

interface ProgramsComparisonEditorProps {
    reviewData: FirmReview;
    onUpdate: (updates: Partial<FirmReview>) => void;
}

export default function ProgramsComparisonEditor({ reviewData, onUpdate }: ProgramsComparisonEditorProps) {
    const [editingRow, setEditingRow] = React.useState<number | null>(null);
    const [editingField, setEditingField] = React.useState<string | null>(null);

    const handleHeaderUpdate = (index: number, newValue: string) => {
        const updatedHeaders = [...reviewData.programsComparison.headers];
        updatedHeaders[index] = newValue;
        onUpdate({
            programsComparison: {
                ...reviewData.programsComparison,
                headers: updatedHeaders,
            },
        });
    };

    const handleRowFieldUpdate = (rowIndex: number, field: keyof ComparisonRow, newValue: string) => {
        const updatedRows = [...reviewData.programsComparison.rows];
        updatedRows[rowIndex] = {
            ...updatedRows[rowIndex],
            [field]: newValue,
        };
        onUpdate({
            programsComparison: {
                ...reviewData.programsComparison,
                rows: updatedRows,
            },
        });
        setEditingRow(null);
        setEditingField(null);
    };

    const handleAddRow = () => {
        const newRow: ComparisonRow = {
            criteria: 'New Criteria',
            instant: '',
            phase1: '',
            phase2: '',
        };
        onUpdate({
            programsComparison: {
                ...reviewData.programsComparison,
                rows: [...reviewData.programsComparison.rows, newRow],
            },
        });
    };

    const handleRemoveRow = (index: number) => {
        const updatedRows = reviewData.programsComparison.rows.filter((_, i) => i !== index);
        onUpdate({
            programsComparison: {
                ...reviewData.programsComparison,
                rows: updatedRows,
            },
        });
    };

    return (
        <Card className="border-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {React.createElement(iconMap[reviewData.programsComparison.icon] || BarChart3, { className: "h-5 w-5" })}
                    <EditableText
                        value={reviewData.programsComparison.title}
                        onSave={(newValue) => onUpdate({
                            programsComparison: { ...reviewData.programsComparison, title: newValue }
                        })}
                        className="text-xl font-semibold"
                    />
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Table Headers</label>
                    <div className="grid grid-cols-4 gap-2">
                        {reviewData.programsComparison.headers.map((header, index) => (
                            <EditableText
                                key={index}
                                value={header}
                                onSave={(newValue) => handleHeaderUpdate(index, newValue)}
                                className="text-sm font-semibold"
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Table Rows</label>
                    <div className="overflow-x-auto border border-border rounded-lg">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-accent/20 border-b border-border">
                                    {reviewData.programsComparison.headers.map((header, index) => (
                                        <th key={index} className="text-left p-3 text-sm font-semibold">
                                            {header}
                                        </th>
                                    ))}
                                    <th className="text-left p-3 text-sm font-semibold w-20">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviewData.programsComparison.rows.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="border-b border-border/30 hover:bg-accent/10">
                                        {['criteria', 'instant', 'phase1', 'phase2'].map((field) => {
                                            const fieldKey = field as keyof ComparisonRow;
                                            const isEditing = editingRow === rowIndex && editingField === field;
                                            return (
                                                <td key={field} className="p-3">
                                                    {isEditing ? (
                                                        <EditableField
                                                            value={row[fieldKey] || ''}
                                                            onSave={(newValue) => handleRowFieldUpdate(rowIndex, fieldKey, newValue)}
                                                            className="w-full"
                                                        />
                                                    ) : (
                                                        <div
                                                            onClick={() => {
                                                                setEditingRow(rowIndex);
                                                                setEditingField(field);
                                                            }}
                                                            className="cursor-pointer hover:bg-accent/50 rounded px-2 py-1 -mx-2 -my-1 transition-colors text-sm"
                                                        >
                                                            {row[fieldKey] || 'Click to edit'}
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className="p-3">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleRemoveRow(rowIndex)}
                                                className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAddRow}
                        className="mt-4 flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add Row
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

