import { ChevronRight } from "lucide-react";
import { IFaqCategory } from "./type";

export const CategoryListItem = ({
  category,
  isSelected,
  faqCount,
  onClick,
}: {
  category: IFaqCategory;
  isSelected: boolean;
  faqCount: number;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group ${
        isSelected
          ? 'bg-primary text-white'
          : 'hover:bg-accent/40 text-foreground'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{category.name}</div>
        <div className="text-xs opacity-70 mt-0.5">{faqCount} FAQs</div>
      </div>
      <ChevronRight
        className={`w-4 h-4 shrink-0 transition-transform ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
        }`}
      />
    </button>
  );
};