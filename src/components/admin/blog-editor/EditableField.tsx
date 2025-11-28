"use client";

import React from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EditableFieldProps {
    value: string;
    onSave: (newValue: string) => void;
    children?: React.ReactNode;
    className?: string;
    placeholder?: string;
    multiline?: boolean;
    disabled?: boolean;
}

export default function EditableField({
    value,
    onSave,
    children,
    className,
    placeholder = "Click to edit",
    multiline = false,
    disabled = false,
}: EditableFieldProps) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editValue, setEditValue] = React.useState(value);

    React.useEffect(() => {
        setEditValue(value);
    }, [value]);

    const handleStartEdit = () => {
        if (disabled) return;
        setIsEditing(true);
        setEditValue(value);
    };

    const handleSave = () => {
        onSave(editValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditValue(value);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !multiline && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    if (isEditing) {
        return (
            <div className={cn("flex items-start gap-2", className)}>
                {multiline ? (
                    <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 min-h-[100px] px-3 py-2 border border-primary rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        autoFocus
                    />
                ) : (
                    <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 px-3 py-2 border border-primary rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        autoFocus
                    />
                )}
                <div className="flex gap-1">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleSave}
                        className="h-8 w-8 p-0"
                    >
                        <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCancel}
                        className="h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={handleStartEdit}
            className={cn(
                "group relative cursor-pointer rounded-md px-2 py-1 transition-colors hover:bg-accent/50",
                disabled && "cursor-not-allowed opacity-50",
                className
            )}
        >
            {children || (
                <span className={cn(
                    "text-foreground",
                    !value && "text-muted-foreground italic"
                )}>
                    {value || placeholder}
                </span>
            )}
            {!disabled && (
                <Edit2 className="absolute top-1 right-1 h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
        </div>
    );
}

