import { Pillar, Category, FactorConfig, ScoreResult, ScoresData } from '@/components/crm/point-evaluation/types/constant.types';

export const useScoreCalculations = (scoresData: ScoresData | null) => {
    /**
     * Calculate the total and maximum possible score for a category
     */
    const calculateCategoryScore = (
        pillarId: string,
        categoryId: string,
        factors: Record<string, FactorConfig>
    ): ScoreResult => {
        if (!scoresData) return { total: 0, maxTotal: 0 };

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

    return { calculateCategoryScore, calculatePillarScore };
};
