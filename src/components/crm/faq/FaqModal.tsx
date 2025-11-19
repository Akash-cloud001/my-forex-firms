import { useForm } from "react-hook-form";
import { FaqFormData } from "./type";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
export const FaqModal = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  defaultValues,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FaqFormData) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<FaqFormData>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FaqFormData>({
    defaultValues: defaultValues || { question: "", answer: "" },
  });

  const answerValue = watch("answer", "");

  useEffect(() => {
    if (isOpen && defaultValues) {
      reset(defaultValues);
    }
  }, [isOpen, defaultValues, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = async (data: FaqFormData) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">
            {mode === "create" ? "Create New FAQ" : "Edit FAQ"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new question and answer"
              : "Update FAQ information"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4 overflow-y-auto max-h-[60vh]">
          <div className="space-y-2">
            <Label
              htmlFor="question"
              className="flex text-white items-center gap-2"
            >
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                Q
              </span>
              Question <span className="text-destructive">*</span>
            </Label>
            <Input
              id="question"
              placeholder="What would you like to know?"
              {...register("question", {
                required: "Question is required",
                minLength: {
                  value: 5,
                  message: "Question must be at least 5 characters",
                },
              })}
              className={
                "text-white" +
                (errors.question ? "border-destructive text-white" : "")
              }
            />
            {errors.question && (
              <p className="text-sm text-destructive">
                {errors.question.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Make it clear and concise
            </p>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="answer"
              className="text-white flex items-center gap-2"
            >
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                A
              </span>
              Answer <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="answer"
              placeholder="Provide a detailed and helpful answer..."
              rows={8}
              {...register("answer", {
                required: "Answer is required",
                minLength: {
                  value: 10,
                  message: "Answer must be at least 10 characters",
                },
              })}
              className={
                "text-white " +
                (errors.question ? "border-destructive text-white" : "")
              }
            />
            {errors.answer && (
              <p className="text-sm text-destructive">
                {errors.answer.message}
              </p>
            )}
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Write a comprehensive answer
              </p>
              <p className="text-xs text-muted-foreground">
                {answerValue.length} characters
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            className="text-white"
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(onFormSubmit)}
            disabled={isSubmitting}
            className="bg-linear-to-r from-[#F66435] to-[#672611]"
          >
            {mode === "create" ? "Create FAQ" : "Update FAQ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
