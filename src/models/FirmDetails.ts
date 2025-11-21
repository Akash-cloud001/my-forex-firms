import mongoose, { Model, Schema } from "mongoose";

export interface ILeadershipMember {
  name: string;
  role: string;
  verified: boolean;
  publicPresence?: number;
  links?: {
    twitter?: string;
    instagram?: string;
    telegram?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface ISupportChannel {
  type: string;
  link: string;
  preferred?: boolean;
  responseTime?: string;
  status?: "active" | "inactive";
}

export interface IRating {
  platform: string;
  rating: number;
}

export interface IFundingFirm extends Document {
  firmDetails: {
    name: string;
    image?: {
      url: string;
      publicId: string;
      thumbnail: string;
    };
    legalEntityName?: string;
    registrationNumber?: string;
    licenseNumber?: string;
    regulator?: string;
    jurisdiction?: string;
    yearFounded: number;
    status?: string;
    hqAddress?: string;
    languagesSupported?: string[];
    companyDescription?: string;
    officialWebsite?: string;
    brokers?: string[];
    liquidityProviders?: string[];
    totalPayout?: string;
    slug?: string;
  };

  leadership: {
    leadership?: ILeadershipMember[];
  };

  ratings: {
    trustPilotRating?: number;
    otherRatings?: IRating[];
  };

  socialLinks: {
    socialLinks?: Record<string, string>;
  };

  support: {
    channels?: ISupportChannel[];
    avgResolutionTime?: string;
    supportHours?: string;
  };

  compliance: {
    kycRequirements?: string[];
    kycProvider?: string;
    restrictedCountries?: string[];
    regulationsComplied?: string[];
    amlLink?: string;
  };

  transparency: {
    ceoPublic: boolean;
    officeVerified: boolean;
    termsPublicUpdated: boolean;
    payoutProofPublic: boolean;
    thirdPartyAudit: boolean;
    notes?: string;
    transparencyScore?: number;
  };

  trading: {
    leverageMatrix?: Record<
      string,
      {
        Instant?: string;
        "1-Step"?: string;
        "2-Step"?: string;
        "3-step"?: string
      }
    >;
    commissions?: Record<string, string>;
  };

  payments: {
    methods?: string[];
    payoutMethods?: string[];
    baseCurrency?: string;
    minWithdrawal?: number;
    processingTime?: string;
    payoutSchedule?: string;
    refundPolicy?: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const FundingFirmSchema = new Schema<IFundingFirm>(
  {
    firmDetails: {
      name: { type: String, required: true, trim: true },
      image: {
        url: { type: String },
        publicId: { type: String },
        thumbnail: { type: String },
      },
      legalEntityName: { type: String, trim: true },
      registrationNumber: { type: String, trim: true },
      licenseNumber: { type: String, trim: true },
      regulator: { type: String, trim: true },
      jurisdiction: { type: String, trim: true },
      yearFounded: { type: Number, required: true },
      status: { type: String, trim: true },
      hqAddress: { type: String, trim: true },
      languagesSupported: [{ type: String }],
      companyDescription: { type: String },
      officialWebsite: { type: String, trim: true },
      brokers: [{ type: String }],
      liquidityProviders: [{ type: String }],
      totalPayout: { type: String, trim: true },
      slug: { type: String, trim: true },
    },

    leadership: {
      leadership: [
        {
          name: { type: String, required: true },
          role: { type: String, required: true },
          verified: { type: Boolean, default: false },
          publicPresence: { type: Number, min: 0, max: 10 },
          links: {
            twitter: String,
            instagram: String,
            telegram: String,
            linkedin: String,
            website: String,
          },
        },
      ],
    },

    ratings: {
      trustPilotRating: { type: Number, min: 0, max: 5 },
      otherRatings: [
        {
          platform: { type: String, required: true },
          rating: { type: Number, required: true, min: 0, max: 5 },
        },
      ],
    },

    socialLinks: {
      socialLinks: { type: Map, of: String },
    },

    support: {
      channels: [
        {
          type: { type: String, required: true },
          link: { type: String, required: true },
          preferred: { type: Boolean, default: false },
          responseTime: String,
          status: { type: String, enum: ["active", "inactive"] },
        },
      ],
      avgResolutionTime: String,
      supportHours: String,
    },

    compliance: {
      kycRequirements: [String],
      kycProvider: String,
      restrictedCountries: [String],
      regulationsComplied: [String],
      amlLink: String,
    },

    transparency: {
      ceoPublic: { type: Boolean, default: false },
      officeVerified: { type: Boolean, default: false },
      termsPublicUpdated: { type: Boolean, default: false },
      payoutProofPublic: { type: Boolean, default: false },
      thirdPartyAudit: { type: Boolean, default: false },
      notes: String,
      transparencyScore: { type: Number, min: 0, max: 10 },
    },

    trading: {
      leverageMatrix: {
        type: Map,
        of: {
          Instant: String,
          "1-Step": String,
          "2-Step": String,
          "3-step": String
        },
      },
      commissions: { type: Map, of: String },
    },

    payments: {
      methods: [String],
      payoutMethods: [String],
      baseCurrency: String,
      minWithdrawal: Number,
      processingTime: String,
      payoutSchedule: String,
      refundPolicy: String,
    },
  },
  {
    timestamps: true,
    collection: "funding_firms",
  }
);

FundingFirmSchema.index({ "firmDetails.name": 1 });
FundingFirmSchema.index({ "firmDetails.status": 1 });
FundingFirmSchema.index({ createdAt: -1 });

const FundingFirm: Model<IFundingFirm> =
  mongoose.models.FundingFirm ||
  mongoose.model<IFundingFirm>("FundingFirm", FundingFirmSchema);

export default FundingFirm;
