import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { auth, clerkClient } from '@clerk/nextjs/server';
import Review from '@/models/Review';
import FundingFirm from '@/models/FirmDetails';
import PointEvaluation from '@/models/PointEvaluation';
import {
  calculateDeduction,
  getSubFactorPath,
  recalculatePTI,
  CATEGORY_MAX_POINTS,
} from '@/utils/ptiCalculator';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // Get user authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin or moderator
    const clerk = await clerkClient();
    const currentUser = await clerk.users.getUser(userId);
    const userRole = currentUser.publicMetadata?.role as string | undefined;
    const allowedRoles = ['admin', 'moderator'];

    if (!userRole || !allowedRoles.includes(userRole)) {
      return NextResponse.json(
        { error: 'Admin or moderator access required' },
        { status: 403 }
      );
    }

    const { id: reviewId } = await params;
    const updateData = await request.json();
    // console.log("🚀 ~ PUT ~ updateData:", updateData)

    // Get the current review to check status change
    const currentReview = await Review.findById(reviewId);
    if (!currentReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check if this is an approval (status changing to 'approved')
    const isApproving = updateData.status === 'approved' && currentReview.status !== 'approved';

    // Find and update review in MongoDB
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        ...updateData,
        lastModifiedBy: userId,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    // If approving, apply PTI score deduction
    if (isApproving && updatedReview?.firmId && updatedReview?.relatedSubFactor) {
      try {
        await applyPTIDeduction(
          updatedReview.firmId.toString(),
          updatedReview.relatedSubFactor
        );
      } catch (ptiError) {
        console.error('Error applying PTI deduction:', ptiError);
        // Continue - don't fail the review approval if PTI update fails
      }
    }

    return NextResponse.json({
      review: updatedReview,
      message: 'Review updated successfully'
    });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

/**
 * Apply PTI v2 score deduction when a review is approved
 * Formula: PerComplaint = d_slab × (categoryMaxPoints / 10)
 */
async function applyPTIDeduction(firmId: string, relatedSubFactor: string): Promise<void> {
  // console.log('\n╔══════════════════════════════════════════════════════════════╗');
  // console.log('║           PTI v2 — COMPLAINT PROCESSING                      ║');
  // console.log('╚══════════════════════════════════════════════════════════════╝\n');

  // Get the sub-factor path (pillar, category, subFactor)
  const pathInfo = getSubFactorPath(relatedSubFactor);
  if (!pathInfo) {
    console.warn(`❌ Unknown sub-factor: ${relatedSubFactor}`);
    return;
  }

  // Fetch firm to get totalPayout for slab calculation
  const firm = await FundingFirm.findById(firmId);
  if (!firm) {
    console.warn(`❌ Firm not found: ${firmId}`);
    return;
  }

  const totalPayout = Number(firm.firmDetails?.totalPayout) || 0;
  const slab = totalPayout >= 50_000_000 ? 'S4' :
    totalPayout >= 10_000_000 ? 'S3' :
      totalPayout >= 2_000_000 ? 'S2' : 'S1';
  const deductionRate = totalPayout >= 50_000_000 ? 0.10 :
    totalPayout >= 10_000_000 ? 0.12 :
      totalPayout >= 2_000_000 ? 0.16 : 0.20;

  // console.log('┌─────────────────────────────────────────────────────────────┐');
  // console.log('│ FIRM PROFILE                                                │');
  // console.log('├─────────────────────────────────────────────────────────────┤');
  // console.log(`│ Firm Name:      ${firm.firmDetails?.name}`);
  // console.log(`│ Payout Range:   $${(totalPayout / 1_000_000).toFixed(1)}M (Slab ${slab})`);
  // console.log(`│ Deduction Rate: ${deductionRate}`);
  // console.log('└─────────────────────────────────────────────────────────────┘\n');

  // Fetch current PointEvaluation
  const evaluation = await PointEvaluation.findOne({ firmId });
  if (!evaluation) {
    console.warn(`❌ PointEvaluation not found for firm: ${firmId}`);
    return;
  }

  // Get category max points
  const categoryMax = CATEGORY_MAX_POINTS[pathInfo.category] || 1;

  // Calculate deduction amount
  const deduction = calculateDeduction(totalPayout, pathInfo.category);

  // Get current score for the sub-factor
  const { pillar, category, subFactor } = pathInfo;

  // Use type assertion for dynamic property access
  type ScoresType = Record<string, Record<string, Record<string, number>>>;
  const scores = evaluation.scores as unknown as ScoresType;
  const currentScore = scores?.[pillar]?.[category]?.[subFactor] ?? 0;

  // console.log('┌─────────────────────────────────────────────────────────────┐');
  // console.log('│ COMPLAINT RECEIVED                                          │');
  // console.log('├─────────────────────────────────────────────────────────────┤');
  // console.log(`│ Category:    ${pillar.replace(/_/g, ' ').toUpperCase()}`);
  // console.log(`│ Sub-Factor:  ${category.replace(/_/g, ' ')}`);
  // console.log(`│ Field:       ${subFactor}`);
  // console.log(`│ Date:        ${new Date().toLocaleDateString()}`);
  // console.log('└─────────────────────────────────────────────────────────────┘\n');

  // console.log('┌─────────────────────────────────────────────────────────────┐');
  // console.log('│ STEP-BY-STEP CALCULATION                                    │');
  // console.log('├─────────────────────────────────────────────────────────────┤');
  // console.log('│');
  // console.log('│ Step 1: Identify Affected Sub-Factor');
  // console.log(`│   • Sub-Factor:   ${category}`);
  // console.log(`│   • Current Score: ${currentScore}`);
  // console.log(`│   • Max Points:    ${categoryMax}`);
  // console.log('│');
  // console.log('│ Step 2: Calculate Per-Complaint Deduction');
  // console.log(`│   PerComplaint = d_slab × (maxPoints / 10)`);
  // console.log(`│   PerComplaint = ${deductionRate} × (${categoryMax} / 10)`);
  // console.log(`│   PerComplaint = ${deductionRate} × ${(categoryMax / 10).toFixed(3)}`);
  // console.log(`│   PerComplaint = ${deduction.toFixed(4)}`);
  // console.log('│');

  // Apply deduction (minimum 0)
  const newScore = Math.max(0, currentScore - deduction);

  // console.log('│ Step 3: Apply Deduction');
  // console.log(`│   New Score = Current Score - PerComplaint`);
  // console.log(`│   New Score = ${currentScore} - ${deduction.toFixed(4)}`);
  // console.log(`│   New Score = ${newScore.toFixed(4)}`);
  // console.log('│');

  // Update the specific sub-factor score
  const updatePath = `scores.${pillar}.${category}.${subFactor}`;
  await PointEvaluation.updateOne(
    { firmId },
    { $set: { [updatePath]: newScore } }
  );

  // Fetch updated evaluation to recalculate totals
  const updatedEvaluation = await PointEvaluation.findOne({ firmId });
  if (!updatedEvaluation?.scores) {
    console.warn('❌ Failed to fetch updated evaluation');
    return;
  }

  // Recalculate pillar totals and PTI
  const { credibilityTotal, tradingTotal, payoutTotal, ptiScore } = recalculatePTI(
    updatedEvaluation.scores as {
      credibility: Record<string, Record<string, number>>;
      trading_experience: Record<string, Record<string, number>>;
      payout_payment_experience: Record<string, Record<string, number>>;
    }
  );

  const oldCredibility = evaluation.credibilityTransparency?.score || 0;
  const oldTrading = evaluation.tradingExperience?.score || 0;
  const oldPayout = evaluation.payoutPaymentReliability?.score || 0;
  const oldPTI = evaluation.ptiScore || 0;

  // console.log('│ Step 4: Recalculate Category Total');
  // console.log(`│   Credibility:  ${oldCredibility} → ${credibilityTotal}`);
  // console.log(`│   Trading:      ${oldTrading} → ${tradingTotal}`);
  // console.log(`│   Payout:       ${oldPayout} → ${payoutTotal}`);
  // console.log('│');
  // console.log('│ Step 5: Compute New PTI');
  // console.log(`│   PTI = (0.35 × ${credibilityTotal}) + (0.30 × ${tradingTotal}) + (0.35 × ${payoutTotal})`);
  // console.log(`│   PTI = ${(0.35 * credibilityTotal).toFixed(3)} + ${(0.30 * tradingTotal).toFixed(3)} + ${(0.35 * payoutTotal).toFixed(3)}`);
  // console.log(`│   PTI = ${ptiScore}`);
  // console.log('│');
  // console.log('└─────────────────────────────────────────────────────────────┘\n');

  // Update pillar totals and PTI score
  await PointEvaluation.updateOne(
    { firmId },
    {
      $set: {
        'credibilityTransparency.score': credibilityTotal,
        'tradingExperience.score': tradingTotal,
        'payoutPaymentReliability.score': payoutTotal,
        ptiScore: ptiScore,
        updatedAt: new Date()
      }
    }
  );

  // console.log('┌─────────────────────────────────────────────────────────────┐');
  // console.log('│ IMPACT SUMMARY                                              │');
  // console.log('├─────────────────────────────────────────────────────────────┤');
  // console.log('│ Metric              Before      After       Change          │');
  // console.log('├─────────────────────────────────────────────────────────────┤');
  // console.log(`│ Sub-Factor Score    ${currentScore.toFixed(3).padEnd(10)} ${newScore.toFixed(3).padEnd(10)} -${deduction.toFixed(3).padEnd(14)}│`);
  // console.log(`│ PTI Score           ${oldPTI.toFixed(3).padEnd(10)} ${ptiScore.toFixed(3).padEnd(10)} -${(oldPTI - ptiScore).toFixed(3).padEnd(14)}│`);
  // console.log('└─────────────────────────────────────────────────────────────┘\n');

  console.log('✅ PTI Updated Successfully!\n');
}
