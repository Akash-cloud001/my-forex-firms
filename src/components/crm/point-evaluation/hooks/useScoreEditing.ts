import { useState } from 'react';
import { EditingFactor, ScoresData } from '@/components/crm/point-evaluation/types/constant.types';

export const useScoreEditing = (
    setScoresData: React.Dispatch<React.SetStateAction<ScoresData | null>>,
    firmId: string
) => {
    const [editingFactor, setEditingFactor] = useState<EditingFactor | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const [isSaving, setIsSaving] = useState<boolean>(false);
    /**
     * Update a specific score value
     */
    const updateScore = (
        pillarId: string,
        categoryId: string,
        factorKey: string,
        value: number
    ): void => {
        setScoresData(prev => {
            if (!prev) return null;
            return {
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
            };
        });
    };

    /**
     * Save the edited score value
     */
    const saveEdit = async (): Promise<void> => {
        if (!editingFactor) return;

        const { pillarId, categoryId, factorKey, maxValue } = editingFactor;
        const newValue = parseFloat(editValue);

        if (isNaN(newValue) || newValue < 0 || newValue > maxValue) {
            alert(`Enter value between 0 and ${maxValue}`);
            return;
        }

        try {
            setIsSaving(true);
            const response = await fetch('/api/admin/point-eval/update-factor', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firmId,
                    pillarId,
                    categoryId,
                    factorKey,
                    value: newValue
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.error || 'Failed to update score');
                return;
            }

            const data = await response.json();

            setScoresData(data.evaluation);
            setEditingFactor(null);
            setEditValue('');
        } catch (error) {
            console.error('Error updating score:', error);
            alert('An error occurred while saving the score');
        } finally {
            setIsSaving(false);
        }
    };

    /**
     * Cancel editing
     */

    const cancelEdit = (): void => {
        setEditingFactor(null);
        setEditValue('');
    };

    return {
        editingFactor,
        setEditingFactor,
        editValue,
        setEditValue,
        saveEdit,
        isSaving,
        cancelEdit
    };
};
