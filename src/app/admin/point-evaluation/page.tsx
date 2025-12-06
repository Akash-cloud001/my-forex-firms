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
import { useEvalFirmDetails, useEvaluateFirm } from '@/hooks/admin/query/useEvalFirm'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

function PointEvaluationPage() {
    const { data: firmList, isLoading, isError, error } = useEvalFirmDetails()
    const { mutate: evaluateFirm, isPending: isEvaluating } = useEvaluateFirm();

    console.log("🚀 ~ PointEvaluationPage ~ firmList:", firmList)

    const handleEvaluateClick = (firmId: string) => {
        evaluateFirm(firmId, {
            onSuccess: (data) => {
                toast("Evaluation successful!");
                console.log("Evaluation result:", data);
            },
            onError: (error) => {
                console.error("Error evaluating firm:", error);
                toast("Evaluation failed: " + (error instanceof Error ? error.message : "Unknown error"));
            }
        });
    }

    if (isLoading) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading firms...</span>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-destructive">
                            Error loading firms: {error instanceof Error ? error.message : 'Unknown error'}
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Prop Firm Point Evaluation</CardTitle>
                </CardHeader>
                <CardContent>
                    {!firmList || firmList.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">
                            No firms available
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Prop Firm Name</TableHead>
                                    <TableHead>Evaluated at</TableHead>
                                    <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {firmList?.map((firm) => (
                                    <TableRow key={firm.id}>
                                        <TableCell className="font-medium">{firm.name}</TableCell>

                                        <TableCell>
                                            {firm.evaluatedAt
                                                ? new Date(firm.evaluatedAt).toLocaleString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                                : "-"}
                                        </TableCell>

                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {!firm.isEvaluated && (
                                                    <Button size="sm" onClick={() => handleEvaluateClick(firm.id)} disabled={isEvaluating}>
                                                        {isEvaluating ? "Evaluating..." : "Evaluate Point"}
                                                    </Button>
                                                )}

                                                {firm.isEvaluated && (
                                                    <Link href={`/admin/point-evaluation/${firm.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            View More
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default PointEvaluationPage