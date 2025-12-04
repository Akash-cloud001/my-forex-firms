import { FieldErrors } from "react-hook-form";
import { EvaluationStep, ProgramFormData } from "./types";
import { DEFAULT_EVALUATION_STEPS } from "./constants";

/**
 * Get default evaluation steps based on challenge type
 */
export const getDefaultEvaluationSteps = (type: string): EvaluationStep[] => {
    return DEFAULT_EVALUATION_STEPS[type] || [];
};

/**
 * Get phase count for a challenge type
 */
export const getPhaseCount = (type: string): number => {
    switch (type) {
        case "1-Step":
            return 1;
        case "2-Step":
            return 2;
        case "3-Step":
            return 3;
        case "Instant":
            return 0;
        default:
            return 0;
    }
};

/**
 * Format validation errors into a readable string
 */
export const formatValidationErrors = (errors: FieldErrors<ProgramFormData>): string => {
    const errorMessages: string[] = [];

    Object.entries(errors).forEach(([field, error]) => {
        if (error?.message) {
            errorMessages.push(`${field}: ${error.message}`);
        } else if (Array.isArray(error)) {
            error.forEach((item, index) => {
                if (item && typeof item === "object") {
                    Object.entries(item).forEach(([subField, subError]) => {
                        if (subError && typeof subError === "object" && "message" in subError) {
                            errorMessages.push(`${field}[${index}].${subField}: ${subError.message}`);
                        }
                    });
                }
            });
        }
    });

    return errorMessages.length > 0
        ? errorMessages.join(", ")
        : "Please check the form for errors";
};

/**
 * Extract error message from various error types
 */
export const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === "string") {
        return error;
    }

    if (error && typeof error === "object" && "message" in error) {
        return String(error.message);
    }

    return "An unexpected error occurred";
};

/**
 * Format API error response
 */
export const formatApiError = (response: {
    success?: boolean;
    message?: string;
    error?: string;
}): string => {
    return response.message || response.error || "Failed to process request";
};
