"use client";

import React from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import EditableField from './EditableField';

export interface ComparisonRow {
  criteria: string;
  instant?: string;
  instantHighlight?: 'red' | 'yellow' | 'success';
  phase1?: string;
  phase1Highlight?: 'red' | 'yellow' | 'success';
  phase2?: string;
  phase2Highlight?: 'red' | 'yellow' | 'success';
}

interface TableEditorProps {
  headers: string[];
  rows: ComparisonRow[];
  onHeadersChange: (headers: string[]) => void;
  onRowsChange: (rows: ComparisonRow[]) => void;
  className?: string;
  disabled?: boolean;
}

export default function TableEditor({
  headers,
  rows,
  onHeadersChange,
  onRowsChange,
  className,
  disabled = false,
}: TableEditorProps) {
  const [editingCell, setEditingCell] = React.useState<{ row: number; col: string } | null>(null);
  const [editingHeader, setEditingHeader] = React.useState<number | null>(null);

  const handleHeaderSave = (index: number, newValue: string) => {
    const updatedHeaders = [...headers];
    updatedHeaders[index] = newValue.trim();
    onHeadersChange(updatedHeaders);
    setEditingHeader(null);
  };

  const handleCellSave = (rowIndex: number, field: keyof ComparisonRow, newValue: string) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      [field]: newValue.trim(),
    };
    onRowsChange(updatedRows);
    setEditingCell(null);
  };

  const handleHighlightChange = (
    rowIndex: number,
    field: 'instantHighlight' | 'phase1Highlight' | 'phase2Highlight',
    value: 'red' | 'yellow' | 'success' | 'none'
  ) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      [field]: value === 'none' ? undefined : value,
    };
    onRowsChange(updatedRows);
  };

  const handleAddRow = () => {
    onRowsChange([
      ...rows,
      {
        criteria: 'New Criteria',
        instant: '',
        phase1: '',
        phase2: '',
      },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    onRowsChange(rows.filter((_, i) => i !== index));
  };

  const getHighlightClass = (highlight?: 'red' | 'yellow' | 'success') => {
    if (highlight === 'success') return 'text-green-400';
    if (highlight === 'yellow') return 'text-yellow-400';
    if (highlight === 'red') return 'text-red-400';
    return 'text-foreground';
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Criteria</TableHead>
              {headers.map((header, index) => (
                <TableHead key={index} className="min-w-[120px]">
                  {editingHeader === index ? (
                    <EditableField
                      value={header}
                      onSave={(newValue) => handleHeaderSave(index, newValue)}
                      className="w-full"
                      placeholder="Header"
                    />
                  ) : (
                    <span
                      onClick={() => !disabled && setEditingHeader(index)}
                      className="cursor-pointer hover:text-primary transition-colors"
                    >
                      {header}
                    </span>
                  )}
                </TableHead>
              ))}
              {!disabled && <TableHead className="w-[50px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell>
                  {editingCell?.row === rowIndex && editingCell.col === 'criteria' ? (
                    <EditableField
                      value={row.criteria}
                      onSave={(newValue) => handleCellSave(rowIndex, 'criteria', newValue)}
                      className="w-full"
                      placeholder="Criteria"
                    />
                  ) : (
                    <span
                      onClick={() => !disabled && setEditingCell({ row: rowIndex, col: 'criteria' })}
                      className="cursor-pointer hover:text-primary transition-colors"
                    >
                      {row.criteria}
                    </span>
                  )}
                </TableCell>
                {headers.map((header, colIndex) => {
                  const fieldMap: Record<number, 'instant' | 'phase1' | 'phase2'> = {
                    0: 'instant',
                    1: 'phase1',
                    2: 'phase2',
                  };
                  const field = fieldMap[colIndex];
                  const highlightField = `${field}Highlight` as 'instantHighlight' | 'phase1Highlight' | 'phase2Highlight';
                  const value = row[field] || '';
                  const highlight = row[highlightField];

                  return (
                    <TableCell key={colIndex}>
                      <div className="flex items-center gap-2">
                        {editingCell?.row === rowIndex && editingCell.col === field ? (
                          <EditableField
                            value={value}
                            onSave={(newValue) => handleCellSave(rowIndex, field, newValue)}
                            className="flex-1"
                            placeholder="Value"
                          />
                        ) : (
                          <span
                            onClick={() => !disabled && setEditingCell({ row: rowIndex, col: field })}
                            className={cn(
                              "flex-1 cursor-pointer hover:opacity-80 transition-opacity",
                              getHighlightClass(highlight)
                            )}
                          >
                            {value || '-'}
                          </span>
                        )}
                        {!disabled && (
                          <Select
                            value={highlight || 'none'}
                            onValueChange={(value) =>
                              handleHighlightChange(rowIndex, highlightField, value as 'red' | 'yellow' | 'success' | 'none')
                            }
                          >
                            <SelectTrigger className="w-[80px] h-8">
                              <SelectValue placeholder="Color" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="success">Green</SelectItem>
                              <SelectItem value="yellow">Yellow</SelectItem>
                              <SelectItem value="red">Red</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </TableCell>
                  );
                })}
                {!disabled && (
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveRow(rowIndex)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {!disabled && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleAddRow}
          className="w-full flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Row
        </Button>
      )}
    </div>
  );
}

