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
      className={`w-full text-left px-4 py-2 rounded-sm transition-all duration-200 flex items-center justify-between group ${
        isSelected
          ? 'bg-linear-to-r from-primary to-primary/90 text-white shadow-md shadow-primary/20'
          : 'hover:bg-accent/50 text-foreground hover:shadow-sm'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className={`font-medium truncate capitalize ${isSelected ? 'text-white' : 'text-foreground'}`}>
          {category.name}
        </div>
        <div className={`text-xs mt-0.5 capitalize ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>
          {faqCount} {faqCount === 1 ? 'FAQ' : 'FAQs'}
        </div>
      </div>
      <ChevronRight
        className={`w-4 h-4 shrink-0 transition-all duration-200 ${
          isSelected 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 group-hover:opacity-60 -translate-x-1 group-hover:translate-x-0'
        }`}
      />
    </button>
  );
};