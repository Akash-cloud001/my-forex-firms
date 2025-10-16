import mongoose, { Schema, Document, Types } from 'mongoose';

// ============================================================================
// TYPE DEFINITIONS (Best Practice: Define types first)
// ============================================================================

export type FirmStatus = 'active' | 'paused' | 'suspended' | 'closed';
export type ChallengeType = '1-step' | '2-step' | 'instant' | 'hybrid';
export type DataSource = 'firm' | 'mff' | 'community';

// ============================================================================
// SUB-SCHEMAS (Best Practice: Break down complex schemas)
// ============================================================================

// Logo File Schema
const LogoFileSchema = new Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: Number, required: true },
  mimeType: { type: String, required: true }
}, { _id: false });

// Social Media Schema (removed - no longer used)

// Trading Infrastructure Schema
const TradingInfrastructureSchema = new Schema({
  tradingPlatforms: [{ 
    type: String, 
    required: true, 
    trim: true 
  }],
  dataFeedsLiquidityProviders: [{ 
    type: String, 
    required: true, 
    trim: true 
  }]
}, { _id: false });

// Payout Financial Schema
const PayoutFinancialSchema = new Schema({
  profitSplit: { type: String, required: true, trim: true },
  firstPayoutTiming: { type: String, trim: true },
  regularPayoutCycle: { type: String, trim: true },
  minimumPayoutAmount: { type: String, trim: true },
  averagePayoutProcessingTime: { type: String, trim: true },
  fastestSlowestPayoutDuration: { type: String, trim: true },
  payoutMethods: [{ type: String, trim: true }],
  payoutFeesFxCosts: { type: String, trim: true },
  totalPayoutsAllTime: { type: String, trim: true },
  largestSinglePayout: { type: String, trim: true },
  monthlyPayoutCounts: { type: String, trim: true },
  payoutProofLinks: [{ type: String, trim: true }]
}, { _id: false });

// Rule Matrix Schema
const RuleMatrixSchema = new Schema({
  newsTrading: { type: Boolean, default: false },
  weekendHolding: { type: Boolean, default: false },
  eaUsage: { type: Boolean, default: false },
  copyTrading: { type: Boolean, default: false },
  hedging: { type: Boolean, default: false },
  scalping: { type: Boolean, default: false }
}, { _id: false });

// Rule Details Schema
const RuleDetailsSchema = new Schema({
  newsTradingNotes: { type: String, trim: true },
  weekendHoldingNotes: { type: String, trim: true },
  eaUsageNotes: { type: String, trim: true },
  copyTradingNotes: { type: String, trim: true },
  hedgingNotes: { type: String, trim: true },
  scalpingNotes: { type: String, trim: true }
}, { _id: false });

// Trading Environment Schema
const TradingEnvironmentSchema = new Schema({
  typicalSpreads: { type: String, trim: true },
  commissions: { type: String, trim: true },
  slippageSwapPolicies: { type: String, trim: true },
  riskDeskModel: { type: String, trim: true },
  copyTradeProviders: [{ type: String, trim: true }],
  mobileSupport: [{ type: String, trim: true }],
  ruleMatrix: { type: RuleMatrixSchema, required: true },
  ruleDetails: { type: RuleDetailsSchema }
}, { _id: false });

// Challenge Type Schema
const ChallengeTypeSchema = new Schema({
  challengeName: { type: String, required: true, trim: true },
  challengeType: { 
    type: String, 
    required: true,
    enum: ['1-step', '2-step', 'instant', 'hybrid']
  },
  accountSizesPricing: { type: String, required: true, trim: true },
  profitSplit: { type: String, required: true, trim: true },
  leverageBreakdown: { type: String, required: true, trim: true },
  timeLimits: { type: String, trim: true },
  minimumTradingDays: { type: String, trim: true },
  step1Step2Targets: { type: String, trim: true },
  dailyMaxDrawdown: { type: String, trim: true },
  refundTerms: { type: String, trim: true },
  scalingPlan: { type: String, trim: true },
  allowedInstruments: { type: String, trim: true },
  rules: { type: String, trim: true },
  maxExposureLots: { type: String, trim: true },
  bonusPromoPolicy: { type: String, trim: true },
  termsUrl: { type: String, trim: true },
  termsLastUpdated: { type: Date }
}, { _id: false });

// Pricing Promotions Schema (removed - no longer used)

// Support Operations Schema
const SupportOperationsSchema = new Schema({
  supportChannels: [{ 
    type: String, 
    required: true, 
    trim: true 
  }],
  averageFirstResponseTime: { type: String, trim: true },
  averageResolutionTime: { type: String, trim: true },
  supportHours: { type: String, trim: true },
  escalationPolicy: { type: String, trim: true },
  kycRequirements: { type: String, trim: true },
  restrictedCountries: [{ type: String, trim: true }],
  amlComplianceLink: { type: String, trim: true }
}, { _id: false });

// Transparency Verification Schema
const TransparencyVerificationSchema = new Schema({
  ceoPublic: { type: Boolean, default: false },
  entityOfficeVerified: { type: Boolean, default: false },
  termsPublicUpdated: { type: Boolean, default: false },
  payoutProofsPublic: { type: Boolean, default: false },
  thirdPartyAudit: { type: Boolean, default: false },
  transparencyNotes: { type: String, trim: true }
}, { _id: false });

// Administration Audit Schema
const AdministrationAuditSchema = new Schema({
  dataSource: { 
    type: String, 
    required: true,
    enum: ['firm', 'mff', 'community']
  },
  verifiedBy: { type: String, required: true, trim: true },
  verificationDate: { type: Date, required: true },
  nextReviewDate: { type: Date },
  changelogNotes: { type: String, trim: true }
}, { _id: false });

// Reviews Schema
const ReviewsSchema = new Schema({
  trustPilotRating: { 
    type: Number, 
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  totalLikes: { 
    type: Number, 
    min: [0, 'Likes cannot be negative'],
    default: 0
  },
  totalDislikes: { 
    type: Number, 
    min: [0, 'Dislikes cannot be negative'],
    default: 0
  }
}, { _id: false });

// ============================================================================
// MAIN FIRM SCHEMA (Best Practice: Simplified main schema)
// ============================================================================

const FirmSchema = new Schema({
  // Basic Information
  firmName: { 
    type: String, 
    required: [true, 'Firm name is required'], 
    trim: true,
    maxlength: [200, 'Firm name cannot exceed 200 characters']
  },
  logoUrl: { 
    type: String, 
    trim: true,
    validate: {
      validator: function(v: string) {
        // Allow empty string, null, undefined, or valid HTTP/HTTPS URL
        if (!v || v === '' || v === null || v === undefined) {
          return true;
        }
        // Check if it's a valid HTTP/HTTPS URL
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Logo URL must be a valid HTTP/HTTPS URL or empty'
    }
  },
  logoFile: { type: LogoFileSchema },
  legalEntityName: { 
    type: String, 
    required: [true, 'Legal entity name is required'], 
    trim: true,
    maxlength: [200, 'Legal entity name cannot exceed 200 characters']
  },
  registrationNumber: { 
    type: String, 
    required: [true, 'Registration number is required'], 
    trim: true,
    unique: true,
    maxlength: [100, 'Registration number cannot exceed 100 characters']
  },
  jurisdiction: { 
    type: String, 
    required: [true, 'Jurisdiction is required'], 
    trim: true,
    maxlength: [100, 'Jurisdiction cannot exceed 100 characters']
  },
  yearFounded: { 
    type: Number, 
    required: [true, 'Year founded is required'],
    min: [1800, 'Year founded must be after 1800'],
    max: [new Date().getFullYear(), 'Year founded cannot be in the future']
  },
  headquartersAddress: { 
    type: String, 
    required: [true, 'Headquarters address is required'], 
    trim: true,
    maxlength: [500, 'Headquarters address cannot exceed 500 characters']
  },
  ceoFounderName: { 
    type: String, 
    trim: true,
    maxlength: [200, 'CEO/Founder name cannot exceed 200 characters']
  },
  leadershipLinks: { 
    type: String, 
    trim: true,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Leadership links must be a valid HTTP/HTTPS URL'
    }
  },
  officialWebsite: { 
    type: String, 
    required: [true, 'Official website is required'], 
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Official website must be a valid HTTP/HTTPS URL'
    }
  },
  status: { 
    type: String, 
    required: true,
    enum: {
      values: ['active', 'paused', 'suspended', 'closed'],
      message: 'Status must be one of: active, paused, suspended, closed'
    },
    default: 'active'
  },
  shortDescription: { 
    type: String, 
    required: [true, 'Short description is required'], 
    trim: true,
    maxlength: [1000, 'Short description cannot exceed 1000 characters']
  },

  // Nested Schemas (Best Practice: Reference sub-schemas)
  tradingInfrastructure: { type: TradingInfrastructureSchema },
  payoutFinancial: { type: PayoutFinancialSchema },
  challenges: { type: [ChallengeTypeSchema], default: [] },
  tradingEnvironment: { type: TradingEnvironmentSchema },
  supportOperations: { type: SupportOperationsSchema },
  transparencyVerification: { type: TransparencyVerificationSchema },
  administrationAudit: { type: AdministrationAuditSchema },
  reviews: { type: ReviewsSchema },

  // System Fields
  createdBy: { 
    type: String, 
    required: [true, 'Created by is required'],
    trim: true
  },
  lastModifiedBy: { 
    type: String, 
    required: [true, 'Last modified by is required'],
    trim: true
  },
  isDraft: { type: Boolean, default: true },
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date },
  version: { type: Number, default: 1 }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __v, ...rest } = ret;
      return rest;
    }
  },
  toObject: { virtuals: true }
});

// ============================================================================
// INDEXES (Best Practice: Optimized database performance)
// ============================================================================

// Basic indexes for common queries
FirmSchema.index({ status: 1 });
FirmSchema.index({ jurisdiction: 1 });
FirmSchema.index({ yearFounded: 1 });
FirmSchema.index({ isDraft: 1 });
FirmSchema.index({ isPublished: 1 });
FirmSchema.index({ createdAt: -1 });
FirmSchema.index({ createdBy: 1 });

// Compound indexes for complex queries
FirmSchema.index({ status: 1, isPublished: 1 });
FirmSchema.index({ jurisdiction: 1, status: 1 });
FirmSchema.index({ yearFounded: 1, status: 1 });

// Text search index for full-text search
FirmSchema.index({
  firmName: 'text',
  legalEntityName: 'text',
  shortDescription: 'text',
  'socialMedia.supportEmail': 'text'
});

// ============================================================================
// VIRTUALS (Best Practice: Computed properties)
// ============================================================================

FirmSchema.virtual('fullName').get(function() {
  return `${this.firmName} (${this.legalEntityName})`;
});

FirmSchema.virtual('isActive').get(function() {
  return this.status === 'active' && this.isPublished;
});

FirmSchema.virtual('age').get(function() {
  return new Date().getFullYear() - this.yearFounded;
});

// ============================================================================
// MIDDLEWARE (Best Practice: Data validation and transformation)
// ============================================================================

// Pre-save middleware for data validation and transformation
FirmSchema.pre('save', function(next) {
  // Increment version
  if (this.isNew) {
    this.version = 1;
  } else {
    this.version += 1;
  }
  
  // Validate business rules
  if (this.isPublished && !this.administrationAudit) {
    return next(new Error('Cannot publish firm without administration audit'));
  }
  
  if (this.isPublished && this.status === 'closed') {
    return next(new Error('Cannot publish closed firm'));
  }
  
  next();
});

// Pre-validate middleware for additional checks
FirmSchema.pre('validate', function(next) {
  // Ensure required fields for published firms
  if (this.isPublished) {
    if (!this.tradingInfrastructure?.tradingPlatforms?.length) {
      return next(new Error('Published firms must have trading platforms'));
    }
    if (!this.payoutFinancial?.profitSplit) {
      return next(new Error('Published firms must have profit split information'));
    }
  }
  
  next();
});

// ============================================================================
// STATIC METHODS (Best Practice: Repository pattern)
// ============================================================================

FirmSchema.statics.findByStatus = function(status: FirmStatus) {
  return this.find({ status });
};

FirmSchema.statics.findPublished = function() {
  return this.find({ isPublished: true, status: { $ne: 'closed' } });
};

FirmSchema.statics.findDrafts = function() {
  return this.find({ isDraft: true });
};

FirmSchema.statics.findActive = function() {
  return this.find({ status: 'active', isPublished: true });
};

FirmSchema.statics.searchFirms = function(query: string) {
  return this.find({
    $text: { $search: query },
    isPublished: true,
    status: { $ne: 'closed' }
  }, {
    score: { $meta: 'textScore' }
  }).sort({
    score: { $meta: 'textScore' }
  });
};

FirmSchema.statics.findByJurisdiction = function(jurisdiction: string) {
  return this.find({ 
    jurisdiction: new RegExp(jurisdiction, 'i'),
    isPublished: true 
  });
};

FirmSchema.statics.findByYearRange = function(startYear: number, endYear: number) {
  return this.find({
    yearFounded: { $gte: startYear, $lte: endYear },
    isPublished: true
  });
};

// ============================================================================
// INSTANCE METHODS (Best Practice: Business logic encapsulation)
// ============================================================================

FirmSchema.methods.publish = function() {
  // Validation before publishing
  if (!this.administrationAudit) {
    throw new Error('Cannot publish firm without administration audit');
  }
  
  if (this.status === 'closed') {
    throw new Error('Cannot publish closed firm');
  }
  
  this.isPublished = true;
  this.isDraft = false;
  this.publishedAt = new Date();
  return this.save();
};

FirmSchema.methods.unpublish = function() {
  this.isPublished = false;
  this.isDraft = true;
  this.publishedAt = undefined;
  return this.save();
};

FirmSchema.methods.createDraft = function() {
  this.isDraft = true;
  this.isPublished = false;
  this.publishedAt = undefined;
  return this.save();
};

FirmSchema.methods.updateStatus = function(status: FirmStatus, modifiedBy: string) {
  this.status = status;
  this.lastModifiedBy = modifiedBy;
  
  // Auto-unpublish if status changes to closed or suspended
  if (status === 'closed' || status === 'suspended') {
    this.isPublished = false;
    this.isDraft = true;
  }
  
  return this.save();
};

FirmSchema.methods.addChallenge = function(challenge: IChallengeType) {
  if (!this.challenges) {
    this.challenges = [];
  }
  this.challenges.push(challenge);
  return this.save();
};

FirmSchema.methods.removeChallenge = function(challengeName: string) {
  if (this.challenges) {
    this.challenges = this.challenges.filter((c: IChallengeType) => c.challengeName !== challengeName);
  }
  return this.save();
};

// ============================================================================
// ERROR HANDLING (Best Practice: Comprehensive error management)
// ============================================================================

FirmSchema.post('save', function(error: Error, doc: IFirm, next: (error?: Error) => void) {
  if (error.name === 'ValidationError') {
    const validationError = error as unknown as { errors: Record<string, { message: string }> };
    const errors = Object.values(validationError.errors).map((err) => err.message);
    return next(new Error(`Validation failed: ${errors.join(', ')}`));
  }
  if (error.name === 'MongoError' && (error as unknown as { code: number }).code === 11000) {
    return next(new Error('Registration number must be unique'));
  }
  next(error);
});

// ============================================================================
// TYPESCRIPT INTERFACES (Best Practice: Comprehensive type definitions)
// ============================================================================

// Base interfaces for better type safety
export interface ILogoFile {
  filename: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface IChallengeType {
  challengeName: string;
  challengeType: ChallengeType;
  accountSizesPricing: string;
  profitSplit: string;
  leverageBreakdown: string;
  timeLimits?: string;
  minimumTradingDays?: string;
  step1Step2Targets?: string;
  dailyMaxDrawdown?: string;
  refundTerms?: string;
  scalingPlan?: string;
  allowedInstruments?: string;
  rules?: string;
  maxExposureLots?: string;
  bonusPromoPolicy?: string;
  termsUrl?: string;
  termsLastUpdated?: Date;
}

// ISocialMedia interface removed - no longer used

export interface ITradingInfrastructure {
  tradingPlatforms: string[];
  dataFeedsLiquidityProviders: string[];
}

export interface IPayoutFinancial {
  profitSplit: string;
  firstPayoutTiming?: string;
  regularPayoutCycle?: string;
  minimumPayoutAmount?: string;
  averagePayoutProcessingTime?: string;
  fastestSlowestPayoutDuration?: string;
  payoutMethods: string[];
  payoutFeesFxCosts?: string;
  totalPayoutsAllTime?: string;
  largestSinglePayout?: string;
  monthlyPayoutCounts?: string;
  payoutProofLinks?: string[];
}

export interface IRuleMatrix {
  newsTrading: boolean;
  weekendHolding: boolean;
  eaUsage: boolean;
  copyTrading: boolean;
  hedging: boolean;
  scalping: boolean;
}

export interface IRuleDetails {
  newsTradingNotes?: string;
  weekendHoldingNotes?: string;
  eaUsageNotes?: string;
  copyTradingNotes?: string;
  hedgingNotes?: string;
  scalpingNotes?: string;
}

export interface ITradingEnvironment {
  typicalSpreads?: string;
  commissions?: string;
  slippageSwapPolicies?: string;
  riskDeskModel?: string;
  copyTradeProviders?: string[];
  mobileSupport?: string[];
  ruleMatrix: IRuleMatrix;
  ruleDetails?: IRuleDetails;
}

// IPricingPromotions interface removed - no longer used

export interface ISupportOperations {
  supportChannels: string[];
  averageFirstResponseTime?: string;
  averageResolutionTime?: string;
  supportHours?: string;
  escalationPolicy?: string;
  kycRequirements?: string;
  restrictedCountries?: string[];
  amlComplianceLink?: string;
}

export interface ITransparencyVerification {
  ceoPublic: boolean;
  entityOfficeVerified: boolean;
  termsPublicUpdated: boolean;
  payoutProofsPublic: boolean;
  thirdPartyAudit: boolean;
  transparencyNotes?: string;
}

export interface IAdministrationAudit {
  dataSource: DataSource;
  verifiedBy: string;
  verificationDate: Date;
  nextReviewDate?: Date;
  changelogNotes?: string;
}

export interface IReviews {
  trustPilotRating: number;
  totalLikes: number;
  totalDislikes: number;
}

// ============================================================================
// MAIN FIRM INTERFACE (Best Practice: Clean, well-typed interface)
// ============================================================================

export interface IFirm extends Document {
  // Basic Information
  _id: Types.ObjectId;
  firmName: string;
  logoUrl?: string;
  logoFile?: ILogoFile;
  legalEntityName: string;
  registrationNumber: string;
  jurisdiction: string;
  yearFounded: number;
  headquartersAddress: string;
  ceoFounderName?: string;
  leadershipLinks?: string;
  officialWebsite: string;
  status: FirmStatus;
  shortDescription: string;
  
  // Nested Objects
  tradingInfrastructure?: ITradingInfrastructure;
  payoutFinancial?: IPayoutFinancial;
  challenges?: IChallengeType[];
  tradingEnvironment?: ITradingEnvironment;
  supportOperations?: ISupportOperations;
  transparencyVerification?: ITransparencyVerification;
  administrationAudit?: IAdministrationAudit;
  reviews?: IReviews;

  // System Fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
  isDraft: boolean;
  isPublished: boolean;
  publishedAt?: Date;
  version: number;

  // Virtual Fields
  fullName: string;

  // Instance Methods
  publish(): Promise<IFirm>;
  unpublish(): Promise<IFirm>;
  createDraft(): Promise<IFirm>;
}

// ============================================================================
// UTILITY TYPES (Best Practice: Helper types for better DX)
// ============================================================================

export type FirmCreateInput = Omit<IFirm, '_id' | 'createdAt' | 'updatedAt' | 'version' | 'fullName'>;
export type FirmUpdateInput = Partial<Omit<IFirm, '_id' | 'createdAt' | 'updatedAt' | 'version' | 'fullName'>>;
export type FirmPublicData = Pick<IFirm, 'firmName' | 'logoUrl' | 'logoFile' | 'legalEntityName' | 'jurisdiction' | 'yearFounded' | 'officialWebsite' | 'status' | 'shortDescription' | 'tradingInfrastructure' | 'payoutFinancial' | 'challenges' | 'tradingEnvironment' | 'supportOperations' | 'transparencyVerification'>;

// Create and export the model
const Firm = mongoose.models.Firm || mongoose.model<IFirm>('Firm', FirmSchema);

export default Firm;
