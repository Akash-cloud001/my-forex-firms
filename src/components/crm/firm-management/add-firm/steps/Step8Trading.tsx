import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { Plus, TrendingUp, X, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface StepProps {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  onSubmit?: () => void;
}

export function Step8Trading({ onNext, onPrevious }: StepProps) {
  const { watch, setValue } = useFormContext();
  
  const [assetClass, setAssetClass] = useState('');
  
  const [commAssetClass, setCommAssetClass] = useState('');
  const [commissionDetails, setCommissionDetails] = useState('');

  const leverageMatrix = watch('trading.leverageMatrix') || {};
  const commissions = watch('trading.commissions') || {};

  const addLeverageRow = () => {
    if (assetClass.trim()) {
      setValue('trading.leverageMatrix', {
        ...leverageMatrix,
        [assetClass.trim()]: { Instant: '', '1-Step': '', '2-Step': '' },
      });
      setAssetClass('');
    }
  };

  const updateLeverage = (asset: string, type: string, value: string) => {
    setValue('trading.leverageMatrix', {
      ...leverageMatrix,
      [asset]: { ...leverageMatrix[asset], [type]: value },
    });
  };

  const removeLeverageRow = (asset: string) => {
    const updated = { ...leverageMatrix };
    delete updated[asset];
    setValue('trading.leverageMatrix', updated);
  };

  // ========== COMMISSIONS ==========
  const addCommission = () => {
    if (commAssetClass.trim() && commissionDetails.trim()) {
      setValue('trading.commissions', {
        ...commissions,
        [commAssetClass.trim()]: commissionDetails.trim(),
      });
      setCommAssetClass('');
      setCommissionDetails('');
    }
  };

  const removeCommission = (asset: string) => {
    const updated = { ...commissions };
    delete updated[asset];
    setValue('trading.commissions', updated);
  };

  const updateCommission = (asset: string, value: string) => {
    setValue('trading.commissions', {
      ...commissions,
      [asset]: value,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-6 w-6 " />
          Trading Conditions
        </h2>
        <p className="text-gray-600 mt-1">Configure leverage and commission structures</p>
      </div>

      {/* ========== LEVERAGE MATRIX SECTION ========== */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Leverage Matrix</Label>
          <p className="text-sm text-gray-500 mt-1">
            Define leverage ratios for different asset classes and account types
          </p>
        </div>

        {/* Add New Asset Class */}
        <Card className="p-4 ">
          <div className="flex gap-2">
            <Input
              value={assetClass}
              onChange={(e) => setAssetClass(e.target.value)}
              placeholder="Asset class (e.g., Forex, Metals, Indices)"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addLeverageRow();
                }
              }}
            />
            <Button type="button" onClick={addLeverageRow}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </Card>

        {/* Display Leverage Rows */}
        <div className="space-y-3">
          {Object.keys(leverageMatrix).length === 0 ? (
            <p className="text-center text-gray-500 py-6">No asset classes added yet</p>
          ) : (
            Object.keys(leverageMatrix).map((asset) => (
              <Card key={asset} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{asset}</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLeverageRow(asset)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['Instant', '1-Step', '2-Step'].map((type) => (
                    <div key={type}>
                      <Label className="text-xs text-gray-600">{type}</Label>
                      <Input
                        value={leverageMatrix[asset][type] || ''}
                        onChange={(e) => updateLeverage(asset, type, e.target.value)}
                        placeholder="e.g., 1:100"
                        className="mt-1"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* ========== COMMISSIONS SECTION ========== */}
      <div className="space-y-4 pt-6 ">
        <div>
          <Label className="text-lg font-semibold">Commission Structure</Label>
          <p className="text-sm text-gray-500 mt-1">
            Define commission rates for each asset class across different account types
          </p>
        </div>

        {/* Add New Commission */}
        <Card className="p-4 ">
          <div className="space-y-3">
            <div>
              <Label className="text-sm">Asset Class</Label>
              <Input
                value={commAssetClass}
                onChange={(e) => setCommAssetClass(e.target.value)}
                placeholder="e.g., FX, Metals, Indices"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm">Commission Details</Label>
              <Textarea
                value={commissionDetails}
                onChange={(e) => setCommissionDetails(e.target.value)}
                placeholder="e.g., FP Zero: $7 per lot | 1-Step, 2-Step & 2-Step Pro: $5 per lot"
                rows={2}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Include all account types and their respective rates
              </p>
            </div>
            <Button 
              type="button" 
              onClick={addCommission}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Commission Rule
            </Button>
          </div>
        </Card>

        {/* Display Commissions */}
        <div className="space-y-3">
          {Object.keys(commissions).length === 0 ? (
            <Card className="p-6 text-center border-2 border-dashed">
              <p className="text-gray-500">No commission rules added yet</p>
              <p className="text-xs text-gray-400 mt-1">Add commission structures for different asset classes</p>
            </Card>
          ) : (
            Object.entries(commissions).map(([asset, details]) => (
              <Card key={asset} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-base">{asset}</h3>
                    </div>
                    <Textarea
                      value={details as string}
                      onChange={(e) => updateCommission(asset, e.target.value)}
                      rows={2}
                      className="text-sm resize-none"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCommission(asset)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Commission Examples */}
        {Object.keys(commissions).length === 0 && (
          <Card className="p-4 ">
            <h4 className="font-semibold text-sm  mb-2">💡 Commission Format Examples:</h4>
            <div className="space-y-1 text-xs ">
              <p><strong>FX:</strong> FP Zero: $7 per lot | 1-Step, 2-Step & 2-Step Pro: $5 per lot</p>
              <p><strong>Metals:</strong> FP Zero: $7 per lot | 1-Step, 2-Step & 2-Step Pro: $5 per lot</p>
              <p><strong>Indices:</strong> No commission</p>
              <p><strong>Energy:</strong> No commission</p>
              <p><strong>Crypto:</strong> FP Zero, 1-Step, 2-Step & 2-Step Pro: 0.04% commission</p>
            </div>
          </Card>
        )}
      </div>

   

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 ">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button type="button" onClick={onNext}>
          Next Step
        </Button>
      </div>
    </div>
  );
}