"use client";

import React from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditableField from './EditableField';
import { cn } from '@/lib/utils';

export interface ProsConsItem {
    title: string;
    description: string;
}

interface EditableProsConsProps {
    items: ProsConsItem[];
    onSave: (newItems: ProsConsItem[]) => void;
    className?: string;
    type?: 'pros' | 'cons';
    disabled?: boolean;
}

export default function EditableProsCons({
    items,
    onSave,
    className,
    type = 'pros',
    disabled = false,
}: EditableProsConsProps) {
    const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
    const [editingField, setEditingField] = React.useState<'title' | 'description' | null>(null);

    const handleItemSave = (index: number, field: 'title' | 'description', newValue: string) => {
        const updatedItems = [...items];
        if (newValue.trim()) {
            updatedItems[index] = { ...updatedItems[index], [field]: newValue.trim() };
            onSave(updatedItems);
        }
        setEditingIndex(null);
        setEditingField(null);
    };

    const handleAddItem = () => {
        onSave([...items, { title: 'New Item', description: 'Description' }]);
    };

    const handleRemoveItem = (index: number) => {
        const updatedItems = items.filter((_, i) => i !== index);
        onSave(updatedItems);
    };

    return (
        <div className={cn("space-y-3", className)}>
            {items.map((item, index) => (
                <div key={index} className="border border-border rounded-lg p-4 group">
                    {editingIndex === index && editingField ? (
                        <EditableField
                            value={item[editingField]}
                            onSave={(newValue) => handleItemSave(index, editingField, newValue)}
                            multiline={editingField === 'description'}
                            className="w-full"
                        />
                    ) : (
                        <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                    <div
                                        onClick={() => !disabled && (setEditingIndex(index), setEditingField('title'))}
                                        className="font-semibold text-foreground cursor-pointer hover:bg-accent/50 rounded px-2 py-1 -mx-2 -my-1 transition-colors"
                                    >
                                        {item.title}
                                    </div>
                                    <div
                                        onClick={() => !disabled && (setEditingIndex(index), setEditingField('description'))}
                                        className="text-sm text-muted-foreground cursor-pointer hover:bg-accent/50 rounded px-2 py-1 -mx-2 -my-1 transition-colors mt-1"
                                    >
                                        {item.description}
                                    </div>
                                </div>
                                {!disabled && (
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                                setEditingIndex(index);
                                                setEditingField('title');
                                            }}
                                            className="h-7 w-7 p-0"
                                        >
                                            <Edit2 className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleRemoveItem(index)}
                                            className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
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
                    Add {type === 'pros' ? 'Advantage' : 'Limitation'}
                </Button>
            )}
        </div>
    );
}

