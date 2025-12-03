import * as z from "zod";

// Zod Schemas
export const evaluationStepSchema = z.object({
    stepNumber: z.number().min(1),
    profitTarget: z.string().min(1, "Profit target is required"),
    maxLoss: z.string().optional(),
    dailyLoss: z.string().optional(),
    minTradingDays: z.number().optional(),
});

export const accountSizeSchema = z.object({
    size: z.number().min(1, "Size must be greater than 0"),
    price: z.number().min(0, "Price must be positive"),
});

export const payoutFrequencySchema = z.object({
    label: z.string().min(1, "Label is required"),
    percentage: z.string().min(1, "Percentage is required"),
});

export const programSchema = z.object({
    propFirmId: z.string().min(1, "Prop Firm ID is required"),
    type: z.string().min(1, "Type is required"),
    name: z.string().min(1, "Name is required"),
    evaluationPhases: z.number().optional(),
    evaluationSteps: z.array(evaluationStepSchema).optional(),
    accountSizes: z.array(accountSizeSchema).min(1, "At least one account size required"),
    profitSplit: z.string().min(1, "Profit split is required"),
    payoutFrequency: z.array(payoutFrequencySchema).min(1),
    leverage: z.string().min(1, "Leverage is required"),
    stopLossRequired: z.boolean(),
    eaAllowed: z.boolean(),
    weekendHolding: z.boolean(),
    overnightHolding: z.boolean(),
    newsTrading: z.boolean(),
    copyTrading: z.boolean(),
    refundFee: z.boolean(),
    payoutMethods: z
        .array(z.string())
        .min(1, "At least one payout method required"),
    profitTarget: z.string().optional(),
    dailyLoss: z.string().optional(),
    maxLoss: z.string().optional(),
    maxLossType: z.string().optional(),
    timeLimit: z.string().optional(),
    drawdownResetType: z.string().optional(),
    minTradingDays: z.number().optional(),
});

// TypeScript Types
export type EvaluationStep = z.infer<typeof evaluationStepSchema>;
export type AccountSize = z.infer<typeof accountSizeSchema>;
export type PayoutFrequency = z.infer<typeof payoutFrequencySchema>;
export type ProgramFormData = z.infer<typeof programSchema>;

export type ChallengeType = "1-Step" | "2-Step" | "3-Step" | "Instant";

export interface TradingRule {
    name: keyof Pick<ProgramFormData,
        "stopLossRequired" |
        "eaAllowed" |
        "weekendHolding" |
        "overnightHolding" |
        "newsTrading" |
        "copyTrading" |
        "refundFee"
    >;
    label: string;
}
