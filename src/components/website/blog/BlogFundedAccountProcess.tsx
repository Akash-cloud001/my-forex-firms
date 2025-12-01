"use client";

import React from 'react';
import { List, ArrowDown, LucideIcon } from 'lucide-react';
import AnimatedSection from '@/components/website/AnimatedSection';
import { FundedAccountProcess } from '@/types/firm-review';

interface BlogFundedAccountProcessProps {
    fundedAccountProcess: FundedAccountProcess;
}

export default function BlogFundedAccountProcess({ fundedAccountProcess }: BlogFundedAccountProcessProps) {
    if (!fundedAccountProcess) return null;

    return (
        <AnimatedSection id="blog-funded-account-process">
            <section id="funded-account-process" className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
                    <List className="h-8 w-8 text-primary" />
                    Step-by-Step: How to Get Funded
                </h2>

                {/* Horizontal Cards Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    {fundedAccountProcess.steps && fundedAccountProcess.steps.map((step: string, index: number) => (
                        <div key={index} className="flex items-center gap-4 group">
                            {/* Left: Step Badge */}
                            <div className="flex-shrink-0 flex items-center">
                                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/15 group-hover:border-primary/40 transition-all">
                                    <span className="text-sm font-bold text-primary">{index + 1}</span>
                                </div>
                                {/* Arrow - Only if not last step */}
                                {index < fundedAccountProcess.steps.length  && (
                                    <div className="hidden lg:flex mx-3 text-primary/30">
                                        <ArrowDown className="h-5 w-5 rotate-90" />
                                    </div>
                                )}
                            </div>

                            {/* Right: Step Text */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-foreground leading-relaxed">
                                    {step}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Progress Indicator */}
                <div className="mt-8 pt-6 border-t border-border">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Total Steps: {fundedAccountProcess.steps.length}</span>
                        <span className="text-primary font-semibold">Follow all steps to get funded</span>
                    </div>
                </div>
            </section>
        </AnimatedSection>
    );
}
