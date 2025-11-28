"use client";

import React from 'react';
import EditableField from './EditableField';

interface EditableTextProps {
    value: string;
    onSave: (newValue: string) => void;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
    as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export default function EditableText({
    value,
    onSave,
    className,
    placeholder = "Click to edit",
    disabled = false,
    as = 'span',
}: EditableTextProps) {
    const Component = as;

    return (
        <EditableField
            value={value}
            onSave={onSave}
            className={className}
            placeholder={placeholder}
            disabled={disabled}
            multiline={false}
        >
            <Component className={className}>
                {value || placeholder}
            </Component>
        </EditableField>
    );
}

