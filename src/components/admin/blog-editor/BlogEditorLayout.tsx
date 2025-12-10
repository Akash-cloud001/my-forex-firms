"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, Loader2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BlogEditorLayoutProps {
    title: string;
    subtitle?: string;
    slug?: string;
    hasChanges: boolean;
    isSaving: boolean;
    onSave: () => void;
    children: React.ReactNode;
    isEditMode?: boolean;
}

export default function BlogEditorLayout({
    title,
    subtitle,
    slug,
    hasChanges,
    isSaving,
    onSave,
    children,
    isEditMode = false,
}: BlogEditorLayoutProps) {
    return (
        <div className="min-h-screen bg-background relative">
            {/* Minimal Top Bar */}
            <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <Link href="/admin/blogs">
                                <ArrowLeft className="h-4 w-4" />
                                <span className="hidden sm:inline">Back to Blogs</span>
                            </Link>
                        </Button>
                        
                        <div className="flex items-center gap-3">
                            {hasChanges && (
                                <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
                                    <Circle className="h-2 w-2 fill-current animate-pulse" />
                                    <span className="hidden sm:inline">Unsaved changes</span>
                                </div>
                            )}
                            {isEditMode && slug && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                >
                                    <Link href={`/blogs/${slug}`} target="_blank" className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        <span className="hidden sm:inline">Preview</span>
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Editor Content */}
            {children}

            {/* Floating Save Button */}
            <div
                className={cn(
                    "fixed bottom-6 right-6 z-50 transition-all duration-300",
                    hasChanges ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                )}
            >
                <Button
                    onClick={onSave}
                    disabled={!hasChanges || isSaving}
                    size="lg"
                    className="shadow-lg flex items-center gap-2 min-w-[140px]"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>{isEditMode ? 'Saving...' : 'Creating...'}</span>
                        </>
                    ) : (
                        <>
                            <Save className="h-5 w-5" />
                            <span>{isEditMode ? 'Save Changes' : 'Create Blog'}</span>
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
