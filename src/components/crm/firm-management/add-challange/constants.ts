import { EvaluationStep, ProgramFormData, TradingRule } from "./types";

// Challenge Types
export const CHALLENGE_TYPES = {
    ONE_STEP: "1-Step",
    TWO_STEP: "2-Step",
    THREE_STEP: "3-Step",
    INSTANT: "Instant",
} as const;

// Default Form Values
export const DEFAULT_FORM_VALUES: Partial<ProgramFormData> = {
    type: "",
    name: "",
    evaluationPhases: 0,
    evaluationSteps: [],
    accountSizes: [],
    profitSplit: "",
    payoutFrequency: [{ label: "", percentage: "" }],
    leverage: "",
    stopLossRequired: false,
    eaAllowed: false,
    weekendHolding: false,
    overnightHolding: false,
    newsTrading: false,
    copyTrading: false,
    refundFee: false,
    payoutMethods: [],
    minTradingDays: 0,
};

export const DEFAULT_EVALUATION_STEPS: Record<string, EvaluationStep[]> = {
    "1-Step": [
        {
            stepNumber: 1,
            profitTarget: "",
            maxLoss: "",
            dailyLoss: "",
            minTradingDays: 0,
        },
    ],
    "2-Step": [
        {
            stepNumber: 1,
            profitTarget: "",
            maxLoss: "",
            dailyLoss: "",
            minTradingDays: 0,
        },
        {
            stepNumber: 2,
            profitTarget: "",
            maxLoss: "",
            dailyLoss: "",
            minTradingDays: 0,
        },
    ],
    "3-Step": [
        {
            stepNumber: 1,
            profitTarget: "",
            maxLoss: "",
            dailyLoss: "",
            minTradingDays: 0,
        },
        {
            stepNumber: 2,
            profitTarget: "",
            maxLoss: "",
            dailyLoss: "",
            minTradingDays: 0,
        },
        {
            stepNumber: 3,
            profitTarget: "",
            maxLoss: "",
            dailyLoss: "",
            minTradingDays: 0,
        },
    ],
};

// Trading Rules Configuration
export const TRADING_RULES: TradingRule[] = [
    { name: "stopLossRequired", label: "Stop Loss Required" },
    { name: "eaAllowed", label: "Expert Advisors (EA) Allowed" },
    { name: "weekendHolding", label: "Weekend Position Holding" },
    { name: "overnightHolding", label: "Overnight Position Holding" },
    { name: "newsTrading", label: "News Trading Allowed" },
    { name: "copyTrading", label: "Copy Trading Allowed" },
    { name: "refundFee", label: "Refundable Fee" },

];
