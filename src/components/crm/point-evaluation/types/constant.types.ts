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
    company_id: number;
    company_name: string;
    scores: {
        [pillarId: string]: PillarScores;
    };
}
