import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import FundingFirm from '@/models/FirmDetails';
import { firmFormSchema } from '@/components/crm/firm-management/add-firm/schema/schema';


export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

  const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid firm ID' },
        { status: 400 }
      );
    }

    const result = await FundingFirm.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'programs', 
          localField: '_id',
          foreignField: 'propFirmId',
          as: 'programs',
        },
      },
      {
        $addFields: {
          totalPrograms: { $size: '$programs' },
        },
      },
    ]);

    if (!result || result.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Firm not found' },
        { status: 404 }
      );
    }

    const firm = result[0];

    return NextResponse.json({
      success: true,
      message: 'Firm details with programs fetched successfully',
      data: firm,
    });
  } catch (error) {
    console.error('Error fetching firm with programs:', error);
      const err = error instanceof Error ? error : new Error(String(error));

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch firm details',
        error: err.message,
      },
      { status: 500 }
    );
  }
}



export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Connect to database
    await connectDB();

    const firmId = (await context.params).id;
    
    // Parse request body
    const body = await request.json();
    
    // Validate data with Zod schema
    const validationResult = firmFormSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Check if firm exists
    const existingFirm = await FundingFirm.findById(firmId);
    
    if (!existingFirm) {
      return NextResponse.json(
        {
          success: false,
          message: "Firm not found",
        },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData = {
      // Firm Details
      "firmDetails.name": validatedData.firmDetails.name,
      "firmDetails.legalEntityName": validatedData.firmDetails.legalEntityName,
      "firmDetails.registrationNumber": validatedData.firmDetails.registrationNumber,
      "firmDetails.licenseNumber": validatedData.firmDetails.licenseNumber,
      "firmDetails.regulator": validatedData.firmDetails.regulator,
      "firmDetails.jurisdiction": validatedData.firmDetails.jurisdiction,
      "firmDetails.yearFounded": validatedData.firmDetails.yearFounded,
      "firmDetails.status": validatedData.firmDetails.status,
      "firmDetails.hqAddress": validatedData.firmDetails.hqAddress,
      "firmDetails.languagesSupported": validatedData.firmDetails.languagesSupported,
      "firmDetails.companyDescription": validatedData.firmDetails.companyDescription,
      "firmDetails.officialWebsite": validatedData.firmDetails.officialWebsite,
      "firmDetails.brokers": validatedData.firmDetails.brokers,
      "firmDetails.liquidityProviders": validatedData.firmDetails.liquidityProviders,

      // Leadership
      "leadership.leadership": validatedData.leadership.leadership,

      // Ratings
      "ratings.trustPilotRating": validatedData.ratings.trustPilotRating,
      "ratings.otherRatings": validatedData.ratings.otherRatings,

      // Social Links
      "socialLinks.socialLinks": validatedData.socialLinks.socialLinks,

      // Support
      "support.channels": validatedData.support.channels,
      "support.avgResolutionTime": validatedData.support.avgResolutionTime,
      "support.supportHours": validatedData.support.supportHours,

      // Compliance
      "compliance.kycRequirements": validatedData.compliance.kycRequirements,
      "compliance.kycProvider": validatedData.compliance.kycProvider,
      "compliance.restrictedCountries": validatedData.compliance.restrictedCountries,
      "compliance.regulationsComplied": validatedData.compliance.regulationsComplied,
      "compliance.amlLink": validatedData.compliance.amlLink,

      // Transparency
      "transparency.ceoPublic": validatedData.transparency.ceoPublic,
      "transparency.officeVerified": validatedData.transparency.officeVerified,
      "transparency.termsPublicUpdated": validatedData.transparency.termsPublicUpdated,
      "transparency.payoutProofPublic": validatedData.transparency.payoutProofPublic,
      "transparency.thirdPartyAudit": validatedData.transparency.thirdPartyAudit,
      "transparency.notes": validatedData.transparency.notes,
      "transparency.transparencyScore": validatedData.transparency.transparencyScore,

      // Trading
      "trading.leverageMatrix": validatedData.trading.leverageMatrix,
      "trading.commissions": validatedData.trading.commissions,

      // Payments
      "payments.methods": validatedData.payments.methods,
      "payments.payoutMethods": validatedData.payments.payoutMethods,
      "payments.baseCurrency": validatedData.payments.baseCurrency,
      "payments.minWithdrawal": validatedData.payments.minWithdrawal,
      "payments.processingTime": validatedData.payments.processingTime,
      "payments.payoutSchedule": validatedData.payments.payoutSchedule,
      "payments.refundPolicy": validatedData.payments.refundPolicy,

      // Metadata
      updatedAt: new Date(),
    };

    // Update firm in database
    const updatedFirm = await FundingFirm.findByIdAndUpdate(
      firmId,
      { $set: updateData },
      {
        new: true, // Return updated document
        runValidators: true, // Run mongoose validators
      }
    );

    if (!updatedFirm) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update firm",
        },
        { status: 500 }
      );
    }

    // Log the update (optional)
    console.log(`Firm updated successfully: ${firmId}`);

    return NextResponse.json(
      {
        success: true,
        message: "Firm updated successfully",
        data: updatedFirm,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating firm:", error);
    
    // Handle specific error types
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: "Internal server error",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}