"use client"

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Edit2, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { initialScoresData, pillarsConfig } from '@/components/crm/point-evaluation/types/constant';
import type { Pillar, Category, FactorConfig as ImportedFactorConfig } from '@/components/crm/point-evaluation/types/constant.types';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

interface Criterion {
    label: string;
    value: number;
}

interface FactorConfig {
    label: string;
    max: number;
    criteria?: Criterion[];
}

interface CategoryScores {
    [factorKey: string]: number;
}

interface PillarScores {
    [categoryId: string]: CategoryScores;
}

interface ScoresData {
    company_id: number;
    company_name: string;
    scores: {
        [pillarId: string]: PillarScores;
    };
}

interface EditingFactor {
    pillarId: string;
    categoryId: string;
    factorKey: string;
    maxValue: number;
}

interface ScoreResult {
    total: number;
    maxTotal: number;
}

interface ExpandedCategories {
    [categoryId: string]: boolean;
}

// ============================================================================
// Component
// ============================================================================

const CompactScoresAdmin: React.FC<{ firmId: string }> = ({ firmId }) => {
    const [scoresData, setScoresData] = useState<ScoresData>(initialScoresData);
    const [loading, setLoading] = useState(true);
    const [expandedPillar, setExpandedPillar] = useState<string | null>('credibility');
    const [expandedCategories, setExpandedCategories] = useState<ExpandedCategories>({
        physical_legal_presence: true
    });
    const [editingFactor, setEditingFactor] = useState<EditingFactor | null>(null);
    const [editValue, setEditValue] = useState<string>('');

    React.useEffect(() => {
        const fetchScores = async () => {
            try {
                const res = await fetch('/api/admin/point-eval', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ firmId })
                });
                if (res.ok) {
                    const data = await res.json();
                    setScoresData(data);
                }
            } catch (error) {
                console.error("Failed to fetch scores", error);
            } finally {
                setLoading(false);
            }
        };

        if (firmId) {
            fetchScores();
        }
    }, [firmId]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading scores...</div>;
    }

    /**
     * Calculate the total and maximum possible score for a category
     */
    const calculateCategoryScore = (
        pillarId: string,
        categoryId: string,
        factors: Record<string, FactorConfig>
    ): ScoreResult => {
        const categoryData = scoresData.scores[pillarId]?.[categoryId] || {};
        let total = 0;
        let maxTotal = 0;

        Object.entries(factors).forEach(([key, config]) => {
            total += categoryData[key] || 0;
            maxTotal += config.max;
        });

        return { total, maxTotal };
    };

    /**
     * Calculate the total and maximum possible score for a pillar
     */
    const calculatePillarScore = (pillar: Pillar): ScoreResult => {
        let total = 0;
        let maxTotal = 0;

        pillar.categories.forEach((cat: Category) => {
            const { total: catTotal, maxTotal: catMax } = calculateCategoryScore(
                pillar.id,
                cat.id,
                cat.factors
            );
            total += catTotal;
            maxTotal += catMax;
        });

        return { total, maxTotal };
    };

    /**
     * Update a specific score value
     */
    const updateScore = (
        pillarId: string,
        categoryId: string,
        factorKey: string,
        value: number
    ): void => {
        setScoresData(prev => ({
            ...prev,
            scores: {
                ...prev.scores,
                [pillarId]: {
                    ...prev.scores[pillarId],
                    [categoryId]: {
                        ...prev.scores[pillarId][categoryId],
                        [factorKey]: value
                    }
                }
            }
        }));
    };

    /**
     * Save the edited score value
     */
    const saveEdit = (): void => {
        if (!editingFactor) return;

        const { pillarId, categoryId, factorKey, maxValue } = editingFactor;
        const newValue = parseFloat(editValue);

        if (isNaN(newValue) || newValue < 0 || newValue > maxValue) {
            alert(`Enter value between 0 and ${maxValue}`);
            return;
        }

        updateScore(pillarId, categoryId, factorKey, newValue);
        setEditingFactor(null);
        setEditValue('');
    };

    /**
     * Cancel editing
     */
    const cancelEdit = (): void => {
        setEditingFactor(null);
        setEditValue('');
    };

    /**
     * Toggle pillar expansion
     */
    const togglePillar = (pillarId: string): void => {
        setExpandedPillar(prev => prev === pillarId ? null : pillarId);
    };

    /**
     * Toggle category expansion
     */
    const toggleCategory = (categoryId: string): void => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    return (
        <div className="min-h-screen bg-background text-white p-4">
            <div className="max-w-6xl mx-auto">
                {/* Company Header */}
                <Card className="mb-4">
                    <CardHeader className="p-4">
                        <h1 className="text-xl font-semibold">{scoresData.company_name}</h1>
                    </CardHeader>
                </Card>

                {/* Pillars */}
                <div className="space-y-2">
                    {pillarsConfig.map((pillar: Pillar) => {
                        const { total, maxTotal } = calculatePillarScore(pillar);
                        const isExpanded = expandedPillar === pillar.id;

                        return (
                            <Card key={pillar.id}>
                                {/* Pillar Header */}
                                <div
                                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-accent hover:rounded-lg"
                                    onClick={() => togglePillar(pillar.id)}
                                >
                                    <div className="flex items-center gap-2">
                                        {isExpanded ? (
                                            <ChevronDown size={16} />
                                        ) : (
                                            <ChevronRight size={16} />
                                        )}
                                        <h2 className="font-semibold text-sm">{pillar.name}</h2>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium">
                                            {total.toFixed(1)} / {maxTotal.toFixed(1)}
                                        </span>
                                        <div className="w-20 h-1.5 bg-muted rounded-full">
                                            <div
                                                className="h-full bg-primary rounded-full"
                                                style={{ width: `${(total / maxTotal) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Categories */}
                                {isExpanded && (
                                    <>
                                        <Separator />
                                        <div>
                                            {pillar.categories.map((category: Category) => {
                                                const { total: catTotal, maxTotal: catMax } =
                                                    calculateCategoryScore(pillar.id, category.id, category.factors);
                                                const isCatExpanded = expandedCategories[category.id];
                                                const categoryData = scoresData.scores[pillar.id]?.[category.id] || {};

                                                return (
                                                    <div key={category.id}>
                                                        {/* Category Header */}
                                                        <div
                                                            className="flex items-center justify-between p-3 pl-8 cursor-pointer hover:bg-accent/50 text-sm"
                                                            onClick={() => toggleCategory(category.id)}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {isCatExpanded ? (
                                                                    <ChevronDown size={14} />
                                                                ) : (
                                                                    <ChevronRight size={14} />
                                                                )}
                                                                <span className="font-medium">{category.name}</span>
                                                            </div>
                                                            <span className="text-xs">
                                                                {catTotal.toFixed(1)} / {catMax.toFixed(1)}
                                                            </span>
                                                        </div>

                                                        {/* Factors */}
                                                        {isCatExpanded && (
                                                            <div className="px-3 py-2 pl-12 space-y-3 bg-accent/20">
                                                                {Object.entries(category.factors).map(([key, config]: [string, ImportedFactorConfig]) => {
                                                                    const score = categoryData[key] || 0;
                                                                    const isEditing =
                                                                        editingFactor?.pillarId === pillar.id &&
                                                                        editingFactor?.categoryId === category.id &&
                                                                        editingFactor?.factorKey === key;

                                                                    return (
                                                                        <div key={key} className="py-2 border-b last:border-b-0">
                                                                            {/* Factor Header with Score */}
                                                                            <div className="flex items-center justify-between mb-2">
                                                                                <span className="text-xs font-medium flex-1">
                                                                                    {config.label}
                                                                                </span>
                                                                                <div className="flex items-center gap-2">
                                                                                    {isEditing ? (
                                                                                        <>
                                                                                            <Input
                                                                                                type="number"
                                                                                                step="0.1"
                                                                                                value={editValue}
                                                                                                onChange={(e) => setEditValue(e.target.value)}
                                                                                                className="w-16 h-7 text-xs"
                                                                                                autoFocus
                                                                                                onKeyDown={(e) => {
                                                                                                    if (e.key === 'Enter') saveEdit();
                                                                                                    if (e.key === 'Escape') cancelEdit();
                                                                                                }}
                                                                                            />
                                                                                            <Button
                                                                                                size="sm"
                                                                                                variant="ghost"
                                                                                                className="h-7 w-7 p-0"
                                                                                                onClick={saveEdit}
                                                                                            >
                                                                                                <Check size={14} className="text-green-600" />
                                                                                            </Button>
                                                                                            <Button
                                                                                                size="sm"
                                                                                                variant="ghost"
                                                                                                className="h-7 w-7 p-0"
                                                                                                onClick={cancelEdit}
                                                                                            >
                                                                                                <X size={14} className="text-red-600" />
                                                                                            </Button>
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            <span className="text-xs font-semibold">
                                                                                                {score.toFixed(1)}/{config.max.toFixed(1)}
                                                                                            </span>
                                                                                            <Button
                                                                                                size="sm"
                                                                                                variant="ghost"
                                                                                                className="h-7 w-7 p-0"
                                                                                                onClick={(e) => {
                                                                                                    e.stopPropagation();
                                                                                                    setEditingFactor({
                                                                                                        pillarId: pillar.id,
                                                                                                        categoryId: category.id,
                                                                                                        factorKey: key,
                                                                                                        maxValue: config.max
                                                                                                    });
                                                                                                    setEditValue(score.toString());
                                                                                                }}
                                                                                            >
                                                                                                <Edit2 size={12} />
                                                                                            </Button>
                                                                                        </>
                                                                                    )}
                                                                                </div>
                                                                            </div>

                                                                            {/* Criteria Options */}
                                                                            {config.criteria && config.criteria.length > 0 && (
                                                                                <div className="space-y-1">
                                                                                    {config.criteria.map((criterion: Criterion, idx: number) => (
                                                                                        <div
                                                                                            key={idx}
                                                                                            className={`text-xs px-2 py-1 rounded ${Math.abs(score - criterion.value) < 0.01
                                                                                                ? 'bg-primary/20 text-primary font-medium'
                                                                                                : 'text-muted-foreground bg-accent/30'
                                                                                                }`}
                                                                                        >
                                                                                            <span className="font-mono">
                                                                                                {criterion.value.toFixed(1)}
                                                                                            </span>{' '}
                                                                                            - {criterion.label}
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                        <Separator />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CompactScoresAdmin;
