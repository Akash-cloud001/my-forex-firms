"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Book, FileText } from 'lucide-react';

interface BlogTemplate {
    id: string;
    name: string;
    description: string;
    type: 'review' | 'guide' | 'news' | 'comparison';
    icon: React.ReactNode;
}

interface TemplateSelectionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const templates: BlogTemplate[] = [
    {
        id: 'review-template',
        name: 'Firm Review Template',
        description: 'Comprehensive template for reviewing prop firms, brokers, and trading platforms. Includes overview, pros/cons, comparison tables, and final verdict.',
        type: 'review',
        icon: <FileText className="h-6 w-6" />,
    },
];

export default function TemplateSelectionModal({ open, onOpenChange }: TemplateSelectionModalProps) {
    const router = useRouter();

    const handleTemplateSelect = (templateId: string) => {
        onOpenChange(false);
        router.push(`/admin/blogs/add?template=${templateId}`);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-muted-foreground">
                        Choose a Blog Template
                    </DialogTitle>
                    <DialogDescription>
                        Select a template to start creating your blog post. Each template comes with pre-configured sections.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-4 mt-4">
                    {templates.map((template) => (
                        <Card
                            key={template.id}
                            className="cursor-pointer hover:shadow-md transition-all hover:border-primary border-2"
                            onClick={() => handleTemplateSelect(template.id)}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            {template.icon}
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{template.name}</CardTitle>
                                            <Badge variant="outline" className="mt-1">
                                                {template.type}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* <CardDescription className="text-sm">
                                    {template.description}
                                </CardDescription> */}
                                <Button
                                    className="w-full"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleTemplateSelect(template.id);
                                    }}
                                >
                                    Use This Template
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {templates.length === 0 && (
                    <div className="text-center py-8">
                        <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No templates available</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

