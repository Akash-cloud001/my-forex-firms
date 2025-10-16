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
    
    const contentType = request.headers.get('content-type');
    let firmData: FormDataRecord = {};
    let logoFile: File | null = null;
    
    if (contentType?.includes('multipart/form-data')) {
      // Handle FormData (with file upload)
      const formData = await request.formData();
      
      for (const [key, value] of formData.entries()) {
        if (key === 'logoFile' && value instanceof File) {
          logoFile = value;
        } else if (typeof value === 'string') {
          try {
            firmData[key] = JSON.parse(value);
          } catch {
            firmData[key] = value;
          }
        }
      }
    } else {
      // Handle JSON data
      firmData = await request.json();
    }
    
    // Handle logo file upload to BunnyCDN
    if (logoFile) {
      try {
        const fileBuffer = Buffer.from(await logoFile.arrayBuffer());
        const bunnyFile = await uploadFileToBunnyCDN(
          fileBuffer,
          logoFile.name,
          logoFile.type,
          'firm-logos'
        );

        firmData.logoUrl = bunnyFile.url;
        firmData.logoFile = bunnyFile;
      } catch (error) {
        console.error('Error uploading logo to BunnyCDN:', error);
        return NextResponse.json(
          { error: 'Failed to upload logo file' },
          { status: 500 }
        );
      }
    } else {
      // Ensure logoUrl is empty string if no logo file
      firmData.logoUrl = '';
      firmData.logoFile = null;
    }
    
    // Transform flat form data into nested schema structure
    const transformedData = {
      // Basic Information (Step 1)
      firmName: firmData.firmName,
      logoUrl: firmData.logoUrl,
      logoFile: firmData.logoFile,
      legalEntityName: firmData.legalEntityName,
      registrationNumber: firmData.registrationNumber,
      jurisdiction: firmData.jurisdiction,
      yearFounded: firmData.yearFounded,
      headquartersAddress: firmData.headquartersAddress,
      ceoFounderName: firmData.ceoFounderName,
      leadershipLinks: firmData.leadershipLinks,
      officialWebsite: firmData.officialWebsite,
      status: firmData.status,
      shortDescription: firmData.shortDescription,
      reviews:{
        trustPilotRating: firmData.trustPilotRating || 0,
        totalLikes: firmData.totalLikes || 0,
        totalDislikes: firmData.totalDislikes || 0,
      },
      // Trading Infrastructure (Step 2)
      tradingInfrastructure: {
        tradingPlatforms: firmData.tradingPlatforms ? [firmData.tradingPlatforms] : [],
        dataFeedsLiquidityProviders: firmData.dataFeedsLiquidityProviders ? [firmData.dataFeedsLiquidityProviders] : []
      },
      
      // Payout Financial (Step 3)
      payoutFinancial: {
        profitSplit: firmData.profitSplit,
        firstPayoutTiming: firmData.firstPayoutTiming,
        regularPayoutCycle: firmData.regularPayoutCycle,
        minimumPayoutAmount: firmData.minimumPayoutAmount,
        averagePayoutProcessingTime: firmData.averagePayoutProcessingTime,
        fastestSlowestPayoutDuration: firmData.fastestSlowestPayoutDuration,
        payoutMethods: firmData.payoutMethods ? [firmData.payoutMethods] : [],
        payoutFeesFxCosts: firmData.payoutFeesFxCosts,
        totalPayoutsAllTime: firmData.totalPayoutsAllTime,
        largestSinglePayout: firmData.largestSinglePayout,
        monthlyPayoutCounts: firmData.monthlyPayoutCounts,
        payoutProofLinks: firmData.payoutProofLinks ? [firmData.payoutProofLinks] : []
      },
      
      // Challenges (Step 4) - already in correct format
      challenges: firmData.challenges || [],
      
      // Trading Environment (Step 5)
      tradingEnvironment: {
        typicalSpreads: firmData.typicalSpreads,
        commissions: firmData.commissions,
        slippageSwapPolicies: firmData.slippageSwapPolicies,
        riskDeskModel: firmData.riskDeskModel,
        copyTradeProviders: firmData.copyTradeProviders ? [firmData.copyTradeProviders] : [],
        mobileSupport: firmData.mobileSupport ? [firmData.mobileSupport] : [],
        ruleMatrix: {
          newsTrading: firmData.newsTrading || false,
          weekendHolding: firmData.weekendHolding || false,
          eaUsage: firmData.eaUsage || false,
          copyTrading: firmData.copyTrading || false,
          hedging: firmData.hedging || false,
          scalping: firmData.scalping || false
        },
        ruleDetails: {
          newsTradingNotes: firmData.newsTradingNotes,
          weekendHoldingNotes: firmData.weekendHoldingNotes,
          eaUsageNotes: firmData.eaUsageNotes,
          copyTradingNotes: firmData.copyTradingNotes,
          hedgingNotes: firmData.hedgingNotes,
          scalpingNotes: firmData.scalpingNotes
        }
      },
      
      // Support Operations (Step 6)
      supportOperations: {
        supportChannels: firmData.supportChannels ? [firmData.supportChannels] : [],
        averageFirstResponseTime: firmData.averageFirstResponseTime,
        averageResolutionTime: firmData.averageResolutionTime,
        supportHours: firmData.supportHours,
        escalationPolicy: firmData.escalationPolicy,
        kycRequirements: firmData.kycRequirements,
        restrictedCountries: firmData.restrictedCountries ? [firmData.restrictedCountries] : [],
        amlComplianceLink: firmData.amlComplianceLink
      },
      
      // Transparency Verification (Step 7)
      transparencyVerification: {
        ceoPublic: firmData.ceoPublic || false,
        entityOfficeVerified: firmData.entityOfficeVerified || false,
        termsPublicUpdated: firmData.termsPublicUpdated || false,
        payoutProofsPublic: firmData.payoutProofsPublic || false,
        thirdPartyAudit: firmData.thirdPartyAudit || false,
        transparencyNotes: firmData.transparencyNotes
      },
      
      // Administration Audit (Step 8)
      administrationAudit: {
        dataSource: firmData.dataSource,
        verifiedBy: firmData.verifiedBy,
        verificationDate: firmData.verificationDate,
        nextReviewDate: firmData.nextReviewDate,
        changelogNotes: firmData.changelogNotes
      },
      
      // System fields
      createdBy: firmData.createdBy || 'current-user-id',
      lastModifiedBy: firmData.lastModifiedBy || 'current-user-id',
      isDraft: firmData.isDraft !== false,
      isPublished: firmData.isPublished || false
    };
    
    const firm = new Firm(transformedData);
    await firm.save();
    
    return NextResponse.json({ firm, firmId: firm._id });
  } catch (error) {
    console.error('Error creating firm:', error);
    return NextResponse.json(
      { error: 'Failed to create firm' },
      { status: 500 }
    );
  }
}
