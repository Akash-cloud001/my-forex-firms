import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import FundingFirm from "@/models/FirmDetails";


export async function GET(req: Request) {
    try {
        connectDB();
        const body = await req.json();
        const { firmId } = body;

        // find firm by id
        const firm = await FundingFirm.findById(firmId);
        if (!firm) {
            return NextResponse.json({ error: "Firm not found" }, { status: 404 })
        }
        // calculate points

        // Credibility & Transparency :- Piller-1
        const credibilityTransparencyPoints = 0;
        // Physical & Legal Presence
        /**
         *1.Registered legal company (public record)
         *2. Physical office address visible
         *3. Dashboard/website user frindlyness       
         */

        const isRegisteredLegalCompany = firm.firmDetails.legalEntityName ? 1 : 0;
        const isPhysicalOfficeAddressVisible = firm.firmDetails.hqAddress ? 1 : 0;
        const isDashboardWebsiteUserFriendly = firm.firmDetails.officialWebsite ? 1 : 0;


        //Public Identity & Transparency
        /**
         *1.Public CEO / Founder
         *2.Good Support/Low Waiting Time
         *3. Clear, accessible, well-written rules / T&C
         *4. Brocker backed
         */

        const isPublicCEO = firm.leadership.leadership?.[0].publicPresence ? 1 : 0;
        const isGoodSupport = firm.support.avgResolutionTime ? 1 : 0;
        const isClearRules = firm.firmDetails.companyDescription ? 1 : 0;
        const isBrokerBacked = firm.firmDetails.brokers ? 1 : 0;



        // Social & Community Presence
        /**
         *1. Active social media (X / IG / Discord) Consistent posting & announcements
         *2. Transparent communication during issues
         */
        const isSocialMediaActive = firm.socialLinks.socialLinks?.length ? 1 : 0;
        const isTransparentCommunication = firm.support.avgResolutionTime ? 1 : 0;

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
        const isVerifiedPayoutHistory = firm.transparency.payoutProofPublic ? 1 : 0;
        const isNoMajorControversies = firm.transparency.thirdPartyAudit ? 1 : 0;
        const isLifeTimePayouts = firm.firmDetails.totalPayout === "$500,000" ? 0.5 : firm.firmDetails.totalPayout === "$1,000,000" ? 0.7 : firm.firmDetails.totalPayout === "$10,000,000" ? 0.8 : firm.firmDetails.totalPayout === "$50,000,000" ? 1 : firm.firmDetails.totalPayout === "$100,000,000" ? 1.2 : 0;
        const isConsistentOperations = firm.transparency.payoutProofPublic ? 1 : 0;

        // Trading Experience :- Piller-2
        const tradingExperiencePoints = 0;
        // Trading Conditions :
        /**
         * Fair spreads 1.0 - Low Close to Zero or Zero  0.7 - Medium 0.5 - High
        Fair commissions 1.0 - Zero Com 0.7 - Round Under $5  0.5 - $4+
        Acceptable slippage 1.0 - No Slippage 0.7 - Spipage
        Multiple trading Platforms 1.0 - All Major 0.8 - Only MT5 0.7 - Only Ctrader + Other 0.5 - No Mt5/ctrader
         */


        // Trading Freedom
        /**
         *PROFIT TARGETs 1.0 - 8 + 5  0.8 - 10+4  0.7 - 10+5  0.6 - 10+8
         Consistancy Rule 1.0 - NO 0.7 - Yes 0.9 - Multi Option
        NEWS TRADING 1.0 - Allowed - 1 On Funded and Evalutaion both, 0.8 - 5 min restrictions - 0.8 (Allowed in Evals),0.5 - Not allowed on Both (Evals + Funded),  0.1 - Holding ALLOWD, 0.0 - Holding Not ALLOWD
         */
        // Rules & Fairness
        /**
         *Lavrage/Margin Rule 1.0 - No Rule   0.5 - Margin Rule Yes
         No hidden restrictions/Stratgy 1.0 - NO   0.7 - Yes
         DD TYPE 1.0 - BALANCE BASED DD 0.5 - EQUITY BASED DAILY or MAX
         */





        return NextResponse.json({ message: "Hello" })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}