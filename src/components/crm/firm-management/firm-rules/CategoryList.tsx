/* eslint-disable */
// @ts-nocheck
import React from 'react';
import { Controller } from 'react-hook-form';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  categoryFields: any[];
  selectedIndex: number | null;
  editingIndex: number | null;
  isAdding: boolean;
  newName: string;
  watch: (name: string) => any;
  control: any;
  errors: any;
  onSelect: (i: number) => void;
  onEdit: (i: number, e: React.MouseEvent) => void;
  onSaveEdit: (i: number) => void;
  onCancelEdit: (i: number, original: string) => void;
  onAddClick: () => void;
  onCreate: () => void;
  onCancelAdd: () => void;
  onSetName: (v: string) => void;
  onDeleteCategory: (i: number, name: string, e: React.MouseEvent) => void;
}

export const CategoryList: React.FC<Props> = ({
  categoryFields,
  selectedIndex,
  editingIndex,
  isAdding,
  newName,
  watch,
  control,
  errors,
  onSelect,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onAddClick,
  onCreate,
  onCancelAdd,
  onSetName,
  onDeleteCategory,
}) => {
  return (
    <div className="bg-card border border-border rounded-lg shadow-sm sticky top-6">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Categories</h2>
          {!isAdding && (
            <Button
              onClick={onAddClick}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-all text-sm font-semibold"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {categoryFields.length} {categoryFields.length === 1 ? 'category' : 'categories'} total
        </p>
      </div>

      <div className="p-4 max-h-[calc(100vh-250px)] overflow-y-auto space-y-2">
        {/* ---- Add New ---- */}
        {isAdding && (
          <div className="p-4 bg-accent/30 border-2 border-primary rounded-lg mb-2">
            <div className="space-y-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => onSetName(e.target.value)}
                placeholder="Enter category name"
                autoFocus
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground text-sm font-semibold placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onCreate();
                  else if (e.key === 'Escape') onCancelAdd();
                }}
              />
              <div className="flex items-center gap-2">
                <Button
                  onClick={onCreate}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all text-sm font-semibold"
                >
                  <Check className="h-4 w-4" />
                  Create
                </Button>
                <Button
                  onClick={onCancelAdd}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-all text-sm font-semibold"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ---- Empty State ---- */}
        {categoryFields.length === 0 && !isAdding && (
          <div className="text-center py-12 px-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-3">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No categories yet. Click &quot;Add&quot; to create your first category.
            </p>
          </div>
        )}

        {/* ---- List ---- */}
        {categoryFields.map((field, i) => {
          const name = watch(`categories.${i}.name`);
          const isSelected = selectedIndex === i;
          const isEditing = editingIndex === i;
          const qCount = watch(`categories.${i}.questions`)?.length || 0;

          return (
            <div
              key={field.id}
              onClick={() => onSelect(i)}
              className={`group p-4 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary bg-accent shadow-md'
                  : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'
              }`}
            >
              {isEditing ? (
                <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                  <Controller
                    name={`categories.${i}.name`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        autoFocus
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground text-sm font-semibold placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') onSaveEdit(i);
                          else if (e.key === 'Escape') onCancelEdit(i, name);
                        }}
                      />
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => onSaveEdit(i)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all text-xs font-semibold"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Save
                    </Button>
                    <Button
                      onClick={() => onCancelEdit(i, name)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-all text-xs font-semibold"
                    >
                      <X className="h-3.5 w-3.5" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-sm text-foreground flex-1">
                      {name || `Category ${i + 1}`}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        onClick={(e) => onEdit(i, e)}
                        className="p-1.5 hover:bg-primary/20 rounded transition-all"
                      >
                        <Edit2 className="h-3.5 w-3.5 text-foreground" />
                      </Button>
                      <Button
                        onClick={(e) => onDeleteCategory(i, name || `Category ${i + 1}`, e)}
                        className="p-1.5 hover:bg-destructive/20 rounded transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  {errors.categories?.[i]?.name && (
                    <p className="text-destructive text-xs">{errors.categories[i].name.message}</p>
                  )}

                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      {qCount} {qCount === 1 ? 'question' : 'questions'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};