import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Firm from '@/models/Firm';
import {  deleteFileFromBunnyCDN } from '@/lib/bunnycdn';
import { deleteFromCloudinary, uploadToCloudinary } from '@/services/cloudinary';

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const contentType = request.headers.get('content-type');
    
    let formData: Record<string, unknown> = {};
    let logoFile: File | null = null;

    if (contentType?.includes('multipart/form-data')) {
      // Handle FormData (with file upload)
      const formDataRequest = await request.formData();
      
      for (const [key, value] of formDataRequest.entries()) {
        if (key === 'logoFile') {
          if (value instanceof File) {
            logoFile = value;
          } else if (value && typeof value === 'object' && 'type' in value) {
            // Handle binary data sent as Blob
            const blobValue = value as Blob;
            logoFile = new File([blobValue], 'logo.jpg', { type: blobValue.type || 'image/jpeg' });
          }
        } else if (typeof value === 'string') {
          try {
            formData[key] = JSON.parse(value);
          } catch {
            formData[key] = value;
          }
        }
      }
    } else {
      formData = await request.json();
    }

    const existingFirm = await Firm.findById(id);
    if (!existingFirm) {
      return NextResponse.json({ error: 'Firm not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
      firmName: formData.firmName,
      legalEntityName: formData.legalEntityName,
      registrationNumber: formData.registrationNumber,
      jurisdiction: formData.jurisdiction,
      yearFounded: formData.yearFounded ? Number(formData.yearFounded) : undefined,
      headquartersAddress: formData.headquartersAddress,
      ceoFounderName: formData.ceoFounderName,
      leadershipLinks: formData.leadershipLinks,
      officialWebsite: formData.officialWebsite,
      status: formData.status,
      shortDescription: formData.shortDescription,
      
      tradingInfrastructure: {
        tradingPlatforms: typeof formData.tradingPlatforms === 'string' 
          ? formData.tradingPlatforms.split(',').map(p => p.trim()).filter(Boolean)
          : formData.tradingPlatforms || [],
        dataFeedsLiquidityProviders: typeof formData.dataFeedsLiquidityProviders === 'string'
          ? formData.dataFeedsLiquidityProviders.split(',').map(p => p.trim()).filter(Boolean)
          : formData.dataFeedsLiquidityProviders || []
      },
            payoutFinancial: {
        profitSplit: formData.profitSplit,
        firstPayoutTiming: formData.firstPayoutTiming,
        regularPayoutCycle: formData.regularPayoutCycle,
        minimumPayoutAmount: formData.minimumPayoutAmount,
        averagePayoutProcessingTime: formData.averagePayoutProcessingTime,
        fastestSlowestPayoutDuration: formData.fastestSlowestPayoutDuration,
        payoutMethods: typeof formData.payoutMethods === 'string'
          ? formData.payoutMethods.split(',').map(p => p.trim()).filter(Boolean)
          : formData.payoutMethods || [],
        payoutFeesFxCosts: formData.payoutFeesFxCosts,
        totalPayoutsAllTime: formData.totalPayoutsAllTime,
        largestSinglePayout: formData.largestSinglePayout,
        monthlyPayoutCounts: formData.monthlyPayoutCounts,
        payoutProofLinks: typeof formData.payoutProofLinks === 'string'
          ? formData.payoutProofLinks.split(',').map(p => p.trim()).filter(Boolean)
          : formData.payoutProofLinks || []
      },
      
      challenges: formData.challengeInformation || [],
            tradingEnvironment: {
        typicalSpreads: formData.typicalSpreads,
        commissions: formData.commissions,
        slippageSwapPolicies: formData.slippageSwapPolicies,
        riskDeskModel: formData.riskDeskModel,
        copyTradeProviders: typeof formData.copyTradeProviders === 'string'
          ? formData.copyTradeProviders.split(',').map(p => p.trim()).filter(Boolean)
          : formData.copyTradeProviders || [],
        mobileSupport: typeof formData.mobileSupport === 'string'
          ? formData.mobileSupport.split(',').map(p => p.trim()).filter(Boolean)
          : formData.mobileSupport || [],
        ruleMatrix: {
          newsTrading: formData.newsTrading === true || formData.newsTrading === 'true',
          weekendHolding: formData.weekendHolding === true || formData.weekendHolding === 'true',
          eaUsage: formData.eaUsage === true || formData.eaUsage === 'true',
          copyTrading: formData.copyTrading === true || formData.copyTrading === 'true',
          hedging: formData.hedging === true || formData.hedging === 'true',
          scalping: formData.scalping === true || formData.scalping === 'true'
        },
        ruleDetails: {
          newsTradingNotes: formData.newsTradingNotes,
          weekendHoldingNotes: formData.weekendHoldingNotes,
          eaUsageNotes: formData.eaUsageNotes,
          copyTradingNotes: formData.copyTradingNotes,
          hedgingNotes: formData.hedgingNotes,
          scalpingNotes: formData.scalpingNotes
        }
      },
            supportOperations: {
        supportChannels: typeof formData.supportChannels === 'string'
          ? formData.supportChannels.split(',').map(p => p.trim()).filter(Boolean)
          : formData.supportChannels || [],
        averageFirstResponseTime: formData.averageFirstResponseTime,
        averageResolutionTime: formData.averageResolutionTime,
        supportHours: formData.supportHours,
        escalationPolicy: formData.escalationPolicy,
        kycRequirements: formData.kycRequirements,
        restrictedCountries: typeof formData.restrictedCountries === 'string'
          ? formData.restrictedCountries.split(',').map(p => p.trim()).filter(Boolean)
          : formData.restrictedCountries || [],
        amlComplianceLink: formData.amlComplianceLink
      },
            transparencyVerification: {
        ceoPublic: formData.ceoPublic === true || formData.ceoPublic === 'true',
        entityOfficeVerified: formData.entityOfficeVerified === true || formData.entityOfficeVerified === 'true',
        termsPublicUpdated: formData.termsPublicUpdated === true || formData.termsPublicUpdated === 'true',
        payoutProofsPublic: formData.payoutProofsPublic === true || formData.payoutProofsPublic === 'true',
        thirdPartyAudit: formData.thirdPartyAudit === true || formData.thirdPartyAudit === 'true',
        transparencyNotes: formData.transparencyNotes
      },
      
      // Step 8: Administration & Audit (nested object)
      administrationAudit: {
        dataSource: formData.dataSource,
        verifiedBy: formData.verifiedBy,
        verificationDate: formData.verificationDate,
        nextReviewDate: formData.nextReviewDate,
        changelogNotes: formData.changelogNotes
      },
      
      // Reviews
      reviews: {
        trustPilotRating: formData.trustPilotRating ? Number(formData.trustPilotRating) : undefined,
        totalLikes: existingFirm.reviews?.totalLikes || 0,
        totalDislikes: existingFirm.reviews?.totalDislikes || 0
      }
    };

    if (logoFile) {
      try {
        if (existingFirm.logoFile?.public_id) {
          const deleteResult = await deleteFromCloudinary(existingFirm.logoFile.public_id);
          if (!deleteResult.success) {
            console.warn('Failed to delete old logo from Cloudinary:', deleteResult.message);
          }
        }
        const uploadResult = await uploadToCloudinary(logoFile);

        if (!uploadResult.success) {
          return NextResponse.json(
            { error: uploadResult.message || 'Failed to upload logo file' },
            { status: 500 }
          );
        }

        updateData.logoUrl = uploadResult.url;
        updateData.logoFile = {
          filename: logoFile.name,
          url: uploadResult.url,
          public_id: uploadResult.public_id,
          size: logoFile.size,
          mimeType: logoFile.type
        };
      } catch (error) {
        console.error('Error handling logo upload:', error);
        return NextResponse.json(
          { error: 'Failed to upload logo file' },
          { status: 500 }
        );
      }
    } else if (formData.logoUrl === '' || formData.logoUrl === null || formData.logoUrl === undefined) {
      if (existingFirm.logoFile?.public_id) {
        const deleteResult = await deleteFromCloudinary(existingFirm.logoFile.public_id);
        if (!deleteResult.success) {
          console.warn('Failed to delete logo from Cloudinary:', deleteResult.message);
        }
      }
      updateData.logoUrl = '';
      updateData.logoFile = null;
    } else {
      updateData.logoUrl = existingFirm.logoUrl;
      updateData.logoFile = existingFirm.logoFile;
    }
        const updatedFirm = await Firm.findByIdAndUpdate(
      id,
      {
        ...updateData,
        lastModifiedBy: 'admin', 
        $inc: { version: 1 },
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedFirm) {
      return NextResponse.json({ error: 'Firm not found' }, { status: 404 });
    }

    return NextResponse.json(updatedFirm);
  } catch (error: unknown) {
    console.error('Error updating firm:', error);
    return NextResponse.json(
      { error: 'Failed to update firm', details: error instanceof Error ? error.message : 'Unknown error' },
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