import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Firm from '@/models/Firm';
import {  deleteFileFromBunnyCDN } from '@/lib/bunnycdn';
import { deleteFromCloudinary, uploadToCloudinary } from '@/services/cloudinary';
import { FirmValidationService } from '@/services/firm-validation-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const firm = await Firm.findById(id);
    
    if (!firm) {
      return NextResponse.json({ error: 'Firm not found' }, { status: 404 });
    }

    return NextResponse.json(firm);
  } catch (error) {
    console.error('Error fetching firm:', error);
    return NextResponse.json({ error: 'Failed to fetch firm' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const firmId = await params.id;

    if (!firmId) {
      return NextResponse.json(
        { error: "Firm ID is required" },
        { status: 400 }
      );
    }

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

    // Find existing firm
    const existingFirm = await Firm.findById(firmId);
    
    if (!existingFirm) {
      return NextResponse.json(
        { error: "Firm not found" },
        { status: 404 }
      );
    }

    // Handle logo upload if new file is provided
    if (logoFile) {
      try {
        // Delete old logo from Cloudinary if exists
        if (existingFirm.logoFile?.public_id) {
          await deleteFromCloudinary(existingFirm.logoFile.public_id);
        }

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
    }

    // // Prepare data for validation
    // const preparedData = FirmValidationService.prepareDataForValidation(firmData);

    // // Validate data using Zod schema (partial validation for updates)
    // const validationResult = FirmValidationService.validatePartialFirmData(preparedData);

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

    // console.log("Validation passed for update!");

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

    const updateData = {
      // Step 1 — Basic Information
      ...(firmData.firmName && { firmName: firmData.firmName }),
      ...(firmData.logoUrl !== undefined && { logoUrl: firmData.logoUrl }),
      ...(firmData.logoFile !== undefined && { logoFile: firmData.logoFile }),
      ...(firmData.legalEntityName && { legalEntityName: firmData.legalEntityName }),
      ...(firmData.registrationNumber && { registrationNumber: firmData.registrationNumber }),
      ...(firmData.jurisdiction && { jurisdiction: firmData.jurisdiction }),
      ...(firmData.yearFounded && { yearFounded: toNumber(firmData.yearFounded) }),
      ...(firmData.headquartersAddress && { headquartersAddress: firmData.headquartersAddress }),
      ...(firmData.ceoFounderName && { ceoFounderName: firmData.ceoFounderName }),
      ...(firmData.leadershipLinks !== undefined && { leadershipLinks: firmData.leadershipLinks }),
      ...(firmData.officialWebsite && { officialWebsite: firmData.officialWebsite }),
      ...(firmData.status && { status: firmData.status }),
      ...(firmData.shortDescription && { shortDescription: firmData.shortDescription }),
      
      // Reviews (update existing or create new)
      ...(firmData.trustPilotRating !== undefined && {
        reviews: {
          ...existingFirm.reviews,
          trustPilotRating: toNumber(firmData.trustPilotRating) || 0,
        },
      }),

      // Step 2 — Trading Infrastructure
      ...(firmData.tradingPlatforms !== undefined && {
        tradingInfrastructure: {
          ...existingFirm.tradingInfrastructure,
          tradingPlatforms: toArray(firmData.tradingPlatforms),
        },
      }),
      ...(firmData.dataFeedsLiquidityProviders !== undefined && {
        tradingInfrastructure: {
          ...existingFirm.tradingInfrastructure,
          dataFeedsLiquidityProviders: toArray(firmData.dataFeedsLiquidityProviders),
        },
      }),

      // Step 3 — Payout Financial
      ...(Object.keys(firmData).some(key => key.includes('payout') || key.includes('Payout')) && {
        payoutFinancial: {
          ...existingFirm.payoutFinancial,
          ...(firmData.profitSplit && { profitSplit: firmData.profitSplit }),
          ...(firmData.firstPayoutTiming !== undefined && { firstPayoutTiming: firmData.firstPayoutTiming }),
          ...(firmData.regularPayoutCycle && { regularPayoutCycle: firmData.regularPayoutCycle }),
          ...(firmData.minimumPayoutAmount && { minimumPayoutAmount: firmData.minimumPayoutAmount }),
          ...(firmData.averagePayoutProcessingTime && { averagePayoutProcessingTime: firmData.averagePayoutProcessingTime }),
          ...(firmData.fastestSlowestPayoutDuration !== undefined && { fastestSlowestPayoutDuration: firmData.fastestSlowestPayoutDuration }),
          ...(firmData.payoutMethods !== undefined && { payoutMethods: toArray(firmData.payoutMethods) }),
          ...(firmData.payoutFeesFxCosts !== undefined && { payoutFeesFxCosts: firmData.payoutFeesFxCosts }),
          ...(firmData.totalPayoutsAllTime !== undefined && { totalPayoutsAllTime: firmData.totalPayoutsAllTime }),
          ...(firmData.largestSinglePayout !== undefined && { largestSinglePayout: firmData.largestSinglePayout }),
          ...(firmData.monthlyPayoutCounts !== undefined && { monthlyPayoutCounts: firmData.monthlyPayoutCounts }),
          ...(firmData.payoutProofLinks !== undefined && { payoutProofLinks: toArray(firmData.payoutProofLinks) }),
        },
      }),

      // Step 4 — Challenges
      ...(firmData.challengeInformation && {
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
          : [],
      }),

      // Step 5 — Trading Environment
      ...(Object.keys(firmData).some(key => 
        ['typicalSpreads', 'commissions', 'slippageSwapPolicies', 'riskDeskModel', 'copyTradeProviders', 'mobileSupport', 'newsTrading', 'weekendHolding', 'eaUsage', 'copyTrading', 'hedging', 'scalping'].includes(key)
      ) && {
        tradingEnvironment: {
          ...existingFirm.tradingEnvironment,
          ...(firmData.typicalSpreads && { typicalSpreads: firmData.typicalSpreads }),
          ...(firmData.commissions && { commissions: firmData.commissions }),
          ...(firmData.slippageSwapPolicies !== undefined && { slippageSwapPolicies: firmData.slippageSwapPolicies }),
          ...(firmData.riskDeskModel && { riskDeskModel: firmData.riskDeskModel }),
          ...(firmData.copyTradeProviders !== undefined && { copyTradeProviders: toArray(firmData.copyTradeProviders) }),
          ...(firmData.mobileSupport !== undefined && { mobileSupport: toArray(firmData.mobileSupport) }),
          ruleMatrix: {
            ...existingFirm.tradingEnvironment?.ruleMatrix,
            ...(firmData.newsTrading !== undefined && { newsTrading: toBool(firmData.newsTrading) }),
            ...(firmData.weekendHolding !== undefined && { weekendHolding: toBool(firmData.weekendHolding) }),
            ...(firmData.eaUsage !== undefined && { eaUsage: toBool(firmData.eaUsage) }),
            ...(firmData.copyTrading !== undefined && { copyTrading: toBool(firmData.copyTrading) }),
            ...(firmData.hedging !== undefined && { hedging: toBool(firmData.hedging) }),
            ...(firmData.scalping !== undefined && { scalping: toBool(firmData.scalping) }),
          },
          ruleDetails: {
            ...existingFirm.tradingEnvironment?.ruleDetails,
            ...(firmData.newsTradingNotes !== undefined && { newsTradingNotes: firmData.newsTradingNotes }),
            ...(firmData.weekendHoldingNotes !== undefined && { weekendHoldingNotes: firmData.weekendHoldingNotes }),
            ...(firmData.eaUsageNotes !== undefined && { eaUsageNotes: firmData.eaUsageNotes }),
            ...(firmData.copyTradingNotes !== undefined && { copyTradingNotes: firmData.copyTradingNotes }),
            ...(firmData.hedgingNotes !== undefined && { hedgingNotes: firmData.hedgingNotes }),
            ...(firmData.scalpingNotes !== undefined && { scalpingNotes: firmData.scalpingNotes }),
          },
        },
      }),

      // Step 6 — Support Operations
      ...(Object.keys(firmData).some(key => key.includes('support') || key.includes('kyc') || key.includes('aml')) && {
        supportOperations: {
          ...existingFirm.supportOperations,
          ...(firmData.supportChannels !== undefined && { supportChannels: toArray(firmData.supportChannels) }),
          ...(firmData.averageFirstResponseTime && { averageFirstResponseTime: firmData.averageFirstResponseTime }),
          ...(firmData.averageResolutionTime && { averageResolutionTime: firmData.averageResolutionTime }),
          ...(firmData.supportHours && { supportHours: firmData.supportHours }),
          ...(firmData.escalationPolicy !== undefined && { escalationPolicy: firmData.escalationPolicy }),
          ...(firmData.kycRequirements && { kycRequirements: firmData.kycRequirements }),
          ...(firmData.restrictedCountries !== undefined && { restrictedCountries: toArray(firmData.restrictedCountries) }),
          ...(firmData.amlComplianceLink !== undefined && { amlComplianceLink: firmData.amlComplianceLink }),
        },
      }),

      // Step 7 — Transparency Verification
      ...(Object.keys(firmData).some(key => key.includes('ceo') || key.includes('entity') || key.includes('terms') || key.includes('payout') || key.includes('audit') || key.includes('transparency')) && {
        transparencyVerification: {
          ...existingFirm.transparencyVerification,
          ...(firmData.ceoPublic !== undefined && { ceoPublic: toBool(firmData.ceoPublic) }),
          ...(firmData.entityOfficeVerified !== undefined && { entityOfficeVerified: toBool(firmData.entityOfficeVerified) }),
          ...(firmData.termsPublicUpdated !== undefined && { termsPublicUpdated: toBool(firmData.termsPublicUpdated) }),
          ...(firmData.payoutProofsPublic !== undefined && { payoutProofsPublic: toBool(firmData.payoutProofsPublic) }),
          ...(firmData.thirdPartyAudit !== undefined && { thirdPartyAudit: toBool(firmData.thirdPartyAudit) }),
          ...(firmData.transparencyNotes !== undefined && { transparencyNotes: firmData.transparencyNotes }),
        },
      }),

      // Step 8 — Administration Audit
      ...(Object.keys(firmData).some(key => key.includes('dataSource') || key.includes('verified') || key.includes('review') || key.includes('changelog')) && {
        administrationAudit: {
          ...existingFirm.administrationAudit,
          ...(firmData.dataSource && { dataSource: firmData.dataSource }),
          ...(firmData.verifiedBy && { verifiedBy: firmData.verifiedBy }),
          ...(firmData.verificationDate && { verificationDate: firmData.verificationDate }),
          ...(firmData.nextReviewDate && { nextReviewDate: firmData.nextReviewDate }),
          ...(firmData.changelogNotes !== undefined && { changelogNotes: firmData.changelogNotes }),
        },
      }),

      // System fields
      lastModifiedBy: firmData.lastModifiedBy || "current-user-id",
      updatedAt: new Date(),
    };

    const updatedFirm = await Firm.findByIdAndUpdate(
      firmId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedFirm) {
      return NextResponse.json(
        { error: "Failed to update firm" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      firm: updatedFirm,
      message: "Firm updated successfully",
    });
    
  } catch (error) {
    console.error("Error updating firm:", error);
    
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
      { error: "Failed to update firm" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    // Get firm to delete associated files
    const firm = await Firm.findById(id);
    if (firm?.logoFile?.url) {
      await deleteFileFromBunnyCDN(firm.logoFile.url);
    }

    const deletedFirm = await Firm.findByIdAndDelete(id);
    
    if (!deletedFirm) {
      return NextResponse.json({ error: 'Firm not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Firm deleted successfully' });
  } catch (error) {
    console.error('Error deleting firm:', error);
    return NextResponse.json({ error: 'Failed to delete firm' }, { status: 500 });
  }
}