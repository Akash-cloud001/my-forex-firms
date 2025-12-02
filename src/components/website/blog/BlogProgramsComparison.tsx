"use client";

import React from "react";
import { BarChart3, LucideIcon } from "lucide-react";
import AnimatedSection from "@/components/website/AnimatedSection";
import { ProgramsComparisonSection, ComparisonRow } from "@/types/firm-review";

interface BlogProgramsComparisonProps {
  programsComparison: ProgramsComparisonSection;
  iconMap: Record<string, LucideIcon>;
}

export default function BlogProgramsComparison({
  programsComparison,
  iconMap,
}: BlogProgramsComparisonProps) {
  if (!programsComparison) return null;

  const IconComponent = iconMap[programsComparison.icon] || BarChart3;

  // All headers except "Criteria"
  const dataHeaders = programsComparison.headers.filter(
    (h) => h !== "Criteria"
  );

  // Get value keys from a row (exclude criteria + any *Highlight keys)
  const getValueKeysFromRow = (row: ComparisonRow): string[] => {
    return Object.keys(row).filter(
      (key) => key !== "criteria" && !key.endsWith("Highlight")
    );
  };

  // Derive column keys from the first row (by position)
  const columnKeys: string[] =
    programsComparison.rows && programsComparison.rows.length > 0
      ? getValueKeysFromRow(programsComparison.rows[0])
      : [];

  const getHighlightColor = (row: ComparisonRow, columnKey: string): string => {
    const highlightKey = `${columnKey}Highlight` as keyof ComparisonRow;
    const highlight = row[highlightKey];

    if (highlight === "red") return "text-red-500";
    if (highlight === "yellow") return "text-yellow-500";
    if (highlight === "success") return "text-green-400";
    return "";
  };

  const getCellValue = (row: ComparisonRow, columnKey: string): string => {
    if (!columnKey) return "";
    return (row[columnKey as keyof ComparisonRow] as string) || "";
  };

  return (
    <AnimatedSection id="blog-programs-comparison">
      <section id={programsComparison.id} className="mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 flex items-center gap-3 capitalize">
          <IconComponent className="h-8 w-8 text-primary" />
          {programsComparison.title}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border rounded-lg overflow-hidden text-foreground min-w-full">
            <thead>
              <tr className="bg-accent/20">
                <th className="text-sm sm:text-base border border-border p-4 text-left font-semibold whitespace-nowrap">
                  Criteria
                </th>
                {dataHeaders.map((header, index) => (
                  <th
                    key={index}
                    className="text-sm sm:text-base border border-border p-4 text-center font-semibold whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {programsComparison.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={rowIndex % 2 === 1 ? "bg-accent/10" : ""}
                >
                  <td className="border border-border p-4 text-sm sm:text-base font-medium whitespace-nowrap">
                    {row.criteria}
                  </td>

                  {dataHeaders.map((_, colIndex) => {
                    const columnKey = columnKeys[colIndex]; // same order as headers
                    const cellValue = getCellValue(row, columnKey);
                    const highlightColor = columnKey
                      ? getHighlightColor(row, columnKey)
                      : "";

                    return (
                      <td
                        key={colIndex}
                        className={`border border-border p-4 text-sm sm:text-base text-center ${highlightColor}`}
                      >
                        {cellValue}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AnimatedSection>
  );
}
