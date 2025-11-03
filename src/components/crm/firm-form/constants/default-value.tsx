import { FirmFormData } from "../schemas/schema";

export const getDefaultValues = (): FirmFormData => ({
  // Step 1
  firmName: "",
  logoUrl: "",
  logoFile: null,
  legalEntityName: "",
  registrationNumber: "",
  jurisdiction: "",
  yearFounded: '',
  headquartersAddress: "",
  ceoFounderName: "",
  leadershipLinks: "",
  officialWebsite: "",
  status: "active",
  shortDescription: "",
  trustPilotRating: undefined,
  
  // Step 2
  tradingPlatforms: "",
  dataFeedsLiquidityProviders: "",
  
  // Step 3
  profitSplit: "",
  firstPayoutTiming: "",
  regularPayoutCycle: "",
  minimumPayoutAmount: "",
  averagePayoutProcessingTime: "",
  fastestSlowestPayoutDuration: "",
  payoutMethods: "",
  payoutFeesFxCosts: "",
  totalPayoutsAllTime: "",
  largestSinglePayout: "",
  monthlyPayoutCounts: "",
  payoutProofLinks: "",
  
  // Step 4
  challengeInformation: [],
  
  // Step 5
  typicalSpreads: "",
  commissions: "",
  slippageSwapPolicies: "",
  riskDeskModel: "",
  copyTradeProviders: "",
  mobileSupport: "",
  newsTrading: false,
  weekendHolding: false,
  eaUsage: false,
  copyTrading: false,
  hedging: false,
  scalping: false,
  newsTradingNotes: "",
  weekendHoldingNotes: "",
  eaUsageNotes: "",
  copyTradingNotes: "",
  hedgingNotes: "",
  scalpingNotes: "",
  
  // Step 6
  supportChannels: "",
  averageFirstResponseTime: "",
  averageResolutionTime: "",
  supportHours: "",
  escalationPolicy: "",
  kycRequirements: "",
  restrictedCountries: "",
  amlComplianceLink: "",
  
  // Step 7
  ceoPublic: false,
  entityOfficeVerified: false,
  termsPublicUpdated: false,
  payoutProofsPublic: false,
  thirdPartyAudit: false,
  transparencyNotes: "",
  
  // Step 8
  dataSource: "firm",
  verifiedBy: "",
  verificationDate: "",
  nextReviewDate: "",
  changelogNotes: "",
});