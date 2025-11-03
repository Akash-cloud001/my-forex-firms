import AdministrationAuditStep from "../form-step/administration-audit-step";
import ChallengeInformationStep from "../form-step/challenge-information-step";
import FirmInformationStep from "../form-step/firm-information-step";
import PayoutFinancialStep from "../form-step/payout-financial-step";
import SupportOperationsStep from "../form-step/support-operations-step";
import TradingEnvironmentStep from "../form-step/trading-environment-step";
import TradingPlatformsStep from "../form-step/trading-platforms-step";
import TransparencyVerificationStep from "../form-step/transparency-verification-step";

export const steps = [
  { id: 1, name: "Firm Information", component: FirmInformationStep },
  { id: 2, name: "Trading Platforms", component: TradingPlatformsStep },
  { id: 3, name: "Payout & Financial", component: PayoutFinancialStep },
  { id: 4, name: "Challenge Information", component: ChallengeInformationStep },
  { id: 5, name: "Trading Environment", component: TradingEnvironmentStep },
  { id: 6, name: "Support & Operations", component: SupportOperationsStep },
  { id: 7, name: "Transparency & Verification", component: TransparencyVerificationStep },
  { id: 8, name: "Administration & Audit", component: AdministrationAuditStep },
];

export const STORAGE_KEY = 'firmFormDraft';
