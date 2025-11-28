"use client";

import React from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditableField from './EditableField';
import { cn } from '@/lib/utils';

interface EditableArrayProps {
    items: string[];
    onSave: (newItems: string[]) => void;
    className?: string;
    placeholder?: string;
    addButtonLabel?: string;
    disabled?: boolean;
}

export default function EditableArray({
    items,
    onSave,
    className,
    placeholder = "Add new item",
    addButtonLabel = "Add Item",
    disabled = false,
}: EditableArrayProps) {
    const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
    const [newItem, setNewItem] = React.useState('');

    const handleItemSave = (index: number, newValue: string) => {
        const updatedItems = [...items];
        if (newValue.trim()) {
            updatedItems[index] = newValue.trim();
            onSave(updatedItems);
        } else {
            // Remove empty items
            const filtered = updatedItems.filter((_, i) => i !== index);
            onSave(filtered);
        }
        setEditingIndex(null);
    };

    const handleAddItem = () => {
        if (newItem.trim()) {
            onSave([...items, newItem.trim()]);
            setNewItem('');
        }
    };

    const handleRemoveItem = (index: number) => {
        const updatedItems = items.filter((_, i) => i !== index);
        onSave(updatedItems);
    };

    return (
        <div className={cn("space-y-2", className)}>
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2 group">
                    {editingIndex === index ? (
                        <EditableField
                            value={item}
                            onSave={(newValue) => handleItemSave(index, newValue)}
                            className="flex-1"
                            placeholder="Enter item"
                        />
                    ) : (
                        <>
                            <span className="flex-1 px-2 py-1 rounded-md group-hover:bg-accent/50">
                                {item}
                            </span>
                            {!disabled && (
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setEditingIndex(index)}
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
                        </>
                    )}
                </div>
            ))}
            {!disabled && (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleAddItem();
                            }
                        }}
                        placeholder={placeholder}
                        className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button
                        size="sm"
                        onClick={handleAddItem}
                        disabled={!newItem.trim()}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        {addButtonLabel}
                    </Button>
                </div>
            )}
        </div>
    );
}

