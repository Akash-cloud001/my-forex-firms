"use client";

import React from 'react';
import { Dot, List, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { TableOfContentsItem } from '@/types/firm-review';
import { LucideIcon } from 'lucide-react';

interface BlogTableOfContentsProps {
    tableOfContents: Array<{
        id: string;
        title: string;
        icon: LucideIcon;
    }>;
    activeSection: string;
    isMobileTocOpen: boolean;
    setIsMobileTocOpen: (open: boolean) => void;
    scrollToSection: (sectionId: string) => void;
}

export default function BlogTableOfContents({
    tableOfContents,
    activeSection,
    isMobileTocOpen,
    setIsMobileTocOpen,
    scrollToSection,
}: BlogTableOfContentsProps) {
    return (
        <>
            {/* Desktop Table of Contents - Fixed Sidebar */}
            <div className="min-h-screen z-40 hidden xl:inline-block col-span-3">
                <div className="sticky left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border border-border rounded-lg p-4 w-64 max-h-[70vh] overflow-y-auto">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                        <List className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-foreground text-sm">Table of Contents</span>
                    </div>
                    <nav className="space-y-">
                        {tableOfContents.map((item) => {
                            // const IconComponent = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`w-full flex items-center gap-3 p-2 rounded-md text-left text-xs transition-all duration-200 hover:bg-accent/50 ${
                                        activeSection === item.id
                                            ? 'bg-primary/10 text-primary border-l-2 border-primary'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {/* <IconComponent className="h-4 w-4 shrink-0" /> */}
                                    <Dot className="h-4 w-4 shrink-0" />
                                    <span className="truncate capitalize">{item.title}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Mobile Table of Contents Button */}
            <div className="fixed bottom-16 left-6 z-50 xl:hidden">
                <Button
                    onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
                    size="lg"
                    className="rounded-full h-10 w-10 shadow-lg bg-primary hover:bg-primary/90"
                >
                    {isMobileTocOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
            </div>

            {/* Mobile Table of Contents Overlay */}
            {isMobileTocOpen && (
                <div className="fixed inset-0 z-40 xl:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileTocOpen(false)} />
                    <div className="absolute bottom-20 left-8 bg-background border border-border rounded-lg p-4 w-80 max-h-[60vh] overflow-y-auto shadow-xl max-w-2xs">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                            <List className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-foreground text-sm">Table of Contents</span>
                        </div>
                        <nav className="space-y-2">
                            {tableOfContents.map((item) => {
                                // const IconComponent = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => scrollToSection(item.id)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-md text-left text-xs transition-all duration-200 hover:bg-accent/50 ${
                                            activeSection === item.id
                                                ? 'bg-primary/10 text-primary border-l-2 border-primary'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        {/* <IconComponent className="h-4 w-4 shrink-0" /> */}
                                        <Dot className="h-4 w-4 shrink-0" />
                                        <span className="truncate">{item.title}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}

