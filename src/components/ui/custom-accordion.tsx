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
    <div className={cn("mb-8 last:mb-0", className)}>
      <button
        className={cn(
          "w-full text-left cursor-pointer transition-all duration-300 flex items-center justify-between gap-4 rounded-3xl px-5 hover:no-underline text-xl tracking-tight font-semibold text-white sm:text-2xl",
          isOpen && "rounded-b-none"
        )}
        onClick={onToggle}
        type="button"
      >
        <span className="flex-1 pr-2 break-words">{question}</span>
        <ChevronDownIcon
          className={cn(
            "size-5 shrink-0 transition-transform duration-300 text-white",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        ref={panelRef}
        className="overflow-hidden transition-[max-height] duration-300 ease-out rounded-b-3xl"
        style={{ maxHeight: "0" }}
      >
        <div className="px-6 pt-0 font-geist-sans first-letter:uppercase leading-relaxed text-white/90 sm:text-base whitespace-normal break-words !text-xl font-light tracking-tight">
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

