import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FieldErrors } from "react-hook-form";
import { ProgramFormData } from "../types";
import { getErrorMessage, formatApiError } from "../utils";

interface UseProgramSubmitProps {
    programId?: string;
    isEditing: boolean;
    propFirmId: string;
}

export const useProgramSubmit = ({ programId, isEditing, propFirmId }: UseProgramSubmitProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const onSubmit = async (data: ProgramFormData) => {
        setIsSubmitting(true);
        const loadingToast = toast.loading(
            isEditing ? "Updating program..." : "Creating program..."
        );

        try {
            // Remove evaluation data for Instant type
            if (data.type === "Instant") {
                delete data.evaluationPhases;
                delete data.evaluationSteps;
            }

            const url = isEditing
                ? `/api/admin/firm-program/${programId}`
                : "/api/admin/firm-program";

            const method = isEditing ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            // Check if response has content before parsing JSON
            const contentType = res.headers.get("content-type");
            let result;

            if (contentType && contentType.includes("application/json")) {
                const text = await res.text();
                result = text ? JSON.parse(text) : {};
            } else {
                result = { success: res.ok };
            }

            if (!res.ok) {
                const errorMsg = formatApiError(result);
                toast.error(`Failed to ${isEditing ? "update" : "create"} program: ${errorMsg}`, {
                    id: loadingToast,
                });
                return;
            }

            toast.success(
                `Program ${isEditing ? "updated" : "created"} successfully!`,
                { id: loadingToast }
            );

            // Navigate after a short delay
            setTimeout(() => {
                router.push(`/admin/firm-management/${propFirmId}/firm-detail`);
            }, 1000);
        } catch (error) {
            const errorMsg = getErrorMessage(error);
            toast.error(`Error submitting form: ${errorMsg}`, { id: loadingToast });
        } finally {
            setIsSubmitting(false);
        }
    };

    const onError = (errors: FieldErrors<ProgramFormData>) => {
        // Validation errors are already shown below each field
        // No need for toast notification - just log for debugging
        console.log("Form validation errors:", errors);
    };

    return { onSubmit, onError, isSubmitting };
};
