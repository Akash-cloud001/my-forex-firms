import { z } from "zod";

// Step 1: Firm Information Schema
export const firmInformationSchema = z.object({
  firmName: z.string().min(1, "Firm name is required"),
  logoUrl: z.string().optional(),
  logoFile: z.any().optional().nullable(), 
  legalEntityName: z.string().min(1, "Legal entity name is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  jurisdiction: z.string().min(1, "Jurisdiction is required"),
yearFounded: z
  .string()
  .min(1, "Year founded is required")
  .refine(
    (val) => {
      const year = Number(val);
      const currentYear = new Date().getFullYear();
      return !isNaN(year) && year >= 1800 && year <= currentYear;
    },
    { message: "Year must be a valid year and not in the future" }
  ),
   headquartersAddress: z.string().min(1, "Headquarters address is required"),
  ceoFounderName: z.string().min(1, "CEO/Founder name is required"),
  leadershipLinks: z.string().optional(),
  officialWebsite: z.string().url("Must be a valid URL").min(1, "Official website is required"),
  status: z.enum(["active", "paused", "suspended", "closed"]),
  shortDescription: z.string().min(1, "Short description is required"),
  trustPilotRating: z.any(),
});

// Step 2: Trading Platforms Schema
export const tradingPlatformsSchema = z.object({
  tradingPlatforms: z.string().min(1, "Trading platforms are required"),
  dataFeedsLiquidityProviders: z.string().min(1, "Data feeds/liquidity providers are required"),
});

// Step 3: Payout & Financial Schema
export const payoutFinancialSchema = z.object({
  profitSplit: z.string().min(1, "Profit split is required"),
firstPayoutTiming: z.string().min(1, "First payout timing is required"),
  regularPayoutCycle: z.string().min(1, "Regular payout cycle is required"),
  minimumPayoutAmount: z.string().min(1, "Minimum payout amount is required"),
  averagePayoutProcessingTime: z.string().min(1, "Average payout processing time is required"),
  fastestSlowestPayoutDuration: z.string().optional(),
  payoutMethods: z.string().min(1, "Payout methods are required"),
  payoutFeesFxCosts: z.string().optional(),
  totalPayoutsAllTime: z.string().optional(),
  largestSinglePayout: z.string().optional(),
  monthlyPayoutCounts: z.string().optional(),
  payoutProofLinks: z.string().optional(),
});

// Step 4: Challenge Information Schema
export const challengeInformationSchema = z.object({
  challengeInformation: z.array(
    z.object({
      challengeName: z.string().min(1, "Challenge name is required"),
      challengeType: z.enum(["1-step", "2-step",'instant', 'hybrid']),
      accountSizesPricing: z.string().min(1, "Account sizes/pricing is required"),
      profitSplit: z.string().min(1, "Profit split is required"),
      leverageBreakdown: z.string().optional(),
      timeLimits: z.string().optional(),
      minimumTradingDays: z.string().optional(),
      step1Step2Targets: z.string().optional(),
      dailyMaxDrawdown: z.string().min(1, "Daily max drawdown is required"),
      refundTerms: z.string().optional(),
      scalingPlan: z.string().optional(),
      allowedInstruments: z.string().optional(),
      rules: z.string().optional(),
      maxExposureLots: z.string().optional(),
      bonusPromoPolicy: z.string().optional(),
      termsUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
      termsLastUpdated: z.string().optional(),
    })
  ).min(1, "At least one challenge is required"),
});

// Step 5: Trading Environment Schema
export const tradingEnvironmentSchema = z.object({
  typicalSpreads: z.string().min(1, "Typical spreads are required"),
  commissions: z.string().min(1, "Commissions are required"),
  slippageSwapPolicies: z.string().optional(),
  riskDeskModel: z.string().min(1, "Risk desk model is required"),
  copyTradeProviders: z.string().optional(),
  mobileSupport: z.string().optional(),
  newsTrading: z.boolean(),
  weekendHolding: z.boolean(),
  eaUsage: z.boolean(),
  copyTrading: z.boolean(),
  hedging: z.boolean(),
  scalping: z.boolean(),
  newsTradingNotes: z.string().optional(),
  weekendHoldingNotes: z.string().optional(),
  eaUsageNotes: z.string().optional(),
  copyTradingNotes: z.string().optional(),
  hedgingNotes: z.string().optional(),
  scalpingNotes: z.string().optional(),
});

// Step 6: Support & Operations Schema
export const supportOperationsSchema = z.object({
  supportChannels: z.string().min(1, "Support channels are required"),
  averageFirstResponseTime: z.string().min(1, "Average first response time is required"),
  averageResolutionTime: z.string().min(1, "Average resolution time is required"),
  supportHours: z.string().min(1, "Support hours are required"),
  escalationPolicy: z.string().optional(),
  kycRequirements: z.string().min(1, "KYC requirements are required"),
  restrictedCountries: z.string().optional(),
  amlComplianceLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

// Step 7: Transparency & Verification Schema
export const transparencyVerificationSchema = z.object({
  ceoPublic: z.boolean(),
  entityOfficeVerified: z.boolean(),
  termsPublicUpdated: z.boolean(),
  payoutProofsPublic: z.boolean(),
  thirdPartyAudit: z.boolean(),
  transparencyNotes: z.string().optional(),
});

// Step 8: Administration & Audit Schema
export const administrationAuditSchema = z.object({
  dataSource: z.enum(["firm", "mff", "community"]),
  verifiedBy: z.string().min(1, "Verified by is required"),
  verificationDate: z.string().min(1, "Verification date is required"),
  nextReviewDate: z.string().min(1, "Next review date is required"),
  changelogNotes: z.string().optional(),
});

export const firmFormSchema = z.object({
  ...firmInformationSchema.shape,
  ...tradingPlatformsSchema.shape,
  ...payoutFinancialSchema.shape,
  ...challengeInformationSchema.shape,
  ...tradingEnvironmentSchema.shape,
  ...supportOperationsSchema.shape,
  ...transparencyVerificationSchema.shape,
  ...administrationAuditSchema.shape,
});

export const stepSchemas = {
  1: firmInformationSchema,
  2: tradingPlatformsSchema,
  3: payoutFinancialSchema,
  4: challengeInformationSchema,
  5: tradingEnvironmentSchema,
  6: supportOperationsSchema,
  7: transparencyVerificationSchema,
  8: administrationAuditSchema,
};

export type FirmFormData = z.infer<typeof firmFormSchema>;
