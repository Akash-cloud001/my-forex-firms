// ============================================================================
// TypeScript Type Definitions for Point Evaluation Constants
// ============================================================================

export interface Criterion {
    label: string;
    value: number;
}

export interface FactorConfig {
    label: string;
    max: number;
    criteria?: Criterion[];
}

export interface CategoryFactors {
    [key: string]: FactorConfig;
}

export interface Category {
    id: string;
    name: string;
    factors: CategoryFactors;
}

export interface Pillar {
    id: string;
    name: string;
    categories: Category[];
}

export interface CategoryScores {
    [factorKey: string]: number;
}

export interface PillarScores {
    [categoryId: string]: CategoryScores;
}

export interface ScoresData {
    firmId: string;
    firmName: string;
    evaluatedAt: Date;
    isEvaluated: boolean;
    ptiScore?: number;
    scores: {
        [pillarId: string]: PillarScores;
    };
}

export interface EditingFactor {
    pillarId: string;
    categoryId: string;
    factorKey: string;
    maxValue: number;
}

export interface ScoreResult {
    total: number;
    maxTotal: number;
}

export interface ExpandedCategories {
    [categoryId: string]: boolean;
}

