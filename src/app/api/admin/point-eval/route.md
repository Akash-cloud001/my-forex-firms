import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import FundingFirm from "@/models/FirmDetails";
import Program from "@/models/FirmProgram";
import { Types } from "mongoose";

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { firmId } = body;

        if (!firmId) {
            return NextResponse.json({ error: "Firm ID is required" }, { status: 400 });
        }

        // find firm by id
        const firm = await FundingFirm.findById(firmId);
        if (!firm) {
            return NextResponse.json({ error: "Firm not found" }, { status: 404 })
        }
        // calculate points

        // Credibility & Transparency :- Piller-1
        // const credibilityTransparencyPoints = 0;
        // Physical & Legal Presence
        /**
         *1.Registered legal company (public record)
         *2. Physical office address visible
         *3. Dashboard/website user frindlyness       
         */

        const isRegisteredLegalCompany = firm.firmDetails.registrationNumber ? 1 : 0;
        const isPhysicalOfficeAddressVisible = firm.firmDetails.hqAddress ? 1 : 0;
        // const isDashboardWebsiteUserFriendly = firm.firmDetails.officialWebsite ? 1 : 0; => manual check


        //Public Identity & Transparency
        /**
         *1.Public CEO / Founder
         *2.Good Support/Low Waiting Time
         *3. Clear, accessible, well-written rules / T&C
         *4. Brocker backed
         */

        const publicCeoScore = firm.transparency.ceoPublic ? 1 : 0;
        const preferredChannel = firm.support?.channels?.find(c => c.preferred);
        const responseTime = Number(preferredChannel?.responseTime) || 0;

        // Waiting Time Score
        let waitingScore = responseTime > 1 ? 0.5 : 0.8;

        // Multi-channel Score
        const activeChannels = firm.support?.channels?.filter(c => c.status === "active") || [];
        let multiChannelScore = activeChannels.length > 1 ? 0.2 : 0;

        // Final Score
        const supportScore = waitingScore + multiChannelScore;


        // clear rule will be manually
        // const isClearRules = firm.firmDetails.companyDescription ? 1 : 0;
        const brokerBackedScore =
            firm.firmDetails.brokerBackedType === "no"
                ? 0
                : firm.firmDetails.brokerBackedType === "new"
                    ? 0.1
                    : firm.firmDetails.brokerBackedType === "reputed"
                        ? 0.3
                        : 0;



        // Social & Community Presence
        /**
         *1. Active social media (X / IG / Discord) Consistent posting & announcements
         *2. Transparent communication during issues
         */

        //manually
        // const isSocialMediaActive = firm.socialLinks.socialLinks?.length ? 1 : 0;
        // manully
        // const isTransparentCommunication = firm.support.avgResolutionTime ? 1 : 0;

        // Trust Signals & History
        /**
         *1. Verified payout history (public proofs or traders)
         *2.No major controversies / scandals
         *3.Life time payouts (
         *0.5 - Under $1M
         *0.7 - $1M+
         *0.8 - $10M+
         *1.0 - $50M+
         *1.2 - $100M+)
         *4.Consistent operations
         */
        // manually
        // const isVerifiedPayoutHistory = firm.transparency.payoutProofPublic ? 1 : 0;
        // Convert payout to a number safely
        const totalPayout = Number(firm.firmDetails.totalPayout) || 0;

        const isLifeTimePayouts =
            totalPayout < 1_000_000 ? 0.5 :
                totalPayout < 10_000_000 ? 0.7 :
                    totalPayout < 50_000_000 ? 0.8 :
                        totalPayout < 100_000_000 ? 1.0 :
                            1.2;


        // manually
        // const isNoMajorControversies = firm.transparency.thirdPartyAudit ? 1 : 0;

        const currentYear = new Date().getFullYear();
        const foundedYear = Number(firm.firmDetails.yearFounded) || currentYear;
        const age = currentYear - foundedYear;

        const isConsistentOperations =
            age < 1 ? 0.2 :
                age < 2 ? 0.4 :
                    0.5;


        // const credibilityTransparencyPoints = isRegisteredLegalCompany + isPhysicalOfficeAddressVisible + isLifeTimePayouts + isConsistentOperations;

        // Trading Experience :- Piller-2


        // const tradingExperiencePoints = 0;
        // Trading Conditions :
        /**
         * Fair spreads 1.0 - Low Close to Zero or Zero  0.7 - Medium 0.5 - High
        Fair commissions 1.0 - Zero Com 0.7 - Round Under $5  0.5 - $4+
        Acceptable slippage 1.0 - No Slippage 0.7 - Spipage
        Multiple trading Platforms 1.0 - All Major 0.8 - Only MT5 0.7 - Only Ctrader + Other 0.5 - No Mt5/ctrader
         */
        // spread will be manually

        // data for commisions  if 0 == 1
        // if 0-5 == 0.7
        // if 5+ == 0.5
        // const isCommissions = firm.trading.commissions
        //  Acceptable slippage manually
        // multiple trading platforms after fixes of form
        const platforms = firm.trading.tradingPlatforms || [];

        const hasMT5 = platforms.includes("MT5");
        const hasCTrader = platforms.includes("CTrader");

        const multiPlatformScore =
            hasMT5 && hasCTrader ? 1.0 :
                hasMT5 ? 0.8 :
                    hasCTrader ? 0.7 :
                        0.5;

        // Trading Freedom
        /**
         *PROFIT TARGETs 1.0 - 8 + 5  0.8 - 10+4  0.7 - 10+5  0.6 - 10+8
         Consistancy Rule 1.0 - NO 0.7 - Yes 0.9 - Multi Option
        NEWS TRADING 1.0 - Allowed - 1 On Funded and Evalutaion both, 0.8 - 5 min restrictions - 0.8 (Allowed in Evals),0.5 - Not allowed on Both (Evals + Funded),  0.1 - Holding ALLOWD, 0.0 - Holding Not ALLOWD
 
 
     // for profit target evaluate according to 2 step
 
     
     // consistency rule need to update challange form
     // manually news trading
 
         */

        const profitTargetPrograms = await Program.aggregate([
            {
                $match: { propFirmId: new Types.ObjectId(firmId) } // Match programs for this firm
            },
            {
                $lookup: {
                    from: "funding_firms",             // firms collection
                    localField: "propFirmId",
                    foreignField: "_id",
                    as: "firm"
                }
            },
            { $unwind: "$firm" },

            // Calculate evaluation score
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
                            0.6 // Not 2-step → default lowest score
                        ]
                    }
                }
            },
            {
                $project: {
                    evaluationScore: 1
                }
            }
        ]);

        // Get the max score from all programs, default to 0 if no programs found
        const profitTargetScore = profitTargetPrograms.length > 0
            ? Math.max(...profitTargetPrograms.map(p => p.evaluationScore || 0))
            : 0;

        // Rules & Fairness all maunally
        /**
         *Lavrage/Margin Rule 1.0 - No Rule   0.5 - Margin Rule Yes
         No hidden restrictions/Stratgy 1.0 - NO   0.7 - Yes
         DD TYPE 1.0 - BALANCE BASED DD 0.5 - EQUITY BASED DAILY or MAX
         */
        // margin rule will be manually
        // hidden restrictions/Stratgy will be manually
        // dd type will be taken from challange 2 step


        //Payout/payment Experience :- Piller-3

        // payout reliability manually
        //payout cycle  

        const payoutSchedule = (firm.payments?.payoutSchedule || "").toLowerCase();

        const payoutCycleScore =
            payoutSchedule.includes("weekly") ||
                payoutSchedule.includes("bi-weekly") ||
                payoutSchedule.includes("biweekly")
                ? 1
                : 0.7;

        //payout time manually
        //payout method 
        const methods = firm.payments?.payoutMethods?.map(m => m.toLowerCase()) || [];

        const hasBank = methods.includes("bank") || methods.includes("bank transfer");
        const hasCrypto = methods.includes("crypto");
        const hasRise = methods.includes("rise");

        let payoutMethodScore = 0.7; // Default

        if (hasBank && hasCrypto && hasRise) {
            payoutMethodScore = 1.0;
        } else if (!hasBank && !hasCrypto && hasRise) {
            payoutMethodScore = 0.7;
        } else if (!hasBank && hasCrypto && !hasRise) {
            payoutMethodScore = 0.9;
        } else if (hasBank && hasCrypto) {
            payoutMethodScore = 1.0;
        }



        //payout denial 1 initially 
        const payoutDenialScore = 1
        //profit split
        //payment methods
        const paymentmethods = firm.payments?.methods?.map(m => m.toLowerCase()) || [];

        const hasCards = paymentmethods.includes("credit card") || paymentmethods.includes("cards");
        const haspaymantCrypto = paymentmethods.includes("crypto");
        const hasUPI = paymentmethods.includes("upi");

        let paymentMethodsScore = 0.7; // fallback

        if (hasCards && haspaymantCrypto && hasUPI) {
            paymentMethodsScore = 1.0;
        } else if (hasCards && !haspaymantCrypto && !hasUPI) {
            paymentMethodsScore = 0.6;
        } else if ((hasCards && !haspaymantCrypto) || (haspaymantCrypto && !hasCards)) {
            paymentMethodsScore = 0.8;
        }

        //resoanable min payout





        return NextResponse.json({
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
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}