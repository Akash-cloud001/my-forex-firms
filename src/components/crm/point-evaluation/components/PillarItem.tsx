import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Pillar, Category, ScoreResult, ExpandedCategories, ScoresData, EditingFactor, FactorConfig } from '@/components/crm/point-evaluation/types/constant.types';
import CategoryItem from './CategoryItem';

interface PillarItemProps {
    pillar: Pillar;
    isExpanded: boolean;
    togglePillar: (id: string) => void;
    calculatePillarScore: (pillar: Pillar) => ScoreResult;
    calculateCategoryScore: (pId: string, cId: string, factors: Record<string, FactorConfig>) => ScoreResult;
    expandedCategories: ExpandedCategories;
    toggleCategory: (id: string) => void;
    scoresData: ScoresData;
    editingFactor: EditingFactor | null;
    editValue: string;
    setEditValue: (value: string) => void;
    saveEdit: () => void;
    cancelEdit: () => void;
    setEditingFactor: React.Dispatch<React.SetStateAction<EditingFactor | null>>;
}

const PillarItem: React.FC<PillarItemProps> = ({
    pillar,
    isExpanded,
    togglePillar,
    calculatePillarScore,
    calculateCategoryScore,
    expandedCategories,
    toggleCategory,
    scoresData,
    editingFactor,
    editValue,
    setEditValue,
    saveEdit,
    cancelEdit,
    setEditingFactor
}) => {
    const { total, maxTotal } = calculatePillarScore(pillar);

    return (
        <Card>
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
                        {pillar.categories.map((category: Category) => (
                            <CategoryItem
                                key={category.id}
                                category={category}
                                pillarId={pillar.id}
                                isExpanded={!!expandedCategories[category.id]}
                                toggleCategory={toggleCategory}
                                calculateCategoryScore={calculateCategoryScore}
                                scoresData={scoresData}
                                editingFactor={editingFactor}
                                editValue={editValue}
                                setEditValue={setEditValue}
                                saveEdit={saveEdit}
                                cancelEdit={cancelEdit}
                                setEditingFactor={setEditingFactor}
                            />
                        ))}
                    </div>
                </>
            )}
        </Card>
    );
};

export default PillarItem;
