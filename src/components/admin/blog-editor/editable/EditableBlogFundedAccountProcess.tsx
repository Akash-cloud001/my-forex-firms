"use client";

import React from 'react';
import { List, ArrowDown } from 'lucide-react';
import AnimatedSection from '@/components/website/AnimatedSection';
import { FundedAccountProcess } from '@/types/firm-review';
import ArrayEditor from '../ArrayEditor';

interface EditableBlogFundedAccountProcessProps {
    fundedAccountProcess: FundedAccountProcess;
    onUpdate: (fundedAccountProcess: FundedAccountProcess) => void;
}

export default function EditableBlogFundedAccountProcess({
    fundedAccountProcess,
    onUpdate,
}: EditableBlogFundedAccountProcessProps) {
    if (!fundedAccountProcess) return null;

    const handleStepsChange = (newSteps: string[]) => {
        onUpdate({ ...fundedAccountProcess, steps: newSteps });
    };

    return (
        <AnimatedSection id="blog-funded-account-process">
            <section id="funded-account-process" className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
                    <List className="h-8 w-8 text-primary" />
                    Step-by-Step: How to Get Funded
                </h2>

                <div className="mb-6">
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Process Steps</label>
                    <ArrayEditor
                        items={fundedAccountProcess.steps || []}
                        onSave={handleStepsChange}
                        placeholder="Add step"
                        addButtonLabel="Add Step"
                    />
                </div>

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


