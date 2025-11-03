import { firmFormSchema } from "@/components/crm/firm-form/schemas/schema";
import { z } from "zod";

export interface ValidationResult {
  success: boolean;
  data?: any;
  errors?: {
    field: string;
    message: string;
  }[];
  errorMessage?: string;
}

export class FirmValidationService {
  
  static validateFirmData(data: any): ValidationResult {
    try {
      const validatedData = firmFormSchema.parse(data);
      
      return {
        success: true,
        data: validatedData,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((err ) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return {
          success: false,
          errors,
          errorMessage: "Validation failed. Please check the provided data.",
        };
      }

      return {
        success: false,
        errorMessage: "An unexpected validation error occurred.",
      };
    }
  }

  static validatePartialFirmData(data: any): ValidationResult {
    try {
      const partialSchema = firmFormSchema.partial();
      const validatedData = partialSchema.parse(data);
      
      return {
        success: true,
        data: validatedData,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return {
          success: false,
          errors,
          errorMessage: "Validation failed. Please check the provided data.",
        };
      }

      return {
        success: false,
        errorMessage: "An unexpected validation error occurred.",
      };
    }
  }

  
  static prepareDataForValidation(rawData: any): any {
    const prepared = { ...rawData };

    if (prepared.firstPayoutTiming !== undefined && prepared.firstPayoutTiming !== null) {
      prepared.firstPayoutTiming = Number(prepared.firstPayoutTiming);
    }

    const booleanFields = [
      'newsTrading',
      'weekendHolding',
      'eaUsage',
      'copyTrading',
      'hedging',
      'scalping',
      'ceoPublic',
      'entityOfficeVerified',
      'termsPublicUpdated',
      'payoutProofsPublic',
      'thirdPartyAudit',
    ];

    booleanFields.forEach((field) => {
      if (prepared[field] !== undefined) {
        if (typeof prepared[field] === 'string') {
          prepared[field] = prepared[field] === 'true' || prepared[field] === 'True';
        } else if (typeof prepared[field] !== 'boolean') {
          prepared[field] = Boolean(prepared[field]);
        }
      }
    });

    if (prepared.challengeInformation && !Array.isArray(prepared.challengeInformation)) {
      prepared.challengeInformation = [];
    }

    if (prepared.logoFile === undefined || prepared.logoFile === 'null' || prepared.logoFile === '') {
      prepared.logoFile = null;
    }

    const optionalStringFields = [
      'logoUrl',
      'leadershipLinks',
      'trustPilotRating',
      'fastestSlowestPayoutDuration',
      'payoutFeesFxCosts',
      'totalPayoutsAllTime',
      'largestSinglePayout',
      'monthlyPayoutCounts',
      'payoutProofLinks',
      'slippageSwapPolicies',
      'copyTradeProviders',
      'mobileSupport',
      'newsTradingNotes',
      'weekendHoldingNotes',
      'eaUsageNotes',
      'copyTradingNotes',
      'hedgingNotes',
      'scalpingNotes',
      'escalationPolicy',
      'restrictedCountries',
      'amlComplianceLink',
      'transparencyNotes',
      'changelogNotes',
    ];

    optionalStringFields.forEach((field) => {
      if (prepared[field] === '') {
        prepared[field] = undefined;
      }
    });

    return prepared;
  }


  static formatValidationErrors(errors: { field: string; message: string }[]): string {
    return errors.map((err) => `${err.field}: ${err.message}`).join('; ');
  }
}