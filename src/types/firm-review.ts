export interface OverviewDataItem {
  label: string;
  value: string;
  highlight?: boolean | 'success';
}

export interface OverviewData {
  left: OverviewDataItem[];
  right: OverviewDataItem[];
}

export interface OverviewSection {
  title: string;
  icon: string;
  data: OverviewData;
}

export interface WhatIsSection {
  id: string;
  title: string;
  icon: string;
  content: string;
  highlights?: {
    title: string;
    items: string[];
  };
  conclusion?: string;
}

export interface ProsConsItem {
  title: string;
  description: string;
}

export interface HowDiffersSection {
  id: string;
  title: string;
  icon: string;
  advantages: ProsConsItem[];
  limitations: ProsConsItem[];
}

export interface ComparisonRow {
  criteria: string;
  instant?: string;
  instantHighlight?: 'red' | 'yellow' | 'success';
  phase1?: string;
  phase1Highlight?: 'red' | 'yellow' | 'success';
  phase2?: string;
  phase2Highlight?: 'red' | 'yellow' | 'success';
}

export interface ProgramsComparisonSection {
  id: string;
  title: string;
  icon: string;
  headers: string[];
  rows: ComparisonRow[];
}

export interface PlatformsExecutionSection {
  id: string;
  title: string;
  icon: string;
  platforms: string[];
  instruments: string[];
  executionNotes?: string;
}

export interface VerdictStrength {
  title: string;
  description: string;
}

export interface VerdictRecommendation {
  title: string;
  content: string;
  footer?: string;
}

export interface FinalVerdictSection {
  id: string;
  title: string;
  icon: string;
  subtitle: string;
  rating: number;
  ratingLabel: string;
  strengths: VerdictStrength[];
  weaknesses?: VerdictStrength[];
  recommendation: VerdictRecommendation;
}

export interface PayoutsWithdrawalSection {
  id: string;
  title: string;
  icon: string;
  profitSplit: string;
  firstPayout: string;
  subsequentPayouts: string;
  payoutMethods: string[];
  payoutSpeed: string;
  payoutProof: string;
  notes: string;
}

export interface SupportQuality {
  responseTime: string;
  description: string;
}

export interface Ratings {
  trustpilot: number;
  communitySize: string;
}

export interface SupportReputationSection {
  id: string;
  title: string;
  icon: string;
  supportQuality: SupportQuality;
  ratings: Ratings;
  mostLoved: string[];
  mostComplained: string[];
}

export interface TraderFeedbackSection {
  id: string;
  title: string;
  icon: string;
  praised: string[];
  complaints: string[];
}

export interface ProsConsSection {
  id: string;
  title: string;
  icon: string;
  pros: string[];
  cons: string[];
}

export interface RedFlagsSection {
  id: string;
  title: string;
  icon: string;
  items: string[];
}

export interface WhoShouldUseSection {
  id: string;
  title: string;
  icon: string;
  perfectFor: string[];
  notIdealFor: string[];
}

export interface FundedAccountProcess {
  steps: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  icon: string;
}

export interface FirmReview {
  _id?: {
    $oid: string;
  };
  slug: string;
  firmName: string;
  title: string;
  subtitle: string;
  publishedAt: string;
  readTime: number;
  trustScore: number;
  rating: number;
  ratingLabel: string;
  introduction: string;
  overview: OverviewSection;
  whatIs: WhatIsSection;
  howDiffers: HowDiffersSection;
  programsComparison: ProgramsComparisonSection;
  platformsExecution: PlatformsExecutionSection;
  payoutsWithdrawal: PayoutsWithdrawalSection;
  supportReputation: SupportReputationSection;
  traderFeedback: TraderFeedbackSection;
  prosCons: ProsConsSection;
  redFlags: RedFlagsSection;
  whoShouldUse: WhoShouldUseSection;
  fundedAccountProcess: FundedAccountProcess;
  finalVerdict: FinalVerdictSection;
  tableOfContents: TableOfContentsItem[];
  seoTags: string[];
  faqs: FaqItem[];
  createdAt?: {
    $date: string;
  };
  updatedAt?: {
    $date: string;
  };
  __v?: number;
}

export interface FirmReviewsData {
  [key: string]: FirmReview;
}
