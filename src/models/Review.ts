import mongoose, { Schema, Document, Model } from 'mongoose';

// ============================================================================
// TYPE DEFINITIONS (Best Practice: Define types first)
// ============================================================================

export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'info-requested';

export type AdminMessageType = 'info-request' | 'follow-up' | 'internal-note' | 'final-decision';

export interface IAdminMessage {
  _id?: string;
  senderId: string;
  senderRole: 'admin' | 'moderator';
  senderName?: string;
  messageType: AdminMessageType;
  subject?: string;
  message: string;
  sentAt: Date;
  emailSent: boolean;
  emailSentAt?: Date;
}
export type IssueType =
  // Payout Issues
  | 'payout-delays'
  | 'payout-denial'
  | 'other-payout'
  // Account/Platform Issues
  | 'missing-account'
  | 'technical-problems'
  | 'platform-instability'
  | 'other-account'
  // Trading Related Issues
  | 'slippage'
  | 'spreads'
  | 'execution'
  | 'rule-enforcement'
  | 'commissions-discrepancy'
  | 'restrictions'
  | 'other-trading'
  // Rule/Policy Issues
  | 'rule-changes'
  | 'unclear-terms'
  | 'hidden-rules'
  | 'other-rule'
  // Support/Communication Issues
  | 'ignored-emails'
  | 'no-response'
  | 'slow-support'
  | 'miscommunication'
  | 'immature-support'
  | 'other-support'
  // Misconduct
  | 'misleading-marketing'
  | 'unfair-practices'
  | 'fake-claims'
  // Legacy/Fallback
  | 'user-complaints'
  | 'payout-denials'
  | 'poor-practices'
  | 'unethical-marketing'
  | 'community-trust'
  | 'other';

// ============================================================================
// SUB-SCHEMAS (Best Practice: Break down complex schemas)
// ============================================================================

const FileSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String, required: true },
  public_id: { type: String }, // Optional: For Cloudinary file deletion
  thumbnail_url: { type: String },
  thumbnail_public_id: { type: String },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

// Admin/Moderator Message Sub-Schema for tracking info requests
const AdminMessageSchema = new Schema({
  senderId: { type: String, required: true },
  senderRole: {
    type: String,
    enum: ['admin', 'moderator', 'user'],
    required: true
  },
  senderName: { type: String },
  messageType: {
    type: String,
    enum: ['info-request', 'follow-up', 'internal-note', 'final-decision'],
    default: 'info-request'
  },
  subject: { type: String },
  message: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  emailSent: { type: Boolean, default: false },
  emailSentAt: { type: Date }
}, { _id: true });

// ============================================================================
// MAIN REVIEW SCHEMA
// ============================================================================


const ReviewSchema = new Schema({
  userId: String,
  firmId: { type: Schema.Types.ObjectId, ref: 'FundingFirm' },
  firmName: String,
  customFirmName: String,
  issueCategory: { type: String, required: true }, // Added to match Zod schema
  issueType: {
    type: String,
    enum: [
      // Payout Issues
      'payout-delays',
      'payout-denial',
      'other-payout',
      // Account/Platform Issues
      'missing-account',
      'technical-problems',
      'platform-instability',
      'other-account',
      // Trading Related Issues
      'slippage',
      'spreads',
      'execution',
      'rule-enforcement',
      'commissions-discrepancy',
      'restrictions',
      'other-trading',
      // Rule/Policy Issues
      'rule-changes',
      'unclear-terms',
      'hidden-rules',
      'other-rule',
      // Support/Communication Issues
      'ignored-emails',
      'no-response',
      'slow-support',
      'miscommunication',
      'immature-support',
      'other-support',
      // Misconduct
      'misleading-marketing',
      'unfair-practices',
      'fake-claims',
      // Legacy/Fallback
      'user-complaints',
      'payout-denials',
      'poor-practices',
      'unethical-marketing',
      'community-trust',
      'other'
    ]
  },
  customIssueType: String,
  description: String,
  files: [FileSchema],         // Use strict sub-schema
  status: String,
  isVerified: Boolean,
  adminNotes: String,
  reviewedBy: String,
  reviewedAt: Date,
  analytics: Object,           // simplify nested ReviewAnalyticsSchema

  // Admin/Moderator Message Tracking
  adminMessages: [AdminMessageSchema],              // Array of all admin messages
  infoRequestCount: { type: Number, default: 0 },   // Quick count of info requests

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: String,
  lastModifiedBy: String
}, {
  timestamps: true,
  collection: 'reviews'
});

// ============================================================================
// INDEXES (Best Practice: Define indexes for performance)
// ============================================================================

// Compound indexes for common queries
ReviewSchema.index({ firmId: 1, status: 1 });
ReviewSchema.index({ userId: 1, createdAt: -1 });
ReviewSchema.index({ status: 1, isVerified: 1, createdAt: -1 });
ReviewSchema.index({ issueType: 1, status: 1 });
ReviewSchema.index({ issueCategory: 1, status: 1 }); // Index for new field

// Index for admin messages queries
ReviewSchema.index({ 'adminMessages.senderId': 1, createdAt: -1 });

// Text search index for description and firm name
ReviewSchema.index({
  description: 'text',
  firmName: 'text',
  customFirmName: 'text'
});

// ============================================================================
// VIRTUAL FIELDS (Best Practice: Add computed properties)
// ============================================================================

// Virtual for display name (firm name or custom firm name)
ReviewSchema.virtual('displayFirmName').get(function () {
  return this.firmName === 'Other' ? this.customFirmName : this.firmName;
});

// Virtual for display issue type (issue type or custom issue type)
ReviewSchema.virtual('displayIssueType').get(function () {
  return this.issueType === 'other' ? this.customIssueType : this.issueType;
});

// Virtual for review age
ReviewSchema.virtual('ageInDays').get(function () {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24));
});

// Virtual for helpfulness ratio
ReviewSchema.virtual('helpfulnessRatio').get(function () {
  const total = this.analytics.helpfulVotes + this.analytics.notHelpfulVotes;
  return total > 0 ? (this.analytics.helpfulVotes / total) : 0;
});

// ============================================================================
// INSTANCE METHODS (Best Practice: Add business logic methods)
// ============================================================================

// Method to approve review
ReviewSchema.methods.approve = function (adminUserId: string, notes?: string) {
  this.status = 'approved';
  this.isVerified = true;
  this.reviewedBy = adminUserId;
  this.reviewedAt = new Date();
  if (notes) this.adminNotes = notes;
  return this.save();
};

// Method to reject review
ReviewSchema.methods.reject = function (adminUserId: string, notes?: string) {
  this.status = 'rejected';
  this.isVerified = false;
  this.reviewedBy = adminUserId;
  this.reviewedAt = new Date();
  if (notes) this.adminNotes = notes;
  return this.save();
};

// Method to mark as helpful
ReviewSchema.methods.markHelpful = function () {
  this.analytics.helpfulVotes += 1;
  return this.save();
};

// Method to mark as not helpful
ReviewSchema.methods.markNotHelpful = function () {
  this.analytics.notHelpfulVotes += 1;
  return this.save();
};

// Method to increment views
ReviewSchema.methods.incrementViews = function () {
  this.analytics.views += 1;
  this.analytics.lastViewedAt = new Date();
  return this.save();
};

// Method to request more information from user
ReviewSchema.methods.requestMoreInfo = function (
  senderId: string,
  senderRole: 'admin' | 'moderator',
  message: string,
  options?: {
    senderName?: string;
    subject?: string;
    emailSent?: boolean;
  }
) {
  this.status = 'info-requested';
  this.adminMessages.push({
    senderId,
    senderRole,
    senderName: options?.senderName,
    messageType: this.infoRequestCount > 0 ? 'follow-up' : 'info-request',
    subject: options?.subject,
    message,
    sentAt: new Date(),
    emailSent: options?.emailSent || false,
    emailSentAt: options?.emailSent ? new Date() : undefined
  });
  this.infoRequestCount += 1;
  return this.save();
};

// Method to mark email as sent for a specific admin message
ReviewSchema.methods.markEmailSent = function (messageId: string) {
  const message = this.adminMessages.id(messageId);
  if (message) {
    message.emailSent = true;
    message.emailSentAt = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// ============================================================================
// STATIC METHODS (Best Practice: Add query helpers)
// ============================================================================

// Static method to get reviews by firm
ReviewSchema.statics.findByFirm = function (firmId: string, options: Record<string, unknown> = {}) {
  return this.find({ firmId, ...options });
};

// Static method to get reviews by user
ReviewSchema.statics.findByUser = function (userId: string, options: Record<string, unknown> = {}) {
  return this.find({ userId, ...options });
};

// Static method to get pending reviews
ReviewSchema.statics.findPending = function (options: Record<string, unknown> = {}) {
  return this.find({ status: 'pending', ...options });
};

// Static method to get approved reviews
ReviewSchema.statics.findApproved = function (options: Record<string, unknown> = {}) {
  return this.find({ status: 'approved', isVerified: true, ...options });
};



// Static method to get review statistics
ReviewSchema.statics.getStats = function (filters: Record<string, unknown> = {}) {
  return this.aggregate([
    { $match: filters },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        pendingCount: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        approvedCount: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
        rejectedCount: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
        verifiedCount: { $sum: { $cond: ['$isVerified', 1, 0] } }
      }
    }
  ]);
};

// ============================================================================
// PRE-SAVE MIDDLEWARE (Best Practice: Add validation and processing)
// ============================================================================

// Update lastModifiedBy before saving
ReviewSchema.pre('save', function (next) {
  if (this.isModified() && !this.isNew) {
    this.lastModifiedBy = this.createdBy; // In real app, get from auth context
  }
  next();
});

// ============================================================================
// POST-SAVE MIDDLEWARE (Best Practice: Add side effects)
// ============================================================================

// Update firm statistics after review is approved
ReviewSchema.post('save', async function (doc) {
  if (doc.status === 'approved' && doc.firmId) {
    // Here you would update the firm's review statistics
    // This could trigger a recalculation of the PropTrust Index
    console.log(`Review approved for firm ${doc.firmId}, updating statistics...`);
  }
});

// ============================================================================
// INTERFACE DEFINITIONS (Best Practice: Define TypeScript interfaces)
// ============================================================================

export interface IReview extends Document {
  userId: string;
  firmId?: mongoose.Types.ObjectId;
  firmName: string;
  customFirmName?: string;
  issueCategory: string; // Added
  issueType: IssueType;
  customIssueType?: string;
  description: string;
  files: Array<{
    name: string;
    type: string;
    size: number;
    url: string;
    public_id: string;
    thumbnail_url: string;
    thumbnail_public_id: string;
    uploadedAt: Date;
  }>;
  status: ReviewStatus;
  isVerified: boolean;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  analytics: {
    views: number;
    helpfulVotes: number;
    notHelpfulVotes: number;
    shares: number;
    lastViewedAt?: Date;
  };

  // Admin/Moderator Message Tracking
  adminMessages: IAdminMessage[];
  infoRequestCount: number;

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;

  // Virtual fields
  displayFirmName: string;
  displayIssueType: string;
  ageInDays: number;
  helpfulnessRatio: number;

  // Instance methods
  approve(adminUserId: string, notes?: string): Promise<IReview>;
  reject(adminUserId: string, notes?: string): Promise<IReview>;
  markHelpful(): Promise<IReview>;
  markNotHelpful(): Promise<IReview>;
  incrementViews(): Promise<IReview>;
  requestMoreInfo(
    senderId: string,
    senderRole: 'admin' | 'moderator',
    message: string,
    options?: {
      senderName?: string;
      subject?: string;
      emailSent?: boolean;
    }
  ): Promise<IReview>;
  markEmailSent(messageId: string): Promise<IReview>;
}

// ============================================================================
// EXPORT MODEL (Best Practice: Export both schema and model)
// ============================================================================

// Delete the cached model to ensure methods are properly attached during HMR
if (mongoose.models?.Review) {
  delete mongoose.models.Review;
}

const Review: Model<IReview> = mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
export { ReviewSchema };
