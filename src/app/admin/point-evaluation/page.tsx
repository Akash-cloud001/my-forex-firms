"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { pillarsConfig, initialScoresData } from '@/components/crm/point-evaluation/types/constant'
import type { PillarScores, Pillar, Category, FactorConfig } from '@/components/crm/point-evaluation/types/constant.types'

const sampleFirms = [
    {
        id: 1,
        name: "Demo Prop Firm",
        scores: initialScoresData.scores
    },
    {
        id: 2,
        name: "Alpha Trading Firm",
        scores: {
            credibility: {
                physical_legal_presence: {
                    registered_company: 1,
                    physical_office: 1,
                    dashboard_friendlyness: 1,
                },
                public_identity_transparency: {
                    public_ceo_founder: 1,
                    support_quality: 0.8,
                    terms_clarity: 1,
                    brocker_backed: 0.3,
                },
                social_community_presence: {
                    active_social: 0.5,
                    transparent_comm: 0.5,
                },
                trust_signals_history: {
                    verified_payouts: 0.5,
                    lifetime_payouts: 1.2,
                    no_controversies: 0.5,
                    consistent_ops: 0.5,
                }
            },
            trading_experience: {
                trading_conditions: {
                    fair_spreads: 1,
                    fair_commissions: 1,
                    acceptable_slippage: 1,
                    multiple_trading_platforms: 1,
                },
                trading_freedom: {
                    profit_targets: 1,
                    consistancy_rule: 1,
                    news_trading: 1,
                },
                rules_fairness: {
                    lavrage_margin_rule: 1,
                    no_hidden_restrictions_stratgy: 1,
                    dd_type: 1,
                }
            },
            payout_payment_experience: {
                payout_reliability: {
                    no_payout_denial_policy: 1,
                    payout_cycle: 1,
                    single_highest_payout: 1,
                },
                payout_behavior: {
                    payout_time: 2,
                    flexible_payout_methods: 1,
                    payout_denials: 1,
                },
                payout_payment_structure: {
                    fair_profit_split: 1,
                    flexible_payment_methods: 1,
                    reasonable_minimum_payout_requiremnts: 1,
                }
            }
        }
    },
    {
        id: 3,
        name: "Beta Capital Firm",
        scores: {
            credibility: {
                physical_legal_presence: {
                    registered_company: 0,
                    physical_office: 0,
                    dashboard_friendlyness: 0.5,
                },
                public_identity_transparency: {
                    public_ceo_founder: 0,
                    support_quality: 0.5,
                    terms_clarity: 0.7,
                    brocker_backed: 0,
                },
                social_community_presence: {
                    active_social: 0.25,
                    transparent_comm: 0.1,
                },
                trust_signals_history: {
                    verified_payouts: 0.3,
                    lifetime_payouts: 0.5,
                    no_controversies: 0.25,
                    consistent_ops: 0.2,
                }
            },
            trading_experience: {
                trading_conditions: {
                    fair_spreads: 0.7,
                    fair_commissions: 0.7,
                    acceptable_slippage: 0.7,
                    multiple_trading_platforms: 0.8,
                },
                trading_freedom: {
                    profit_targets: 0.7,
                    consistancy_rule: 0.7,
                    news_trading: 0.5,
                },
                rules_fairness: {
                    lavrage_margin_rule: 0.5,
                    no_hidden_restrictions_stratgy: 0.7,
                    dd_type: 0.5,
                }
            },
            payout_payment_experience: {
                payout_reliability: {
                    no_payout_denial_policy: 0.7,
                    payout_cycle: 0.7,
                    single_highest_payout: 0.5,
                },
                payout_behavior: {
                    payout_time: 0.5,
                    flexible_payout_methods: 0.7,
                    payout_denials: 0.5,
                },
                payout_payment_structure: {
                    fair_profit_split: 0.8,
                    flexible_payment_methods: 0.8,
                    reasonable_minimum_payout_requiremnts: 0.7,
                }
            }
        }
    }
]

// Calculate pillar score based on the pillar configuration
const calculatePillarScore = (scores: PillarScores, pillarConfig: Pillar) => {
    let total = 0
    let maxTotal = 0

    pillarConfig.categories.forEach((category: Category) => {
        const categoryData = scores[category.id] || {}

        Object.entries(category.factors).forEach(([key, config]: [string, FactorConfig]) => {
            total += categoryData[key] || 0
            maxTotal += config.max
        })
    })

    return { total, maxTotal }
}

function PointEvaluationPage() {
    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Prop Firm Point Evaluation</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Prop Firm Name</TableHead>
                                <TableHead className="text-center">Credibility & Transparency</TableHead>
                                <TableHead className="text-center">Trading Experience</TableHead>
                                <TableHead className="text-center">Payout/Payment Experience</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sampleFirms.map((firm) => {
                                const credibilityPillar = pillarsConfig.find(p => p.id === 'credibility')
                                const tradingPillar = pillarsConfig.find(p => p.id === 'trading_experience')
                                const payoutPillar = pillarsConfig.find(p => p.id === 'payout_payment_experience')

                                const credibilityScore = credibilityPillar
                                    ? calculatePillarScore(firm.scores.credibility, credibilityPillar)
                                    : { total: 0, maxTotal: 0 }

                                const tradingScore = tradingPillar
                                    ? calculatePillarScore(firm.scores.trading_experience, tradingPillar)
                                    : { total: 0, maxTotal: 0 }

                                const payoutScore = payoutPillar
                                    ? calculatePillarScore(firm.scores.payout_payment_experience, payoutPillar)
                                    : { total: 0, maxTotal: 0 }

                                return (
                                    <TableRow key={firm.id}>
                                        <TableCell className="font-medium">{firm.name}</TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-sm font-semibold">
                                                    {credibilityScore.total.toFixed(1)} / {credibilityScore.maxTotal.toFixed(1)}
                                                </span>
                                                <div className="w-full h-2 bg-muted rounded-full">
                                                    <div
                                                        className="h-full bg-primary rounded-full"
                                                        style={{
                                                            width: `${(credibilityScore.total / credibilityScore.maxTotal) * 100}%`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-sm font-semibold">
                                                    {tradingScore.total.toFixed(1)} / {tradingScore.maxTotal.toFixed(1)}
                                                </span>
                                                <div className="w-full h-2 bg-muted rounded-full">
                                                    <div
                                                        className="h-full bg-primary rounded-full"
                                                        style={{
                                                            width: `${(tradingScore.total / tradingScore.maxTotal) * 100}%`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-sm font-semibold">
                                                    {payoutScore.total.toFixed(1)} / {payoutScore.maxTotal.toFixed(1)}
                                                </span>
                                                <div className="w-full h-2 bg-muted rounded-full">
                                                    <div
                                                        className="h-full bg-primary rounded-full"
                                                        style={{
                                                            width: `${(payoutScore.total / payoutScore.maxTotal) * 100}%`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Link href={`/admin/point-evaluation/${firm.id}`}>
                                                <Button variant="outline" size="sm">
                                                    View More
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default PointEvaluationPage