"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
    className,
    placeholder = "Click to edit",
    multiline = false,
    disabled = false,
}: EditableFieldProps) {
    const [editValue, setEditValue] = React.useState(value);
    const [isFocused, setIsFocused] = React.useState(false);
    const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
        setEditValue(value);
    }, [value]);

    // Debounced save function
    const debouncedSave = React.useCallback((newValue: string) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            onSave(newValue);
        }, 500);
    }, [onSave]);

    // Handle value change
    const handleChange = (newValue: string) => {
        setEditValue(newValue);
        // Auto-save with debounce while typing
        debouncedSave(newValue);
    };

    // Handle blur - immediate save
    const handleBlur = () => {
        setIsFocused(false);
        // Clear any pending debounced save
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = null;
        }
        // Immediate save on blur
        onSave(editValue);
    };

    // Handle focus
    const handleFocus = () => {
        setIsFocused(true);
    };


    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    // Always show input/textarea so placeholder is always visible
    return (
        <div className="w-full">
            {multiline ? (
                <Textarea
                    value={editValue}
                    onChange={(e) => handleChange(e.target.value)}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    className={cn("w-full min-h-[100px]", className)}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoFocus={isFocused}
                />
            ) : (
                <Input
                    type="text"
                    value={editValue}
                    onChange={(e) => handleChange(e.target.value)}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    className={cn("w-full", className)}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoFocus={isFocused}
                />
            )}
        </div>
    );
}
