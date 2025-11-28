"use client";

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditableField from './EditableField';
import { cn } from '@/lib/utils';

export interface KeyValueItem {
    label: string;
    value: string;
    highlight?: boolean | 'success';
}

interface EditableKeyValueProps {
    items: KeyValueItem[];
    onSave: (newItems: KeyValueItem[]) => void;
    className?: string;
    disabled?: boolean;
}

export default function EditableKeyValue({
    items,
    onSave,
    className,
    disabled = false,
}: EditableKeyValueProps) {
    const [editingLabelIndex, setEditingLabelIndex] = React.useState<number | null>(null);
    const [editingValueIndex, setEditingValueIndex] = React.useState<number | null>(null);

    const handleLabelSave = (index: number, newLabel: string) => {
        const updatedItems = [...items];
        updatedItems[index] = { ...updatedItems[index], label: newLabel.trim() };
        onSave(updatedItems);
        setEditingLabelIndex(null);
    };

    const handleValueSave = (index: number, newValue: string) => {
        const updatedItems = [...items];
        updatedItems[index] = { ...updatedItems[index], value: newValue.trim() };
        onSave(updatedItems);
        setEditingValueIndex(null);
    };

    const handleRemoveItem = (index: number) => {
        const updatedItems = items.filter((_, i) => i !== index);
        onSave(updatedItems);
    };

    const handleAddItem = () => {
        onSave([...items, { label: 'New Label', value: 'New Value' }]);
    };

    return (
        <div className={cn("space-y-4", className)}>
            {items.map((item, index) => (
                <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-border/50 group"
                >
                    <div className="flex-1">
                        {editingLabelIndex === index ? (
                            <EditableField
                                value={item.label}
                                onSave={(newValue) => handleLabelSave(index, newValue)}
                                className="inline-block"
                                placeholder="Label"
                            />
                        ) : (
                            <span
                                onClick={() => !disabled && setEditingLabelIndex(index)}
                                className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                            >
                                {item.label}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 flex-1 justify-end">
                        {editingValueIndex === index ? (
                            <EditableField
                                value={item.value}
                                onSave={(newValue) => handleValueSave(index, newValue)}
                                className="text-right"
                                placeholder="Value"
                            />
                        ) : (
                            <span
                                onClick={() => !disabled && setEditingValueIndex(index)}
                                className={cn(
                                    "font-semibold cursor-pointer hover:opacity-80 transition-opacity text-right",
                                    item.highlight === 'success' ? 'text-green-400' :
                                    item.highlight ? 'text-primary' :
                                    'text-foreground'
                                )}
                            >
                                {item.value}
                            </span>
                        )}
                        {!disabled && (
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveItem(index)}
                                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                </div>
            ))}
            {!disabled && (
                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAddItem}
                    className="w-full flex items-center justify-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add New Field
                </Button>
            )}
        </div>
    );
}

