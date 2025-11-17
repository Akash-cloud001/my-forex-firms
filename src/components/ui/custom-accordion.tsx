"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomAccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function CustomAccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
  className,
}: CustomAccordionItemProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (panelRef.current) {
      if (isOpen) {
        panelRef.current.style.maxHeight = panelRef.current.scrollHeight + "px";
      } else {
        panelRef.current.style.maxHeight = "0";
      }
    }
  }, [isOpen]);

  return (
    <div className={cn("mb-3 sm:mb-4 md:mb-6 lg:mb-8 last:mb-0", className)}>
      <button
        className={cn(
          "w-full text-left cursor-pointer transition-all duration-300 flex items-center justify-between gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 rounded-xl sm:rounded-2xl md:rounded-3xl px-2.5 sm:px-3 md:px-4 lg:px-5 pt-2 sm:pt-2.5 md:pt-3 lg:pt-4 hover:no-underline text-sm sm:text-base md:text-xl lg:text-2xl tracking-tight font-semibold text-white",
          isOpen && "rounded-b-none"
        )}
        onClick={onToggle}
        type="button"
      >
        <span className="w-[90%] text-wrap pr-1 sm:pr-1.5 md:pr-2 wrap-break-word min-w-0">{question}</span>
        <ChevronDownIcon
          className={cn(
            "size-3.5 sm:size-4 md:size-5 shrink-0 transition-transform duration-300 text-white",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        ref={panelRef}
        className="overflow-hidden transition-[max-height] duration-300 ease-out rounded-b-xl sm:rounded-b-2xl md:rounded-b-3xl"
        style={{ maxHeight: "0" }}
      >
        <div className="px-2.5 sm:px-3 md:px-4 lg:px-6 pt-1.5 sm:pt-2 md:pt-3 lg:pt-4 font-geist-sans first-letter:uppercase leading-relaxed text-white/90 text-xs sm:text-sm md:text-base lg:text-lg whitespace-normal break-words font-light tracking-tight">
          {answer}
        </div>
      </div>
    </div>
  );
}

interface CustomAccordionProps {
  items: Array<{ question: string; answer: string }>;
  defaultOpenIndex?: number;
  className?: string;
  allowMultiple?: boolean;
}

export function CustomAccordion({
  items,
  defaultOpenIndex = 0,
  className,
  allowMultiple = false,
}: CustomAccordionProps) {
  const [openIndices, setOpenIndices] = React.useState<Set<number>>(
    new Set(defaultOpenIndex !== undefined ? [defaultOpenIndex] : [])
  );

  const handleToggle = (index: number) => {
    setOpenIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className={cn("w-full", className)}>
      {items.map((item, index) => (
        <CustomAccordionItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndices.has(index)}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  );
}

