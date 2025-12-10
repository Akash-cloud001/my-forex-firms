import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getErrorMessage, formatApiError } from "../utils";
import { ProgramFormData } from "../types";

interface UseProgramDataProps {
    programId?: string;
    propFirmId: string;
    reset: (data: Partial<ProgramFormData>) => void;
}

export const useProgramData = ({ programId, propFirmId, reset }: UseProgramDataProps) => {
    const [isLoadingProgram, setIsLoadingProgram] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProgramData = async () => {
            if (!programId) return;

            setIsLoadingProgram(true);
            setIsEditing(true);

            try {
                const response = await fetch(`/api/admin/firm-program/${programId}`);
                const result = await response.json();

                if (!response.ok) {
                    const errorMsg = formatApiError(result);
                    toast.error(`Failed to load program: ${errorMsg}`);
                    return;
                }

                if (result.success && result.data) {
                    const program = result.data;

                    // Reset form with fetched data
                    reset({
                        propFirmId: program.propFirmId || propFirmId,
                        type: program.type,
                        name: program.name,
                        evaluationPhases: program.evaluationPhases,
                        evaluationSteps: program.evaluationSteps || [],
                        accountSizes: program.accountSizes || [],
                        profitSplit: program.profitSplit,
                        payoutFrequency: program.payoutFrequency || [],
                        minPayout: program.minPayout,
                        fundedCriteria: program.fundedCriteria,
                        // Trading Rules
                        evaluationRule: program.evaluationRule,
                        fundedRule: program.fundedRule,

                        payoutMethods: program.payoutMethods || [],
                        timeLimit: program.timeLimit,
                        drawdownResetType: program.drawdownResetType,
                    });

                    toast.success("Program loaded successfully");
                }
            } catch (error) {
                const errorMsg = getErrorMessage(error);
                toast.error(`Error loading program: ${errorMsg}`);
            } finally {
                setIsLoadingProgram(false);
            }
        };

        fetchProgramData();
    }, [programId, propFirmId, reset]);

    return { isLoadingProgram, isEditing };
};
