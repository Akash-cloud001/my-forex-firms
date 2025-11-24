import { z } from "zod";

export const firmDetailsSchema = z.object({
  name: z.string().min(1, "Firm name is required"),
  imageFile: z.instanceof(File).optional(),
  image: z
    .object({
      url: z.string().url(),
      publicId: z.string(),
      thumbnail: z.string().url(),
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
  slug: z.string().optional(),
});

export const leadershipMemberSchema = z.object({
  name: z.string().min(1, "Leader name is required"),
  role: z.string().min(1, "Role is required"),
  verified: z.boolean(),
  links: z
    .object({
      twitter: z.string().url().optional().or(z.literal("")),
      instagram: z.string().url().optional().or(z.literal("")),
      telegram: z.string().url().optional().or(z.literal("")),
      linkedin: z.string().url().optional().or(z.literal("")),
      website: z.string().url().optional().or(z.literal("")),
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
  amlLink: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const transparencySchema = z.object({
  ceoPublic: z.boolean(),
  officeVerified: z.boolean().default(false),
  termsPublicUpdated: z.boolean().default(false),
  payoutProofPublic: z.boolean().default(false),
  thirdPartyAudit: z.boolean().default(false),
  notes: z.string().optional(),
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
});

export const paymentsSchema = z.object({
  methods: z.array(z.string()).optional(),
  payoutMethods: z.array(z.string()).optional(),
  baseCurrency: z.string().optional(),
  minWithdrawal: z.number().optional(),
  processingTime: z.string().optional(),
  payoutSchedule: z.string().optional(),
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
