import { useEffect } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { ProgramFormData } from "../types";
import { getDefaultEvaluationSteps, getPhaseCount } from "../utils";

interface UseAutoPopulateProps {
    watch: UseFormWatch<ProgramFormData>;
    setValue: UseFormSetValue<ProgramFormData>;
    isEditing: boolean;
}

export const useAutoPopulate = ({ watch, setValue, isEditing }: UseAutoPopulateProps) => {
    const selectedType = watch("type");
    const existingSteps = watch("evaluationSteps");

    useEffect(() => {
        // Only auto-populate when creating a new program (not editing)
        // and when a valid challenge type is selected
        if (!selectedType || isEditing) return;

        const phaseCount = getPhaseCount(selectedType);

        if (selectedType === "Instant") {
            // Clear evaluation data for Instant type
            // Only update if not already cleared to prevent infinite loop
            if (existingSteps && existingSteps.length > 0) {
                setValue("evaluationSteps", []);
            }
            setValue("evaluationPhases", 0);
            return;
        }

        // Auto-populate for 1-Step, 2-Step, or 3-Step challenges
        // Only populate if steps don't already exist (prevents clearing on validation errors)
        if (phaseCount > 0 && (!existingSteps || existingSteps.length === 0)) {
            const defaultSteps = getDefaultEvaluationSteps(selectedType);

            setValue("evaluationPhases", phaseCount);
            setValue("evaluationSteps", defaultSteps);
        }
    }, [selectedType, setValue, isEditing, existingSteps]);

    return { selectedType };
};
