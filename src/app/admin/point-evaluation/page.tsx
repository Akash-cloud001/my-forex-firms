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
import { useEvalFirmDetails } from '@/hooks/admin/query/useEvalFirm'

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

        }
    },
    {
        id: 3,
        name: "Beta Capital Firm",
        scores: {

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

    const { data: firms } = useEvalFirmDetails()
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

                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sampleFirms.map((firm) => {

                                return (
                                    <TableRow key={firm.id}>
                                        <TableCell className="font-medium">{firm.name}</TableCell>


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