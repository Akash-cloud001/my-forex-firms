import { EvaluationStep, ProgramFormData } from "./types";

// Challenge Types
export const CHALLENGE_TYPES = {
    ONE_STEP: "1-Step",
    TWO_STEP: "2-Step",
    THREE_STEP: "3-Step",
    INSTANT: "Instant",
} as const;

// Default Nested Rules
const DEFAULT_RULE_SET = {
    stopLoss: { required: false, note: "" },
    eaAllowed: { required: false, note: "" },
    weekendHolding: { required: false, note: "" },
    overnightHolding: { required: false, note: "" },
    newsTrading: { required: false, note: "" },
    copyTrading: { required: false, note: "" },
    consistency: { required: false, note: "" },
    maxRiskPerTrade: { required: false, note: "" },
};

// Default Form Values Aligned to Updated Schema
export const DEFAULT_FORM_VALUES: Partial<ProgramFormData> = {
    type: "",
    name: "",
    evaluationPhases: 0,
    evaluationSteps: [],
    accountSizes: [],
    profitSplit: "",
    payoutFrequency: [{ label: "", percentage: "" }],

    // Global rules for the entire program
    evaluationRule: DEFAULT_RULE_SET,
    fundedRule: DEFAULT_RULE_SET,

    payoutMethods: [],
    timeLimit: "",
    drawdownResetType: "",
};

// Default Evaluation Step Templates Based on Challenge Type
export const DEFAULT_EVALUATION_STEPS: Record<string, EvaluationStep[]> = {
    "1-Step": [
        {
            stepNumber: 1,
            profitTarget: "",
            maxLoss: "",
            dailyLoss: "",
            minTradingDays: 0,
            maxLossType: "static",
        },
    ],
    "2-Step": [
        {
            stepNumber: 1,
            profitTarget: "",
            maxLoss: "",
            dailyLoss: "",
            minTradingDays: 0,
            maxLossType: "static",
        },
        {
            stepNumber: 2,
            profitTarget: "",
            maxLoss: "",
            dailyLoss: "",
            minTradingDays: 0,
            maxLossType: "static",
        },
    ],
    "3-Step": [
        {
            stepNumber: 1,
            profitTarget: "",
            maxLoss: "",
            dailyLoss: "",
            minTradingDays: 0,
            maxLossType: "static",
        },
        {
            stepNumber: 2,
            profitTarget: "",
            maxLoss: "",
            dailyLoss: "",
            minTradingDays: 0,
            maxLossType: "static",
        },
        {
            stepNumber: 3,
            profitTarget: "",
            maxLoss: "",
            dailyLoss: "",
            minTradingDays: 0,
            maxLossType: "static",
        },
    ],
};