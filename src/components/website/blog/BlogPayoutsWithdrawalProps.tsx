"use client";

import React from 'react';
import { DollarSign, LucideIcon } from 'lucide-react';
import AnimatedSection from '@/components/website/AnimatedSection';
import { PayoutsWithdrawalSection } from '@/types/firm-review';

interface BlogPayoutsWithdrawalProps {
    payoutsWithdrawal: PayoutsWithdrawalSection;
    iconMap: Record<string, LucideIcon>;
}

export default function BlogPayoutsWithdrawal({ payoutsWithdrawal, iconMap }: BlogPayoutsWithdrawalProps) {
    if (!payoutsWithdrawal) return null;

    const IconComponent = iconMap[payoutsWithdrawal.icon] || DollarSign;

    return (
        <AnimatedSection id="blog-payouts-withdrawal">
            <section id={payoutsWithdrawal.id} className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 flex items-center gap-3 capitalize">
                    <IconComponent className="h-8 w-8 text-primary" />
                    {payoutsWithdrawal.title}
                </h2>

                {/* Main Payout Details Table */}
                <div className="overflow-x-auto mb-8">
                    <table className="w-full border-collapse text-foreground text-xs md:text-base">
                        <tbody>
                            {/* Profit Split */}
                            <tr className="border-b border-border">
                                <td className="py-4 px-4 sm:px-6 font-medium text-foreground capitalize">Profit Split</td>
                                <td className="py-4 px-4 sm:px-6 text-right text-green-400 font-semibold">
                                    {payoutsWithdrawal.profitSplit}
                                </td>
                            </tr>

                            {/* First Payout */}
                            <tr className="border-b border-border bg-accent/5">
                                <td className="py-4 px-4 sm:px-6 font-medium text-foreground">First Payout</td>
                                <td className="py-4 px-4 sm:px-6 text-right text-blue-400 font-semibold">
                                    {payoutsWithdrawal.firstPayout}
                                </td>
                            </tr>

                            {/* Subsequent Payouts */}
                            <tr className="border-b border-border">
                                <td className="py-4 px-4 sm:px-6 font-medium text-foreground">Subsequent Payouts</td>
                                <td className="py-4 px-4 sm:px-6 text-right text-purple-400 font-semibold">
                                    {payoutsWithdrawal.subsequentPayouts}
                                </td>
                            </tr>

                            {/* Payout Speed */}
                            <tr className="border-b border-border bg-accent/5">
                                <td className="py-4 px-4 sm:px-6 font-medium text-foreground">Payout Speed</td>
                                <td className="py-4 px-4 sm:px-6 text-right text-orange-400 font-semibold">
                                    {payoutsWithdrawal.payoutSpeed}
                                </td>
                            </tr>

                            {/* Payout Methods */}
                            {payoutsWithdrawal.payoutMethods && payoutsWithdrawal.payoutMethods.length > 0 && (
                                <tr className="border-b border-border">
                                    <td className="py-4 px-4 sm:px-6 font-medium text-foreground">Payout Methods</td>
                                    <td className="py-4 px-4 sm:px-6">
                                        <div className="flex flex-wrap gap-2 justify-end">
                                            {payoutsWithdrawal.payoutMethods.map((method: string, index: number) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-primary/20 text-primary text-xs sm:text-sm font-medium rounded-full border border-primary/30"
                                                >
                                                    {method}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {/* Payout Proof */}
                            <tr className="border-b border-border bg-accent/5">
                                <td className="py-4 px-4 sm:px-6 font-medium text-foreground">Payout Proof</td>
                                <td className="py-4 px-4 sm:px-6 text-right text-muted-foreground text-xs md:text-base">
                                    {payoutsWithdrawal.payoutProof}
                                </td>
                            </tr>

                            {/* Important Notes */}
                            {payoutsWithdrawal.notes && (
                                <tr className="bg-accent/5">
                                    <td colSpan={2} className="py-4 px-4 sm:px-6">
                                        <p className="text-xs md:text-base text-muted-foreground italic">
                                            📌 <span className="font-medium">{payoutsWithdrawal.notes}</span>
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </AnimatedSection>
    );
}
