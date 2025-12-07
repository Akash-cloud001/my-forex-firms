import React from 'react';
import { Edit2, Check, X, Loader2, RefreshCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FactorConfig, Criterion } from '@/components/crm/point-evaluation/types/constant.types';

interface FactorItemProps {
    config: FactorConfig;
    score: number;
    isEditing: boolean;
    editValue: string;
    setEditValue: (value: string) => void;
    saveEdit: () => void;
    cancelEdit: () => void;
    onEditClick: (e: React.MouseEvent) => void;
    isSaving: boolean;
}

const FactorItem: React.FC<FactorItemProps> = ({
    config,
    score,
    isEditing,
    editValue,
    setEditValue,
    saveEdit,
    cancelEdit,
    onEditClick,
    isSaving
}) => {
    return (
        <div className="py-2 border-b last:border-b-0">
            {/* Factor Header with Score */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium flex-1">
                    {config.label}
                </span>
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <Input
                                type="number"
                                step="0.1"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="w-16 h-7 text-xs"
                                autoFocus
                                disabled={isSaving}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') saveEdit();
                                    if (e.key === 'Escape') cancelEdit();
                                }}
                            />
                            {isSaving ? (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0"
                                    disabled
                                >
                                    <Loader2 size={14} className="animate-spin text-primary" />
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 w-7 p-0"
                                        onClick={saveEdit}
                                    >
                                        <Check size={14} className="text-green-600" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 w-7 p-0"
                                        onClick={cancelEdit}
                                    >
                                        <X size={14} className="text-red-600" />
                                    </Button>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <span className="text-xs font-semibold">
                                {score.toFixed(1)}/{config.max.toFixed(1)}
                            </span>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0"
                                onClick={onEditClick}
                                disabled={isSaving}
                            >
                                <Edit2 size={12} />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0"
                                // onClick={onEditClick}
                                disabled={isSaving}
                            >
                                <RefreshCcw size={12} />
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Criteria Options */}
            {config.criteria && config.criteria.length > 0 && (
                <div className="space-y-1">
                    {config.criteria.map((criterion: Criterion, idx: number) => (
                        <div
                            key={idx}
                            className={`text-xs px-2 py-1 rounded ${Math.abs(score - criterion.value) < 0.01
                                ? 'bg-primary/20 text-primary font-medium'
                                : 'text-muted-foreground bg-accent/30'
                                }`}
                        >
                            <span className="font-mono">
                                {criterion.value.toFixed(1)}
                            </span>{' '}
                            - {criterion.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FactorItem;
