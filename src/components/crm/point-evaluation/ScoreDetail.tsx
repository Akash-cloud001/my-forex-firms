"use client"

import React, { useState } from 'react';
import { pillarsConfig } from '@/components/crm/point-evaluation/types/constant';
import { ExpandedCategories, Pillar } from '@/components/crm/point-evaluation/types/constant.types';
import { useScoreData } from './hooks/useScoreData';
import { useScoreCalculations } from './hooks/useScoreCalculations';
import { useScoreEditing } from './hooks/useScoreEditing';
import ScoreHeader from './components/ScoreHeader';
import PillarItem from './components/PillarItem';

const CompactScoresAdmin: React.FC<{ firmId: string }> = ({ firmId }) => {
    const { scoresData, setScoresData, loading } = useScoreData(firmId);
    const { calculateCategoryScore, calculatePillarScore } = useScoreCalculations(scoresData);
    const {
        editingFactor,
        editValue,
        setEditValue,
        saveEdit,
        cancelEdit,
        setEditingFactor,
        isSaving
    } = useScoreEditing(setScoresData, firmId);

    const [expandedPillar, setExpandedPillar] = useState<string | null>('credibility');
    const [expandedCategories, setExpandedCategories] = useState<ExpandedCategories>({
        physical_legal_presence: true
    });

    const togglePillar = (pillarId: string): void => {
        setExpandedPillar(prev => prev === pillarId ? null : pillarId);
    };

    const toggleCategory = (categoryId: string): void => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading scores...</div>;
    }

    if (!scoresData) {
        return <div className="min-h-screen flex items-center justify-center text-white">No evaluation data found.</div>;
    }

    return (
        <div className="min-h-screen bg-background text-white p-4">
            <div className="max-w-6xl mx-auto">
                <ScoreHeader firmName={scoresData.firmName} ptiScore={scoresData.ptiScore} />

                <div className="space-y-2">
                    {pillarsConfig.map((pillar: Pillar) => (
                        <PillarItem
                            key={pillar.id}
                            pillar={pillar}
                            isExpanded={expandedPillar === pillar.id}
                            togglePillar={togglePillar}
                            calculatePillarScore={calculatePillarScore}
                            calculateCategoryScore={calculateCategoryScore}
                            expandedCategories={expandedCategories}
                            toggleCategory={toggleCategory}
                            scoresData={scoresData}
                            editingFactor={editingFactor}
                            editValue={editValue}
                            setEditValue={setEditValue}
                            saveEdit={saveEdit}
                            cancelEdit={cancelEdit}
                            setEditingFactor={setEditingFactor}
                            isSaving={isSaving}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CompactScoresAdmin;
