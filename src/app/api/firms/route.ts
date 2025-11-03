import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Firm from '@/models/Firm';
// import { uploadFileToBunnyCDN } from '@/lib/bunnycdn';
import { uploadToCloudinary } from '@/services/cloudinary';
import { FirmValidationService } from '@/services/firm-validation-service';

// Type for form data processing
interface FormDataRecord {
  [key: string]: string | number | boolean | File | object | null;
}

// Type for MongoDB query object
interface MongoQuery {
  [key: string]: string | number | boolean | Date | { $gte?: number | Date; $lte?: number | Date } | { $search: string };
}

// Type for MongoDB sort object
interface MongoSort {
  [key: string]: 1 | -1;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const isDraft = searchParams.get('isDraft');
    const jurisdiction = searchParams.get('jurisdiction');
    const yearFoundedMin = searchParams.get('yearFoundedMin');
    const yearFoundedMax = searchParams.get('yearFoundedMax');
    const isPublished = searchParams.get('isPublished');
    const createdBy = searchParams.get('createdBy');
    const dateRangeStart = searchParams.get('dateRangeStart');
    const dateRangeEnd = searchParams.get('dateRangeEnd');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    const query: MongoQuery = {};
    
    // Build query filters
    if (status) query.status = status;
    if (isDraft) query.isDraft = isDraft === 'true';
    if (isPublished) query.isPublished = isPublished === 'true';
    if (jurisdiction) query.jurisdiction = jurisdiction;
    if (createdBy) query.createdBy = createdBy;
    
    // Year range filter
    if (yearFoundedMin || yearFoundedMax) {
      query.yearFounded = {};
      if (yearFoundedMin) query.yearFounded.$gte = parseInt(yearFoundedMin);
      if (yearFoundedMax) query.yearFounded.$lte = parseInt(yearFoundedMax);
    }
    
    // Date range filter
    if (dateRangeStart || dateRangeEnd) {
      query.createdAt = {};
      if (dateRangeStart) query.createdAt.$gte = new Date(dateRangeStart);
      if (dateRangeEnd) query.createdAt.$lte = new Date(dateRangeEnd);
    }
    
    // Text search
    if (search) {
      query.$text = { $search: search };
    }
    
    // Build sort object
    const sort: MongoSort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const firms = await Firm.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email');
    
    const total = await Firm.countDocuments(query);
    
    return NextResponse.json({
      firms,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching firms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch firms' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const contentType = request.headers.get("content-type");
    let firmData: Record<string, any> = {};
    let logoFile: File | null = null;

    // Parse form data
    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();

      for (const [key, value] of formData.entries()) {
        if (key === "logoFile") {
          if (value instanceof File) {
            logoFile = value;
          } else if (value && typeof value === 'object' && 'type' in value) {
            const blobValue = value as Blob;
            logoFile = new File([blobValue], 'logo.jpg', { type: blobValue.type || 'image/jpeg' });
          }
        } else if (typeof value === "string") {
          try {
            firmData[key] = JSON.parse(value);
          } catch {
            firmData[key] = value;
          }
        }
      }
    } else {
      firmData = await request.json();
    }

    // Handle logo upload first (before validation)
    if (logoFile) {
      try {
        const uploadResult = await uploadToCloudinary(logoFile);

        if (!uploadResult.success) {
          return NextResponse.json(
            { error: uploadResult.message || "Failed to upload logo file" },
            { status: 500 }
          );
        }

        firmData.logoUrl = uploadResult.url;
        firmData.logoFile = {
          filename: logoFile.name,
          url: uploadResult.url,
          public_id: uploadResult.public_id,
          size: logoFile.size,
          mimeType: logoFile.type,
        };
      } catch (error) {
        console.error("Error uploading logo to Cloudinary:", error);
        return NextResponse.json(
          { error: "Failed to upload logo file" },
          { status: 500 }
        );
      }
    } else {
      firmData.logoUrl = firmData.logoUrl || "";
      firmData.logoFile = null;
    }
    // const preparedData = FirmValidationService.prepareDataForValidation(firmData);
    // const validationResult = FirmValidationService.validateFirmData(preparedData);
    // if (!validationResult.success) {
    //   console.error("Validation errors:", validationResult.errors);    
    //   return NextResponse.json(
    //     {
    //       error: validationResult.errorMessage,
    //       validationErrors: validationResult.errors,
    //       details: FirmValidationService.formatValidationErrors(validationResult.errors || []),
    //     },
    //     { status: 400 }
    //   );
    // }

    // console.log(" Validation passed!");
//  if (firmData.registrationNumber) {
//       const existingFirm = await Firm.findOne({ registrationNumber: firmData.registrationNumber });
//       if (existingFirm) {
//         return NextResponse.json(
//           {
//             error: `A firm with registration number "${firmData.registrationNumber}" already exists.`,
//             field: "registrationNumber",
//           },
//           { status: 400 }
//         );
//       }
//     }
    // Helper functions for data transformation
    const toArray = (val: any) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      if (typeof val === "string" && val.trim() !== "")
        return val.split(",").map((v) => v.trim());
      return [];
    };

    const toBool = (val: any) => {
      if (typeof val === "boolean") return val;
      if (typeof val === "string") return val === "true" || val === "True";
      return !!val;
    };

    const toNumber = (val: any) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    };

    console.log("🚀 ~ POST ~ firmData:", firmData);

    // Transform validated data to database format
    const transformedData = {
      // Step 1 — Basic Information
      firmName: firmData.firmName,
      logoUrl: firmData.logoUrl,
      logoFile: firmData.logoFile,
      legalEntityName: firmData.legalEntityName,
      registrationNumber: firmData.registrationNumber,
      jurisdiction: firmData.jurisdiction,
      yearFounded: toNumber(firmData.yearFounded),
      headquartersAddress: firmData.headquartersAddress,
      ceoFounderName: firmData.ceoFounderName,
      leadershipLinks: firmData.leadershipLinks,
      officialWebsite: firmData.officialWebsite,
      status: firmData.status || "active",
      shortDescription: firmData.shortDescription,
      reviews: {
        trustPilotRating: toNumber(firmData.trustPilotRating) || 0,
        totalLikes: toNumber(firmData.totalLikes) || 0,
        totalDislikes: toNumber(firmData.totalDislikes) || 0,
      },

      // Step 2 — Trading Infrastructure
      tradingInfrastructure: {
        tradingPlatforms: toArray(firmData.tradingPlatforms),
        dataFeedsLiquidityProviders: toArray(
          firmData.dataFeedsLiquidityProviders
        ),
      },

      // Step 3 — Payout Financial
      payoutFinancial: {
        profitSplit: firmData.profitSplit,
        firstPayoutTiming: firmData.firstPayoutTiming,
        regularPayoutCycle: firmData.regularPayoutCycle,
        minimumPayoutAmount: firmData.minimumPayoutAmount,
        averagePayoutProcessingTime: firmData.averagePayoutProcessingTime,
        fastestSlowestPayoutDuration: firmData.fastestSlowestPayoutDuration,
        payoutMethods: toArray(firmData.payoutMethods),
        payoutFeesFxCosts: firmData.payoutFeesFxCosts,
        totalPayoutsAllTime: firmData.totalPayoutsAllTime,
        largestSinglePayout: firmData.largestSinglePayout,
        monthlyPayoutCounts: firmData.monthlyPayoutCounts,
        payoutProofLinks: toArray(firmData.payoutProofLinks),
      },

      // Step 4 — Challenges
      challenges: Array.isArray(firmData.challengeInformation)
        ? firmData.challengeInformation.map((challenge: any) => ({
            challengeName: challenge.challengeName,
            challengeType: challenge.challengeType,
            accountSizesPricing: challenge.accountSizesPricing,
            profitSplit: challenge.profitSplit,
            leverageBreakdown: challenge.leverageBreakdown,
            timeLimits: challenge.timeLimits,
            minimumTradingDays: challenge.minimumTradingDays,
            step1Step2Targets: challenge.step1Step2Targets,
            dailyMaxDrawdown: challenge.dailyMaxDrawdown,
            maxExposureLots: challenge.maxExposureLots,
            refundTerms: challenge.refundTerms || "",
            scalingPlan: challenge.scalingPlan || "",
            allowedInstruments: challenge.allowedInstruments || "",
            rules: challenge.rules || "",
            bonusPromoPolicy: challenge.bonusPromoPolicy || "",
            termsUrl: challenge.termsUrl || "",
            termsLastUpdated: challenge.termsLastUpdated || null,
          }))
        : firmData.challenges || [],

      // Step 5 — Trading Environment
      tradingEnvironment: {
        typicalSpreads: firmData.typicalSpreads || "",
        commissions: firmData.commissions || "",
        slippageSwapPolicies: firmData.slippageSwapPolicies || "",
        riskDeskModel: firmData.riskDeskModel || "",
        copyTradeProviders: toArray(firmData.copyTradeProviders),
        mobileSupport: toArray(firmData.mobileSupport),
        ruleMatrix: {
          newsTrading: toBool(firmData.newsTrading),
          weekendHolding: toBool(firmData.weekendHolding),
          eaUsage: toBool(firmData.eaUsage),
          copyTrading: toBool(firmData.copyTrading),
          hedging: toBool(firmData.hedging),
          scalping: toBool(firmData.scalping),
        },
        ruleDetails: {
          newsTradingNotes: firmData.newsTradingNotes || "",
          weekendHoldingNotes: firmData.weekendHoldingNotes || "",
          eaUsageNotes: firmData.eaUsageNotes || "",
          copyTradingNotes: firmData.copyTradingNotes || "",
          hedgingNotes: firmData.hedgingNotes || "",
          scalpingNotes: firmData.scalpingNotes || "",
        },
      },

      // Step 6 — Support Operations
      supportOperations: {
        supportChannels: toArray(firmData.supportChannels),
        averageFirstResponseTime: firmData.averageFirstResponseTime || "",
        averageResolutionTime: firmData.averageResolutionTime || "",
        supportHours: firmData.supportHours || "",
        escalationPolicy: firmData.escalationPolicy || "",
        kycRequirements: firmData.kycRequirements || "",
        restrictedCountries: toArray(firmData.restrictedCountries),
        amlComplianceLink: firmData.amlComplianceLink || "",
      },

      // Step 7 — Transparency Verification
      transparencyVerification: {
        ceoPublic: toBool(firmData.ceoPublic),
        entityOfficeVerified: toBool(firmData.entityOfficeVerified),
        termsPublicUpdated: toBool(firmData.termsPublicUpdated),
        payoutProofsPublic: toBool(firmData.payoutProofsPublic),
        thirdPartyAudit: toBool(firmData.thirdPartyAudit),
        transparencyNotes: firmData.transparencyNotes || "",
      },

      // Step 8 — Administration Audit
      administrationAudit: {
        dataSource: firmData.dataSource || "",
        verifiedBy: firmData.verifiedBy || "",
        verificationDate: firmData.verificationDate || null,
        nextReviewDate: firmData.nextReviewDate || null,
        changelogNotes: firmData.changelogNotes || "",
      },

      // System fields
      createdBy: firmData.createdBy || "current-user-id",
      lastModifiedBy: firmData.lastModifiedBy || "current-user-id",
      isDraft: firmData.isDraft ?? false,
      isPublished: firmData.isPublished ?? false,
    };

    // Save to database
    const firm = new Firm(transformedData);
    await firm.save();

    return NextResponse.json({ 
      success: true,
      firm, 
      firmId: firm._id 
    });
    
  } catch (error:unknown) {
    console.error("Error creating firm:", error);
    
    // Handle Mongoose validation errors
  if (error instanceof Error && (error as any).name === "ValidationError") {
      return NextResponse.json(
        { 
          error: "Database validation failed",
          details: error.message 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create firm" },
      { status: 500 }
    );
  }
}