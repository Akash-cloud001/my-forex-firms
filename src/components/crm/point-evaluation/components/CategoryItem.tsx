import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Category, FactorConfig, ScoreResult, ScoresData, EditingFactor } from '@/components/crm/point-evaluation/types/constant.types';
import FactorItem from './FactorItem';

interface CategoryItemProps {
    category: Category;
    pillarId: string;
    isExpanded: boolean;
    toggleCategory: (id: string) => void;
    calculateCategoryScore: (pId: string, cId: string, factors: Record<string, FactorConfig>) => ScoreResult;
    scoresData: ScoresData;
    editingFactor: EditingFactor | null;
    editValue: string;
    setEditValue: (value: string) => void;
    saveEdit: () => void;
    cancelEdit: () => void;
    setEditingFactor: React.Dispatch<React.SetStateAction<EditingFactor | null>>;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
    category,
    pillarId,
    isExpanded,
    toggleCategory,
    calculateCategoryScore,
    scoresData,
    editingFactor,
    editValue,
    setEditValue,
    saveEdit,
    cancelEdit,
    setEditingFactor
}) => {
    const { total: catTotal, maxTotal: catMax } = calculateCategoryScore(pillarId, category.id, category.factors);
    const categoryData = scoresData.scores[pillarId]?.[category.id] || {};
    console.log("🚀 ~ CategoryItem ~ categoryData:", categoryData)

    return (
        <div>
            {/* Category Header */}
            <div
                className="flex items-center justify-between p-3 pl-8 cursor-pointer hover:bg-accent/50 text-sm"
                onClick={() => toggleCategory(category.id)}
            >
                <div className="flex items-center gap-2">
                    {isExpanded ? (
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
            {isExpanded && (
                <div className="px-3 py-2 pl-12 space-y-3 bg-accent/20">
                    {Object.entries(category.factors).map(([key, config]) => {
                        const score = categoryData[key] || 0;
                        const isEditing =
                            editingFactor?.pillarId === pillarId &&
                            editingFactor?.categoryId === category.id &&
                            editingFactor?.factorKey === key;

                        return (
                            <FactorItem
                                key={key}
                                config={config}
                                score={score}
                                isEditing={isEditing}
                                editValue={editValue}
                                setEditValue={setEditValue}
                                saveEdit={saveEdit}
                                cancelEdit={cancelEdit}
                                onEditClick={(e) => {
                                    e.stopPropagation();
                                    setEditingFactor({
                                        pillarId: pillarId,
                                        categoryId: category.id,
                                        factorKey: key,
                                        maxValue: config.max
                                    });
                                    setEditValue(score.toString());
                                }}
                            />
                        );
                    })}
                </div>
            )}
            <Separator />
        </div>
    );
};

export default CategoryItem;
