import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { IFaq } from "./type";

export const FaqCard = ({
  faq,
  index,
  onEdit,
  
}: {
  faq: IFaq;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <div className=" overflow-hidden hover:border-primary/40 hover:shadow-md transition-all duration-200 group">
        <div className="flex items-start gap-5 py-2">
            <span className="flex items-center justify-center w-8 h-8 bg-muted-foreground/20 text-white/80 rounded-full text-sm font-bold">
              {index + 1}
            </span>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-foreground leading-relaxed pr-8 first-letter:capitalize">
              {faq.question}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm first-letter:capitalize">{faq.answer}</p>
          </div>
          <div className="shrink-0 flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="h-9 w-9 hover:bg-accent hover:text-foreground transition-colors"
              title="Edit FAQ"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
    </div>
  );
};
