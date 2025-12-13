import { z } from "zod";

export const firmDetailsSchema = z.object({
  name: z.string().min(1, "Firm name is required"),
  imageFile: z.instanceof(File).optional(),
  image: z
    .object({
      url: z.url(),
      publicId: z.string(),
      thumbnail: z.url(),
    })
    .optional().nullable(),
  legalEntityName: z.string().optional(),
  registrationNumber: z.string().optional(),
  licenseNumber: z.string().optional(),
  regulator: z.string().optional(),
  jurisdiction: z.string().optional(),
  yearFounded: z
    .number()
    .min(1900, "Invalid year")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  status: z.string().optional(),
  hqAddress: z.string().optional(),
  languagesSupported: z.array(z.string()).optional(),
  companyDescription: z.string().optional(),
  officialWebsite: z.string().url("Invalid URL").optional().or(z.literal("")),
  brokers: z.array(z.string()).optional(),
  liquidityProviders: z.array(z.string()).optional(),
  totalPayout: z.string().optional(),
  maxAllocation: z.string().optional(),
  slug: z.string().optional(),
  brokerBackedType: z.string().optional(),
  backedBrokerName: z.string().optional(),
});

export const leadershipMemberSchema = z.object({
  name: z.string().min(1, "Leader name is required"),
  role: z.string().min(1, "Role is required"),
  verified: z.boolean(),
  links: z
    .object({
      twitter: z.url().optional().or(z.literal("")),
      instagram: z.url().optional().or(z.literal("")),
      telegram: z.url().optional().or(z.literal("")),
      linkedin: z.url().optional().or(z.literal("")),
      website: z.url().optional().or(z.literal("")),
    })
    .optional(),
});

export const leadershipSchema = z.object({
  leadership: z.array(leadershipMemberSchema).optional(),
});

export const ratingsSchema = z.object({
  trustPilotRating: z.number().min(0).max(5).optional(),
  otherRatings: z
    .array(
      z.object({
        platform: z.string(),
        rating: z.number().min(0).max(5),
      })
    )
    .optional(),
});

export const socialLinksSchema = z.object({
  socialLinks: z
    .record(z.string(), z.string().url().or(z.literal("")))
    .optional(),
});

export const supportChannelSchema = z.object({
  type: z.string().min(1, "Support type is required"),
  link: z.string().min(1, "Support link is required"),
  preferred: z.boolean().optional(),
  responseTime: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export const supportSchema = z.object({
  channels: z.array(supportChannelSchema).optional(),
  avgResolutionTime: z.string().optional(),
  supportHours: z.string().optional(),
});

export const complianceSchema = z.object({
  kycRequirements: z.array(z.string()).optional(),
  kycProvider: z.string().optional(),
  restrictedCountries: z.array(z.string()).optional(),
  regulationsComplied: z.array(z.string()).optional(),
  amlLink: z.url("Invalid URL").optional().or(z.literal("")),
});

export const transparencySchema = z.object({
  ceoPublic: z.boolean(),
  officeVerified: z.boolean().default(false),
  termsPublicUpdated: z.boolean().default(false),
  payoutProofPublic: z.boolean().default(false),
  thirdPartyAudit: z.boolean().default(false),
  notes: z.string().optional(),
  faqLink: z.url("Invalid URL").optional().or(z.literal("")),
});

export const leverageMatrixSchema = z.record(
  z.string(),
  z.object({
    Instant: z.string().optional(),
    "1-Step": z.string().optional(),
    "2-Step": z.string().optional(),
  })
);

export const tradingSchema = z.object({
  leverageMatrix: leverageMatrixSchema.optional(),
  commissions: z.record(z.string(), z.any()).optional(),
  tradingPlatforms: z.array(z.string()).optional(),
});

// Payment Method Enum Values (for validation)
export const PAYMENT_METHODS = [
  'bank_transfer',
  'credit_debit_cards',
  'crypto',
  'e_wallet',
  'apple_pay',
  'google_pay',
  'upi',
  'skrill',
  'paypal',
  'astro_pay',
  'other',
] as const;

export const PAYOUT_METHODS = [
  'bank_transfer',
  'crypto',
  'e_wallet',
  'rise',
  'other',
] as const;

export const paymentsSchema = z.object({
  methods: z.array(z.enum(PAYMENT_METHODS)).optional(),
  payoutMethods: z.array(z.enum(PAYOUT_METHODS)).optional(),
  baseCurrency: z.string().optional(),
  minWithdrawal: z.any().optional(),
  processingTime: z
    .object({
      value: z.number().min(1, "Value must be greater than 0"),
      unit: z.enum(["hours", "days"]),
    })
    .optional(),
  processingTimePolicy: z.enum(["after-approval", "after-request", "no"]).optional(),
  payoutSchedule: z.array(z.string()).optional(),
  refundPolicy: z.string().optional(),
});

export const firmFormSchema = z.object({
  firmDetails: firmDetailsSchema,
  leadership: leadershipSchema,
  ratings: ratingsSchema,
  socialLinks: socialLinksSchema,
  support: supportSchema,
  compliance: complianceSchema,
  transparency: transparencySchema,
  trading: tradingSchema,
  payments: paymentsSchema,
});

export type FirmFormData = z.infer<typeof firmFormSchema>;

export const STORAGE_KEY = "funding-firm-draft";
