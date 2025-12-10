"use client";

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    nonDeletableLabels?: string[]; // Labels that cannot be deleted
    disabledValueLabels?: string[]; // Labels whose values cannot be edited
}

export default function EditableKeyValue({
    items,
    onSave,
    className,
    disabled = false,
    nonDeletableLabels = [],
    disabledValueLabels = [],
}: EditableKeyValueProps) {
    const [editingLabelIndex, setEditingLabelIndex] = React.useState<number | null>(null);

    const handleLabelSave = (index: number, newLabel: string) => {
        const updatedItems = [...items];
        updatedItems[index] = { ...updatedItems[index], label: newLabel.trim() };
        onSave(updatedItems);
        setEditingLabelIndex(null);
    };

    const handleValueChange = (index: number, newValue: string) => {
        const updatedItems = [...items];
        updatedItems[index] = { ...updatedItems[index], value: newValue };
        onSave(updatedItems);
    };

    const handleRemoveItem = (index: number) => {
        const item = items[index];
        // Check if this item is non-deletable
        const isNonDeletable = nonDeletableLabels.some(label => 
            item.label.toLowerCase().trim() === label.toLowerCase().trim() ||
            item.label.toLowerCase().trim().includes(label.toLowerCase().trim())
        );
        
        if (isNonDeletable) {
            return; // Don't allow deletion of non-deletable items
        }
        
        const updatedItems = items.filter((_, i) => i !== index);
        onSave(updatedItems);
    };

    const isItemNonDeletable = (item: KeyValueItem) => {
        return nonDeletableLabels.some(label => 
            item.label.toLowerCase().trim() === label.toLowerCase().trim() ||
            item.label.toLowerCase().trim().includes(label.toLowerCase().trim())
        );
    };

    const isValueDisabled = (item: KeyValueItem) => {
        return disabledValueLabels.some(label => 
            item.label.toLowerCase().trim() === label.toLowerCase().trim() ||
            item.label.toLowerCase().trim().includes(label.toLowerCase().trim())
        );
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
                        <Input
                            value={item.value}
                            onChange={(e) => handleValueChange(index, e.target.value)}
                            className={cn(
                                "text-right",
                                item.highlight === 'success' ? 'border-green-400/50 focus:border-green-400' :
                                item.highlight ? 'border-primary/50 focus:border-primary' :
                                ''
                            )}
                            placeholder="Value"
                            disabled={disabled || isValueDisabled(item)}
                        />
                        {!disabled && !isItemNonDeletable(item) && (
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

