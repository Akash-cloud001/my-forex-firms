// export interface FirmFormData {
//   // Step 1: Firm Information
//   firmName: string;
//   logoUrl?: string;
//   logoFile?: any| null;
//   legalEntityName: string;
//   registrationNumber: string;
//   jurisdiction: string;
//   yearFounded: number;
//   headquartersAddress: string;
//   ceoFounderName: string;
//   leadershipLinks?: string;
//   officialWebsite: string;
//   status: "active" | "paused" | "suspended" | "closed";
//   shortDescription: string;
//   trustPilotRating?: number;

//   // Step 2: Trading Platforms
//   tradingPlatforms: string;
//   dataFeedsLiquidityProviders: string;

//   // Step 3: Payout & Financial
//   profitSplit: string;
//   firstPayoutTiming: string;
//   regularPayoutCycle: string;
//   minimumPayoutAmount: string;
//   averagePayoutProcessingTime: string;
//   fastestSlowestPayoutDuration?: string;
//   payoutMethods: string;
//   payoutFeesFxCosts?: string;
//   totalPayoutsAllTime?: string;
//   largestSinglePayout?: string;
//   monthlyPayoutCounts?: string;
//   payoutProofLinks?: string;

//   // Step 4: Challenge Information
//   challengeInformation: {
//     challengeName: string;
//     challengeType: "1-step" | "2-step"| 'instant' | 'hybrid';
//     accountSizesPricing: string;
//     profitSplit: string;
//     leverageBreakdown?: string;
//     timeLimits?: string;
//     minimumTradingDays?: string;
//     step1Step2Targets?: string;
//     dailyMaxDrawdown: string;
//     refundTerms?: string;
//     scalingPlan?: string;
//     allowedInstruments?: string;
//     rules?: string;
//     maxExposureLots?: string;
//     bonusPromoPolicy?: string;
//     termsUrl?: string;
//     termsLastUpdated?: string;
//   }[];

//   // Step 5: Trading Environment
//   typicalSpreads: string;
//   commissions: string;
//   slippageSwapPolicies?: string;
//   riskDeskModel: string;
//   copyTradeProviders?: string;
//   mobileSupport?: string;
//   newsTrading: boolean;
//   weekendHolding: boolean;
//   eaUsage: boolean;
//   copyTrading: boolean;
//   hedging: boolean;
//   scalping: boolean;
//   newsTradingNotes?: string;
//   weekendHoldingNotes?: string;
//   eaUsageNotes?: string;
//   copyTradingNotes?: string;
//   hedgingNotes?: string;
//   scalpingNotes?: string;

//   // Step 6: Support & Operations
//   supportChannels: string;
//   averageFirstResponseTime: string;
//   averageResolutionTime: string;
//   supportHours: string;
//   escalationPolicy?: string;
//   kycRequirements: string;
//   restrictedCountries?: string;
//   amlComplianceLink?: string;

//   // Step 7: Transparency & Verification
//   ceoPublic: boolean;
//   entityOfficeVerified: boolean;
//   termsPublicUpdated: boolean;
//   payoutProofsPublic: boolean;
//   thirdPartyAudit: boolean;
//   transparencyNotes?: string;

//   // Step 8: Administration & Audit
//   dataSource:  'firm' | 'mff' | 'community'; 
//   verifiedBy: string;
//   verificationDate: string;
//   nextReviewDate: string;
//   changelogNotes?: string;
// }