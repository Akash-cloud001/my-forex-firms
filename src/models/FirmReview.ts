// import mongoose, { Schema, Document } from 'mongoose';
// import { FirmReview } from '@/types/firm-review';

// // ============================================================================
// // SUB-SCHEMAS (Best Practice: Break down complex schemas)
// // ============================================================================

// const OverviewDataItemSchema = new Schema({
//     label: { type: String, required: true },
//     value: { type: String, required: true },
//     highlight: { type: Schema.Types.Mixed }, // boolean | 'success'
// }, { _id: false });

// const OverviewDataSchema = new Schema({
//     left: { type: [OverviewDataItemSchema], required: true },
//     right: { type: [OverviewDataItemSchema], required: true },
// }, { _id: false });

// const OverviewSectionSchema = new Schema({
//     title: { type: String, required: true },
//     icon: { type: String, required: true },
//     data: { type: OverviewDataSchema, required: true },
// }, { _id: false });

// const WhatIsSectionSchema = new Schema({
//     id: { type: String, required: true },
//     title: { type: String, required: true },
//     icon: { type: String, required: true },
//     content: { type: String, required: true },
//     highlights: {
//         title: { type: String },
//         items: { type: [String], default: [] },
//     },
//     conclusion: { type: String },
// }, { _id: false });

// const ProsConsItemSchema = new Schema({
//     title: { type: String, required: true },
//     description: { type: String, required: true },
// }, { _id: false });

// const HowDiffersSectionSchema = new Schema({
//     id: { type: String, required: true },
//     title: { type: String, required: true },
//     icon: { type: String, required: true },
//     advantages: { type: [ProsConsItemSchema], default: [] },
//     limitations: { type: [ProsConsItemSchema], default: [] },
// }, { _id: false });

// const ComparisonRowSchema = new Schema({
//     criteria: { type: String, required: true },
//     instant: { type: String },
//     instantHighlight: { type: String, enum: ['red', 'yellow', 'success'] },
//     phase1: { type: String },
//     phase1Highlight: { type: String, enum: ['red', 'yellow', 'success'] },
//     phase2: { type: String },
//     phase2Highlight: { type: String, enum: ['red', 'yellow', 'success'] },
// }, { _id: false });

// const ProgramsComparisonSectionSchema = new Schema({
//     id: { type: String, required: true },
//     title: { type: String, required: true },
//     icon: { type: String, required: true },
//     headers: { type: [String], required: true },
//     rows: { type: [ComparisonRowSchema], default: [] },
// }, { _id: false });

// const PlatformsExecutionSectionSchema = new Schema({
//     id: { type: String, required: true },
//     title: { type: String, required: true },
//     icon: { type: String, required: true },
//     platforms: { type: [String], default: [] },
//     instruments: { type: [String], default: [] },
// }, { _id: false });

// const VerdictStrengthSchema = new Schema({
//     title: { type: String, required: true },
//     description: { type: String, required: true },
// }, { _id: false });

// const VerdictRecommendationSchema = new Schema({
//     title: { type: String, required: true },
//     content: { type: String, required: true },
//     footer: { type: String },
// }, { _id: false });

// const FinalVerdictSectionSchema = new Schema({
//     id: { type: String, required: true },
//     title: { type: String, required: true },
//     icon: { type: String, required: true },
//     subtitle: { type: String, required: true },
//     rating: { type: Number, required: true },
//     ratingLabel: { type: String, required: true },
//     strengths: { type: [VerdictStrengthSchema], default: [] },
//     weaknesses: { type: [VerdictStrengthSchema], default: [] },
//     recommendation: { type: VerdictRecommendationSchema, required: true },
// }, { _id: false });

// const TableOfContentsItemSchema = new Schema({
//     id: { type: String, required: true },
//     title: { type: String, required: true },
//     icon: { type: String, required: true },
// }, { _id: false });

// // ============================================================================
// // MAIN FIRM REVIEW SCHEMA
// // ============================================================================

// const FirmReviewSchema = new Schema({
//     slug: {
//         type: String,
//         required: [true, 'Slug is required'],
//         unique: true,
//         index: true,
//         trim: true,
//         validate: {
//             validator: function(v: string) {
//                 // Ensure slug ends with "-review"
//                 return v.endsWith('-review');
//             },
//             message: 'Slug must end with "-review"'
//         }
//     },
//     firmName: {
//         type: String,
//         required: [true, 'Firm name is required'],
//         trim: true,
//         maxlength: [200, 'Firm name cannot exceed 200 characters']
//     },
//     title: {
//         type: String,
//         required: [true, 'Title is required'],
//         trim: true,
//         maxlength: [300, 'Title cannot exceed 300 characters']
//     },
//     subtitle: {
//         type: String,
//         required: [true, 'Subtitle is required'],
//         trim: true,
//         maxlength: [500, 'Subtitle cannot exceed 500 characters']
//     },
//     publishedAt: {
//         type: String,
//         required: true
//     },
//     readTime: {
//         type: Number,
//         required: true,
//         min: [0, 'Read time cannot be negative']
//     },
//     trustScore: {
//         type: Number,
//         required: true,
//         min: [0, 'Trust score cannot be negative'],
//         max: [10, 'Trust score cannot exceed 10']
//     },
//     rating: {
//         type: Number,
//         required: true,
//         min: [0, 'Rating cannot be negative'],
//         max: [5, 'Rating cannot exceed 5']
//     },
//     ratingLabel: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     introduction: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     overview: {
//         type: OverviewSectionSchema,
//         required: true
//     },
//     whatIs: {
//         type: WhatIsSectionSchema,
//         required: true
//     },
//     howDiffers: {
//         type: HowDiffersSectionSchema,
//         required: true
//     },
//     programsComparison: {
//         type: ProgramsComparisonSectionSchema,
//         required: true
//     },
//     platformsExecution: {
//         type: PlatformsExecutionSectionSchema,
//         required: true
//     },
//     finalVerdict: {
//         type: FinalVerdictSectionSchema,
//         required: true
//     },
//     tableOfContents: {
//         type: [TableOfContentsItemSchema],
//         required: true,
//         default: []
//     }
// }, {
//     timestamps: true,
//     collection: 'firmreviews'
// });

// // ============================================================================
// // INDEXES (Best Practice: Add indexes for frequently queried fields)
// // ============================================================================

// FirmReviewSchema.index({ slug: 1 }, { unique: true });
// FirmReviewSchema.index({ firmName: 1 });
// FirmReviewSchema.index({ createdAt: -1 });

// // ============================================================================
// // INTERFACE DEFINITIONS
// // ============================================================================

// export interface IFirmReview extends Document, FirmReview {
//     createdAt: Date;
//     updatedAt: Date;
// }

// // ============================================================================
// // MODEL EXPORT
// // ============================================================================

// const FirmReviewModel = mongoose.models.FirmReview || mongoose.model<IFirmReview>('FirmReview', FirmReviewSchema);

// export default FirmReviewModel;
// export { FirmReviewSchema };



import mongoose, { Schema, Document } from 'mongoose';
import { FirmReview } from '@/types/firm-review';

// ============================================================================
// SUB-SCHEMAS (Complete Coverage of All New Fields)
// ============================================================================

const OverviewDataItemSchema = new Schema({
    label: { type: String, required: true },
    value: { type: String, required: true },
    highlight: { type: Schema.Types.Mixed }, // boolean | 'success'
}, { _id: false });

const OverviewDataSchema = new Schema({
    left: { type: [OverviewDataItemSchema], required: true },
    right: { type: [OverviewDataItemSchema], required: true },
}, { _id: false });

const OverviewSectionSchema = new Schema({
    title: { type: String, required: true },
    icon: { type: String, required: true },
    data: { type: OverviewDataSchema, required: true },
}, { _id: false });

const WhatIsSectionSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    content: { type: String, required: true },
    highlights: {
        title: { type: String },
        items: { type: [String], default: [] },
    },
    conclusion: { type: String },
}, { _id: false });

const ProsConsItemSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
}, { _id: false });

const HowDiffersSectionSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    advantages: { type: [ProsConsItemSchema], default: [] },
    limitations: { type: [ProsConsItemSchema], default: [] },
}, { _id: false });

const ComparisonRowSchema = new Schema({
    criteria: { type: String, required: true },
    instant: { type: String },
    instantHighlight: { type: String, enum: ['red', 'yellow', 'success'] },
    phase1: { type: String },
    phase1Highlight: { type: String, enum: ['red', 'yellow', 'success'] },
    phase2: { type: String },
    phase2Highlight: { type: String, enum: ['red', 'yellow', 'success'] },
}, { _id: false });

const ProgramsComparisonSectionSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    headers: { type: [String], required: true },
    rows: { type: [ComparisonRowSchema], default: [] },
}, { _id: false });

const PlatformsExecutionSectionSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    platforms: { type: [String], default: [] },
    instruments: { type: [String], default: [] },
    executionNotes: { type: String },
}, { _id: false });

const VerdictStrengthSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
}, { _id: false });

const VerdictRecommendationSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    footer: { type: String },
}, { _id: false });

const FinalVerdictSectionSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    subtitle: { type: String, required: true },
    rating: { type: Number, required: true },
    ratingLabel: { type: String, required: true },
    strengths: { type: [VerdictStrengthSchema], default: [] },
    weaknesses: { type: [VerdictStrengthSchema], default: [] },
    recommendation: { type: VerdictRecommendationSchema, required: true },
}, { _id: false });

// ============================================================================
// NEW SUB-SCHEMAS FOR MISSING FIELDS
// ============================================================================

const PayoutsWithdrawalSectionSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    profitSplit: { type: String, required: true },
    firstPayout: { type: String, required: true },
    subsequentPayouts: { type: String, required: true },
    payoutMethods: { type: [String], required: true },
    payoutSpeed: { type: String, required: true },
    payoutProof: { type: String, required: true },
    notes: { type: String, required: true },
}, { _id: false });

const SupportQualitySchema = new Schema({
    responseTime: { type: String, required: true },
    description: { type: String, required: true },
}, { _id: false });

const RatingsSchema = new Schema({
    trustpilot: { type: Number, required: true },
    communitySize: { type: String, required: true },
}, { _id: false });

const SupportReputationSectionSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    supportQuality: { type: SupportQualitySchema, required: true },
    ratings: { type: RatingsSchema, required: true },
    mostLoved: { type: [String], default: [] },
    mostComplained: { type: [String], default: [] },
}, { _id: false });

const TraderFeedbackSectionSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    praised: { type: [String], default: [] },
    complaints: { type: [String], default: [] },
}, { _id: false });

const ProsConsSectionSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    pros: { type: [String], default: [] },
    cons: { type: [String], default: [] },
}, { _id: false });

const RedFlagsSectionSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    items: { type: [String], default: [] },
}, { _id: false });

const WhoShouldUseSectionSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    perfectFor: { type: [String], default: [] },
    notIdealFor: { type: [String], default: [] },
}, { _id: false });

const FundedAccountProcessSchema = new Schema({
    steps: { type: [String], required: true },
}, { _id: false });

const FaqItemSchema = new Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
}, { _id: false });

const TableOfContentsItemSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    icon: { type: String, required: true },
}, { _id: false });

// ============================================================================
// MAIN FIRM REVIEW SCHEMA (COMPLETE)
// ============================================================================

const FirmReviewSchema = new Schema({
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
        index: true,
        trim: true,
        validate: {
            validator: function(v: string) {
                return v.endsWith('-review');
            },
            message: 'Slug must end with "-review"'
        }
    },
    firmName: {
        type: String,
        required: [true, 'Firm name is required'],
        trim: true,
        maxlength: [200, 'Firm name cannot exceed 200 characters']
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [300, 'Title cannot exceed 300 characters']
    },
    subtitle: {
        type: String,
        required: [true, 'Subtitle is required'],
        trim: true,
        maxlength: [500, 'Subtitle cannot exceed 500 characters']
    },
    publishedAt: {
        type: String,
        required: true
    },
    readTime: {
        type: Number,
        required: true,
        min: [0, 'Read time cannot be negative']
    },
    trustScore: {
        type: Number,
        required: true,
        min: [0, 'Trust score cannot be negative'],
        max: [10, 'Trust score cannot exceed 10']
    },
    rating: {
        type: Number,
        required: true,
        min: [0, 'Rating cannot be negative'],
        max: [5, 'Rating cannot exceed 5']
    },
    ratingLabel: {
        type: String,
        required: true,
        trim: true
    },
    introduction: {
        type: String,
        required: true,
        trim: true
    },
    // CORE SECTIONS
    overview: {
        type: OverviewSectionSchema,
        required: true
    },
    whatIs: {
        type: WhatIsSectionSchema,
        required: true
    },
    howDiffers: {
        type: HowDiffersSectionSchema,
        required: true
    },
    programsComparison: {
        type: ProgramsComparisonSectionSchema,
        required: true
    },
    platformsExecution: {
        type: PlatformsExecutionSectionSchema,
        required: true
    },
    // NEW SECTIONS
    payoutsWithdrawal: {
        type: PayoutsWithdrawalSectionSchema,
        required: true
    },
    supportReputation: {
        type: SupportReputationSectionSchema,
        required: true
    },
    traderFeedback: {
        type: TraderFeedbackSectionSchema,
        required: true
    },
    prosCons: {
        type: ProsConsSectionSchema,
        required: true
    },
    redFlags: {
        type: RedFlagsSectionSchema,
        required: true
    },
    whoShouldUse: {
        type: WhoShouldUseSectionSchema,
        required: true
    },
    fundedAccountProcess: {
        type: FundedAccountProcessSchema,
        required: true
    },
    finalVerdict: {
        type: FinalVerdictSectionSchema,
        required: true
    },
    tableOfContents: {
        type: [TableOfContentsItemSchema],
        required: true,
        default: []
    },
    seoTags: {
        type: [String],
        default: []
    },
    faqs: {
        type: [FaqItemSchema],
        default: []
    }
}, {
    timestamps: true,
    collection: 'firmreviews'
});

// ============================================================================
// INDEXES
// ============================================================================

FirmReviewSchema.index({ slug: 1 }, { unique: true });
FirmReviewSchema.index({ firmName: 1 });
FirmReviewSchema.index({ createdAt: -1 });
FirmReviewSchema.index({ 'overview.data.left.value': 1 });
FirmReviewSchema.index({ 'overview.data.right.value': 1 });

// ============================================================================
// INTERFACE DEFINITIONS
// ============================================================================

export interface IFirmReview extends Document, FirmReview {
    createdAt: Date;
    updatedAt: Date;
}

// ============================================================================
// MODEL EXPORT
// ============================================================================

const FirmReviewModel = mongoose.models.FirmReview || mongoose.model<IFirmReview>('FirmReview', FirmReviewSchema);

export default FirmReviewModel;
export { FirmReviewSchema };