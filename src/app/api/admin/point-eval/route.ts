import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import FundingFirm from "@/models/FirmDetails";
import Program from "@/models/FirmProgram";
import PointEvaluation from "@/models/PointEvaluation";
import { Types } from "mongoose";

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { firmId } = body;

        if (!firmId) {
            return NextResponse.json({ error: "Firm ID is required" }, { status: 400 });
        }

        const firm = await FundingFirm.findById(firmId);
        if (!firm) {
            return NextResponse.json({ error: "Firm not found" }, { status: 404 });
        }

        const isRegisteredLegalCompany = firm.firmDetails.registrationNumber ? 1 : 0;
        const isPhysicalOfficeAddressVisible = firm.firmDetails.hqAddress ? 1 : 0;

        const publicCeoScore = firm.transparency.ceoPublic ? 1 : 0;
        const preferredChannel = firm.support?.channels?.find(c => c.preferred);
        const responseTime = Number(preferredChannel?.responseTime) || 0;
        const waitingScore = responseTime > 1 ? 0.5 : 0.8;
        const activeChannels = firm.support?.channels?.filter(c => c.status === "active") || [];
        const multiChannelScore = activeChannels.length > 1 ? 0.2 : 0;
        const supportScore = waitingScore + multiChannelScore;

        const brokerBackedScore =
            firm.firmDetails.brokerBackedType === "no"
                ? 0
                : firm.firmDetails.brokerBackedType === "new"
                    ? 0.1
                    : firm.firmDetails.brokerBackedType === "reputed"
                        ? 0.3
                        : 0;

        const totalPayout = Number(firm.firmDetails.totalPayout) || 0;
        const isLifeTimePayouts =
            totalPayout < 1_000_000 ? 0.5 :
                totalPayout < 10_000_000 ? 0.7 :
                    totalPayout < 50_000_000 ? 0.8 :
                        totalPayout < 100_000_000 ? 1.0 : 1.2;

        const currentYear = new Date().getFullYear();
        const foundedYear = Number(firm.firmDetails.yearFounded) || currentYear;
        const age = currentYear - foundedYear;
        const isConsistentOperations =
            age < 1 ? 0.2 :
                age < 2 ? 0.4 : 0.5;

        const platforms = firm.trading.tradingPlatforms || [];
        const hasMT5 = platforms.includes("MT5");
        const hasCTrader = platforms.includes("CTrader");
        const multiPlatformScore =
            hasMT5 && hasCTrader ? 1.0 :
                hasMT5 ? 0.8 :
                    hasCTrader ? 0.7 : 0.5;

        const profitTargetPrograms = await Program.aggregate([
            { $match: { propFirmId: new Types.ObjectId(firmId) } },
            {
                $addFields: {
                    isTwoStep: { $eq: [{ $toLower: "$type" }, "2-Step"] },
                    phase1: { $toInt: { $arrayElemAt: ["$evaluationSteps.profitTarget", 0] } },
                    phase2: { $toInt: { $arrayElemAt: ["$evaluationSteps.profitTarget", 1] } },
                    profitSplitNumber: { $toInt: "$profitSplit" }

                }
            },
            {
                $addFields: {
                    evaluationScore: {
                        $cond: [
                            "$isTwoStep",
                            {
                                $switch: {
                                    branches: [
                                        { case: { $eq: ["$phase1", 8] }, then: 1.0 },
                                        { case: { $and: [{ $eq: ["$phase1", 10] }, { $eq: ["$phase2", 4] }] }, then: 0.8 },
                                        { case: { $and: [{ $eq: ["$phase1", 10] }, { $eq: ["$phase2", 5] }] }, then: 0.7 },
                                        { case: { $and: [{ $eq: ["$phase1", 10] }, { $eq: ["$phase2", 8] }] }, then: 0.6 }
                                    ],
                                    default: 0.6
                                }
                            },
                            0.6
                        ]
                    }
                }
            },
            {
                $addFields: {
                    profitSplitScore: {
                        $switch: {
                            branches: [
                                { case: { $gte: ["$profitSplitNumber", 80] }, then: 1.0 }, // 80% or above
                                { case: { $gte: ["$profitSplitNumber", 60] }, then: 0.8 }   // 60% to 79%
                            ],
                            default: 0.5 // below 60%
                        }
                    }
                }
            },
            { $project: { evaluationScore: 1, profitSplitScore: 1 } }
        ]);

        const profitTargetScore = profitTargetPrograms.length > 0
            ? Math.max(...profitTargetPrograms.map(p => p.evaluationScore || 0))
            : 0;

        const payoutScheduleArray = firm.payments?.payoutSchedule || [];

        const payoutCycleScore =
            payoutScheduleArray.includes("weekly") ||
                payoutScheduleArray.includes("biweekly") ||
                payoutScheduleArray.includes("ondemand")
                ? 1
                : 0.7;


        const methods = firm.payments?.payoutMethods?.map(m => m.toLowerCase()) || [];
        const hasBank = methods.includes("bank") || methods.includes("bank transfer");
        const hasCrypto = methods.includes("crypto");
        const hasRise = methods.includes("rise");

        let payoutMethodScore = 0.7;
        if (hasBank && hasCrypto && hasRise) payoutMethodScore = 1.0;
        else if (!hasBank && !hasCrypto && hasRise) payoutMethodScore = 0.7;
        else if (!hasBank && hasCrypto && !hasRise) payoutMethodScore = 0.9;
        else if (hasBank && hasCrypto) payoutMethodScore = 1.0;

        const payoutDenialScore = 1;

        const paymentmethods = firm.payments?.methods?.map(m => m.toLowerCase()) || [];
        const hasCards = paymentmethods.includes("credit card") || paymentmethods.includes("cards");
        const hasPaymentCrypto = paymentmethods.includes("crypto");
        const hasUPI = paymentmethods.includes("upi");

        let paymentMethodsScore = 0;
        if (hasCards && hasPaymentCrypto && hasUPI) paymentMethodsScore = 1.0;
        else if (hasCards && !hasPaymentCrypto && !hasUPI) paymentMethodsScore = 0.6;
        else if ((hasCards && !hasPaymentCrypto) || (hasPaymentCrypto && !hasCards)) paymentMethodsScore = 0.8;


        const processingTime = firm.payments?.processingTime;
        const policy = firm.payments?.processingTimePolicy || "no";
        let processingTimeScore = 0.5; // default: No Policy

        if (processingTime) {
            const { value, unit } = processingTime;

            // Convert to hours (hours stays same, days => hours * 24)
            const hours = unit === "days" ? value * 24 : value;

            // Same Day / Within 24 Hours (After Request)
            if (policy === "after-request" && hours <= 24) {
                processingTimeScore = 2;
            }

            // 24H Policy (After Approval)
            if (policy === "after-approval" && hours <= 24) {
                processingTimeScore = 1;
            }

            // Otherwise score remains 0.5
        }

        const profitSplitScore = profitTargetPrograms.length > 0
            ? Math.max(...profitTargetPrograms.map(p => p.profitSplitScore || 0))
            : 0.5;

        /** ------- SCORES OBJECT ------- **/
        // Helper to sum values in a deeply nested object
        const sumValues = (obj: Record<string, unknown>): number => {
            let total = 0;
            for (const key in obj) {
                const value = obj[key];
                if (typeof value === 'object' && value !== null) {
                    total += sumValues(value as Record<string, unknown>);
                } else if (typeof value === 'number') {
                    total += value;
                }
            }
            return total;
        };

        const credibilityScore = {
            physical_legal_presence: {
                registered_company: isRegisteredLegalCompany,//total ==1
                physical_office: isPhysicalOfficeAddressVisible,//total ==1
                dashboard_friendlyness: 0,//total ==1
            },
            public_identity_transparency: {
                public_ceo_founder: publicCeoScore,//total ==1
                support_quality: supportScore,//total ==1
                terms_clarity: 0,//total ==1
                brocker_backed: brokerBackedScore,//total ==0.3
            },
            social_community_presence: {
                active_social: 0,//total ==0.5
                transparent_comm: 0,//total ==0.5
            },
            trust_signals_history: {
                verified_payouts: 0,//total ==0.5
                lifetime_payouts: isLifeTimePayouts,//total ==1.2
                no_controversies: 0,//total ==0.5
                consistent_ops: isConsistentOperations,//total ==0.5
            },
        };

        const tradingScore = {
            trading_conditions: {
                fair_spreads: 0, //total ==1
                fair_commissions: 0, //total ==1
                acceptable_slippage: 0, //total ==1
                multiple_trading_platforms: multiPlatformScore, //total ==1
            },
            trading_freedom: {
                profit_targets: profitTargetScore, //total ==1
                consistancy_rule: 0,//total ==1
                news_trading: 0,//total ==1
            },
            rules_fairness: {
                lavrage_margin_rule: 0,//total ==1
                no_hidden_restrictions_stratgy: 0,//total ==1
                dd_type: 0,//total ==1
            },
        };

        const payoutScore = {
            payout_reliability: {
                no_payout_denial_policy: 0,//total ==1
                payout_cycle: payoutCycleScore,//total ==1
                single_highest_payout: 0,//total ==1
            },
            payout_behavior: {
                payout_time: processingTimeScore,//total ==2
                flexible_payout_methods: payoutMethodScore,//total ==1
                payout_denials: payoutDenialScore,//total ==1
            },
            payout_payment_structure: {
                fair_profit_split: profitSplitScore, //total==1
                flexible_payment_methods: paymentMethodsScore, //total==1
                reasonable_minimum_payout_requiremnts: 0, //total==1
            },
        };

        const totalCredibility = sumValues(credibilityScore);
        const totalTrading = sumValues(tradingScore);
        const totalPayoutScore = sumValues(payoutScore);

        const initialPtiScore = (totalCredibility * 0.35) + (totalTrading * 0.30) + (totalPayoutScore * 0.35);

        const scoreData = {
            firmId: firm._id,
            firmName: firm.firmDetails.name,
            evaluatedAt: new Date(),
            isEvaluated: true,
            ptiScore: parseFloat(initialPtiScore.toFixed(2)),
            scores: {
                credibility: credibilityScore,
                trading_experience: tradingScore,
                payout_payment_experience: payoutScore,
            },
        };

        const evaluation = await PointEvaluation.findOneAndUpdate(
            { firmId: firm._id },
            { $set: scoreData },
            { upsert: true, new: true }
        );

        return NextResponse.json({
            message: "Evaluation saved successfully",
            evaluation,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const firmId = searchParams.get('firmId');

        if (!firmId) {
            return NextResponse.json({ error: "Firm ID is required" }, { status: 400 });
        }

        const evaluation = await PointEvaluation.findOne({ firmId });

        if (!evaluation) {
            return NextResponse.json({ error: "Evaluation not found" }, { status: 404 });
        }

        return NextResponse.json({ evaluation });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
