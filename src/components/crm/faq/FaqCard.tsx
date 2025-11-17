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
    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all group">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm mt-1">
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold mb-2 text-foreground leading-relaxed">
              {faq.question}
            </h3>
            <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
          </div>
          <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="h-9 w-9"
              title="Edit FAQ"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-9 w-9 text-destructive hover:bg-destructive/20"
              title="Delete FAQ"
            >
              <Trash2 className="w-4 h-4" />
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
};
