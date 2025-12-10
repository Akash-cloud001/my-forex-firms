import * as z from "zod";

// Reusable rule schema
const ruleSchema = z.object({
    required: z.boolean().default(false),
    note: z.string().optional(),
});

export const evaluationStepSchema = z.object({
    stepNumber: z.number().min(1),
    profitTarget: z.string().min(1, "Profit target is required"),
    maxLoss: z.string().min(1, "Max Loss is required"),
    dailyLoss: z.string().min(1, "Daily Loss is required"),
    minTradingDays: z.number().min(0).optional(),
    maxLossType: z.enum(["trailing", "static"], {
        message: "Max Loss Type must be either 'trailing' or 'static'",
    }),
});

export const accountSizeSchema = z.object({
    size: z.number().min(1, "Size must be greater than 0"),
    price: z.number().min(0, "Price must be positive"),
});

export const payoutFrequencySchema = z.object({
    label: z.string().min(1, "Label is required"),
    percentage: z.string().min(1, "Percentage is required"),
});

export const tradingRuleSetSchema = z.object({
    stopLoss: ruleSchema,
    eaAllowed: ruleSchema,
    weekendHolding: ruleSchema,
    overnightHolding: ruleSchema,
    newsTrading: ruleSchema,
    copyTrading: ruleSchema,
    consistency: ruleSchema,
    maxRiskPerTrade: ruleSchema,
});
export const fundedCriteriaSchema = z.object({
    profitTarget: z.string().min(1, "Profit target is required"),
    maxLoss: z.string().min(1, "Max Loss is required"),
    dailyLoss: z.string().min(1, "Daily Loss is required"),
    minTradingDays: z.number().min(0).optional(),
    maxLossType: z.enum(["trailing", "static"], {
        message: "Max Loss Type must be either 'trailing' or 'static'",
    }),
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
    minPayout: z.string().min(1, "Min payout is required"),
    evaluationRule: tradingRuleSetSchema,
    fundedRule: tradingRuleSetSchema,
    fundedCriteria: fundedCriteriaSchema,
    payoutMethods: z.array(z.string()).min(1, "At least one payout method required"),
    timeLimit: z.string().optional(),
    drawdownResetType: z.string().optional(),
});

// Export TS types
export type EvaluationStep = z.infer<typeof evaluationStepSchema>;
export type AccountSize = z.infer<typeof accountSizeSchema>;
export type PayoutFrequency = z.infer<typeof payoutFrequencySchema>;
export type TradingRuleSet = z.infer<typeof tradingRuleSetSchema>;
export type ProgramFormData = z.infer<typeof programSchema>;
export type FundedCriteria = z.infer<typeof fundedCriteriaSchema>;

export type ChallengeType = "1-Step" | "2-Step" | "3-Step" | "Instant";
