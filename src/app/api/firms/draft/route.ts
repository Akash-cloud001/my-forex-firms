import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Firm from '@/models/Firm';
import { uploadFileToBunnyCDN } from '@/lib/bunnycdn';

// Type for form data processing
interface FormDataRecord {
  [key: string]: string | number | boolean | File | object | null;
}

// Type for MongoDB query object
interface MongoQuery {
  [key: string]: string | number | boolean | Date | { $gte?: number | Date; $lte?: number | Date } | { $search: string };
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const contentType = request.headers.get('content-type');
    let draftData: FormDataRecord = {};
    let logoFile: File | null = null;

    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      for (const [key, value] of formData.entries()) {
        if (key === 'logoFile' && value instanceof File) {
          logoFile = value;
        } else if (typeof value === 'string') {
          try {
            draftData[key] = JSON.parse(value);
          } catch {
            draftData[key] = value;
          }
        }
      }
    } else {
      draftData = await request.json();
    }

    // Handle logo file upload to BunnyCDN for drafts
    if (logoFile) {
      try {
        const fileBuffer = Buffer.from(await logoFile.arrayBuffer());
        const bunnyFile = await uploadFileToBunnyCDN(
          fileBuffer,
          logoFile.name,
          logoFile.type,
          'draft-logos' // Store drafts in a separate folder
        );

        draftData.logoUrl = bunnyFile.url;
        draftData.logoFile = bunnyFile;
      } catch (error) {
        console.error('Error uploading draft logo to BunnyCDN:', error);
        return NextResponse.json(
          { error: 'Failed to upload logo file' },
          { status: 500 }
        );
      }
    } else {
      // Ensure logoUrl is empty string if no logo file
      draftData.logoUrl = '';
      draftData.logoFile = null;
    }

    // Transform flat form data into nested schema structure (same as main API)
    const transformedData = {
      // Basic Information (Step 1)
      firmName: draftData.firmName,
      logoUrl: draftData.logoUrl,
      logoFile: draftData.logoFile,
      legalEntityName: draftData.legalEntityName,
      registrationNumber: draftData.registrationNumber,
      jurisdiction: draftData.jurisdiction,
      yearFounded: draftData.yearFounded,
      headquartersAddress: draftData.headquartersAddress,
      ceoFounderName: draftData.ceoFounderName,
      leadershipLinks: draftData.leadershipLinks,
      officialWebsite: draftData.officialWebsite,
      status: draftData.status,
      shortDescription: draftData.shortDescription,
      reviews:{
        trustPilotRating: draftData.trustPilotRating || 0,
        totalLikes: draftData.totalLikes || 0,
        totalDislikes: draftData.totalDislikes || 0,
      },
      // Trading Infrastructure (Step 2)
      tradingInfrastructure: {
        tradingPlatforms: draftData.tradingPlatforms ? [draftData.tradingPlatforms] : [],
        dataFeedsLiquidityProviders: draftData.dataFeedsLiquidityProviders ? [draftData.dataFeedsLiquidityProviders] : []
      },
      
      // Payout Financial (Step 3)
      payoutFinancial: {
        profitSplit: draftData.profitSplit,
        firstPayoutTiming: draftData.firstPayoutTiming,
        regularPayoutCycle: draftData.regularPayoutCycle,
        minimumPayoutAmount: draftData.minimumPayoutAmount,
        averagePayoutProcessingTime: draftData.averagePayoutProcessingTime,
        fastestSlowestPayoutDuration: draftData.fastestSlowestPayoutDuration,
        payoutMethods: draftData.payoutMethods ? [draftData.payoutMethods] : [],
        payoutFeesFxCosts: draftData.payoutFeesFxCosts,
        totalPayoutsAllTime: draftData.totalPayoutsAllTime,
        largestSinglePayout: draftData.largestSinglePayout,
        monthlyPayoutCounts: draftData.monthlyPayoutCounts,
        payoutProofLinks: draftData.payoutProofLinks ? [draftData.payoutProofLinks] : []
      },
      
      // Challenges (Step 4) - already in correct format
      challenges: draftData.challenges || [],
      
      // Trading Environment (Step 5)
      tradingEnvironment: {
        typicalSpreads: draftData.typicalSpreads,
        commissions: draftData.commissions,
        slippageSwapPolicies: draftData.slippageSwapPolicies,
        riskDeskModel: draftData.riskDeskModel,
        copyTradeProviders: draftData.copyTradeProviders ? [draftData.copyTradeProviders] : [],
        mobileSupport: draftData.mobileSupport ? [draftData.mobileSupport] : [],
        ruleMatrix: {
          newsTrading: draftData.newsTrading || false,
          weekendHolding: draftData.weekendHolding || false,
          eaUsage: draftData.eaUsage || false,
          copyTrading: draftData.copyTrading || false,
          hedging: draftData.hedging || false,
          scalping: draftData.scalping || false
        },
        ruleDetails: {
          newsTradingNotes: draftData.newsTradingNotes,
          weekendHoldingNotes: draftData.weekendHoldingNotes,
          eaUsageNotes: draftData.eaUsageNotes,
          copyTradingNotes: draftData.copyTradingNotes,
          hedgingNotes: draftData.hedgingNotes,
          scalpingNotes: draftData.scalpingNotes
        }
      },
      
      // Support Operations (Step 6)
      supportOperations: {
        supportChannels: draftData.supportChannels ? [draftData.supportChannels] : [],
        averageFirstResponseTime: draftData.averageFirstResponseTime,
        averageResolutionTime: draftData.averageResolutionTime,
        supportHours: draftData.supportHours,
        escalationPolicy: draftData.escalationPolicy,
        kycRequirements: draftData.kycRequirements,
        restrictedCountries: draftData.restrictedCountries ? [draftData.restrictedCountries] : [],
        amlComplianceLink: draftData.amlComplianceLink
      },
      
      // Transparency Verification (Step 7)
      transparencyVerification: {
        ceoPublic: draftData.ceoPublic || false,
        entityOfficeVerified: draftData.entityOfficeVerified || false,
        termsPublicUpdated: draftData.termsPublicUpdated || false,
        payoutProofsPublic: draftData.payoutProofsPublic || false,
        thirdPartyAudit: draftData.thirdPartyAudit || false,
        transparencyNotes: draftData.transparencyNotes
      },
      
      // Administration Audit (Step 8)
      administrationAudit: {
        dataSource: draftData.dataSource,
        verifiedBy: draftData.verifiedBy,
        verificationDate: draftData.verificationDate,
        nextReviewDate: draftData.nextReviewDate,
        changelogNotes: draftData.changelogNotes
      },
      
      // System fields
      createdBy: draftData.createdBy || 'current-user-id',
      lastModifiedBy: draftData.lastModifiedBy || 'current-user-id',
      isDraft: true,
      isPublished: false
    };
    
    const firm = new Firm(transformedData);
    await firm.save();
    
    return NextResponse.json({ firm, firmId: firm._id });
  } catch (error) {
    console.error('Error saving draft:', error);
    return NextResponse.json(
      { error: 'Failed to save draft' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const createdBy = searchParams.get('createdBy');
    
    const query: MongoQuery = { isDraft: true };
    
    if (createdBy) {
      query.createdBy = createdBy;
    }
    
    const firms = await Firm.find(query)
      .sort({ updatedAt: -1 })
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
    console.error('Error fetching drafts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drafts' },
      { status: 500 }
    );
  }
}
