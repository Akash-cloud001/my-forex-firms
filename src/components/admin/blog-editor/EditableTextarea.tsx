"use client";

import React from 'react';
import EditableField from './EditableField';

interface EditableTextareaProps {
    value: string;
    onSave: (newValue: string) => void;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
}

export default function EditableTextarea({
    value,
    onSave,
    className,
    placeholder = "Click to edit",
    disabled = false,
}: EditableTextareaProps) {
    return (
        <EditableField
            value={value}
            onSave={onSave}
            className={className}
            placeholder={placeholder}
            disabled={disabled}
            multiline={true}
        >
            <p className={className}>
                {value || placeholder}
            </p>
        </EditableField>
    );
}

