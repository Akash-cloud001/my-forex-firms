"use client";

import React from 'react';
import { DollarSign, LucideIcon } from 'lucide-react';
import AnimatedSection from '@/components/website/AnimatedSection';
import { PayoutsWithdrawalSection } from '@/types/firm-review';
import EditableField from '../EditableField';
import TiptapEditor from '../TiptapEditor';
import ArrayEditor from '../ArrayEditor';
import { iconMap } from '../IconSelector';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EditableBlogPayoutsWithdrawalProps {
    payoutsWithdrawal: PayoutsWithdrawalSection;
    onUpdate: (payoutsWithdrawal: PayoutsWithdrawalSection) => void;
}

export default function EditableBlogPayoutsWithdrawal({
    payoutsWithdrawal,
    onUpdate,
}: EditableBlogPayoutsWithdrawalProps) {
    if (!payoutsWithdrawal) return null;

    const IconComponent = iconMap[payoutsWithdrawal.icon] || DollarSign;

    const handleFieldChange = (field: keyof PayoutsWithdrawalSection, value: string) => {
        onUpdate({ ...payoutsWithdrawal, [field]: value } as PayoutsWithdrawalSection);
    };

    const handleTitleChange = (newTitle: string) => {
        onUpdate({ ...payoutsWithdrawal, title: newTitle });
    };

    const handlePayoutMethodsChange = (newMethods: string[]) => {
        onUpdate({ ...payoutsWithdrawal, payoutMethods: newMethods });
    };

    return (
        <AnimatedSection id="blog-payouts-withdrawal">
            <section id={payoutsWithdrawal.id} className="mb-12">
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <IconComponent className="h-8 w-8 text-primary" />
                        <div className="flex-1">
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">Title</label>
                            <EditableField
                                value={payoutsWithdrawal.title}
                                onSave={handleTitleChange}
                                className="text-2xl sm:text-3xl font-bold text-foreground capitalize"
                                placeholder="Section Title"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground mb-2 block">Profit Split</Label>
                            <Input
                                value={payoutsWithdrawal.profitSplit}
                                onChange={(e) => handleFieldChange('profitSplit', e.target.value)}
                                placeholder="e.g., 80/20"
                            />
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground mb-2 block">First Payout</Label>
                            <Input
                                value={payoutsWithdrawal.firstPayout}
                                onChange={(e) => handleFieldChange('firstPayout', e.target.value)}
                                placeholder="e.g., After 30 days"
                            />
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground mb-2 block">Subsequent Payouts</Label>
                            <Input
                                value={payoutsWithdrawal.subsequentPayouts}
                                onChange={(e) => handleFieldChange('subsequentPayouts', e.target.value)}
                                placeholder="e.g., Weekly"
                            />
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground mb-2 block">Payout Speed</Label>
                            <Input
                                value={payoutsWithdrawal.payoutSpeed}
                                onChange={(e) => handleFieldChange('payoutSpeed', e.target.value)}
                                placeholder="e.g., 1-3 business days"
                            />
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground mb-2 block">Payout Proof</Label>
                            <Input
                                value={payoutsWithdrawal.payoutProof}
                                onChange={(e) => handleFieldChange('payoutProof', e.target.value)}
                                placeholder="e.g., Verified on website"
                            />
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium text-muted-foreground mb-2 block">Payout Methods</Label>
                        <ArrayEditor
                            items={payoutsWithdrawal.payoutMethods || []}
                            onSave={handlePayoutMethodsChange}
                            placeholder="Add payout method"
                            addButtonLabel="Add Method"
                        />
                    </div>
                    <div>
                        <Label className="text-sm font-medium text-muted-foreground mb-2 block">Notes</Label>
                        <TiptapEditor
                            content={payoutsWithdrawal.notes}
                            onChange={(newValue) => handleFieldChange('notes', newValue)}
                            placeholder="Add important notes..."
                            minHeight="150px"
                        />
                    </div>
                </div>
            </section>
        </AnimatedSection>
    );
}

