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
                    isTwoStep: { $eq: [{ $toLower: "$type" }, "2-step"] },
                    phase1: { $toInt: { $arrayElemAt: ["$evaluationSteps.profitTarget", 0] } },
                    phase2: { $toInt: { $arrayElemAt: ["$evaluationSteps.profitTarget", 1] } }
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
            { $project: { evaluationScore: 1 } }
        ]);

        const profitTargetScore = profitTargetPrograms.length > 0
            ? Math.max(...profitTargetPrograms.map(p => p.evaluationScore || 0))
            : 0;

        const payoutSchedule = (firm.payments?.payoutSchedule || "").toLowerCase();
        const payoutCycleScore =
            payoutSchedule.includes("weekly") ||
                payoutSchedule.includes("bi-weekly") ||
                payoutSchedule.includes("biweekly")
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

        let paymentMethodsScore = 0.7;
        if (hasCards && hasPaymentCrypto && hasUPI) paymentMethodsScore = 1.0;
        else if (hasCards && !hasPaymentCrypto && !hasUPI) paymentMethodsScore = 0.6;
        else if ((hasCards && !hasPaymentCrypto) || (hasPaymentCrypto && !hasCards)) paymentMethodsScore = 0.8;

        /** ------- SCORES OBJECT ------- **/
        const scoreData = {
            company_id: firm._id,
            company_name: firm.firmDetails.name,
            scores: {
                credibility: {
                    physical_legal_presence: {
                        registered_company: isRegisteredLegalCompany,
                        physical_office: isPhysicalOfficeAddressVisible,
                        dashboard_friendlyness: 0,
                    },
                    public_identity_transparency: {
                        public_ceo_founder: publicCeoScore,
                        support_quality: supportScore,
                        terms_clarity: 0,
                        brocker_backed: brokerBackedScore,
                    },
                    social_community_presence: {
                        active_social: 0,
                        transparent_comm: 0,
                    },
                    trust_signals_history: {
                        verified_payouts: 0,
                        lifetime_payouts: isLifeTimePayouts,
                        no_controversies: 0,
                        consistent_ops: isConsistentOperations,
                    },
                },
                trading_experience: {
                    trading_conditions: {
                        fair_spreads: 0,
                        fair_commissions: 0,
                        acceptable_slippage: 0,
                        multiple_trading_platforms: multiPlatformScore,
                    },
                    trading_freedom: {
                        profit_targets: profitTargetScore,
                        consistancy_rule: 0,
                        news_trading: 0,
                    },
                    rules_fairness: {
                        lavrage_margin_rule: 0,
                        no_hidden_restrictions_stratgy: 0,
                        dd_type: 0,
                    },
                },
                payout_payment_experience: {
                    payout_reliability: {
                        no_payout_denial_policy: payoutDenialScore,
                        payout_cycle: payoutCycleScore,
                        single_highest_payout: 0,
                    },
                    payout_behavior: {
                        payout_time: 0,
                        flexible_payout_methods: payoutMethodScore,
                        payout_denials: payoutDenialScore,
                    },
                    payout_payment_structure: {
                        fair_profit_split: 0,
                        flexible_payment_methods: paymentMethodsScore,
                        reasonable_minimum_payout_requiremnts: 0,
                    },
                },
            },
        };

        /** 🔥 Save or Update in DB */
        const evaluation = await PointEvaluation.findOneAndUpdate(
            { company_id: firm._id },
            scoreData,
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
