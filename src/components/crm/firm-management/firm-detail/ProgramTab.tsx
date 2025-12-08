import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { LayoutGrid, Edit, DollarSign, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EvaluationStep, AccountSize, TradingRuleSet } from '../add-challange/types';

interface ProgramStep extends EvaluationStep {
  _id: string;
}

interface ProgramAccountSize extends AccountSize {
  _id: string;
}

interface Program {
  _id: string;
  type: string;
  name: string;
  evaluationPhases: string | number;
  evaluationSteps: ProgramStep[];
  accountSizes: ProgramAccountSize[];
  profitSplit: string;
  evalRules?: TradingRuleSet;
  timeLimit: string;
  drawdownType: string;
  payoutSchedule: string;
  createdAt: string;
}

function ProgramTab({ firmData, handleEdit }: { firmData: { programs: Program[] }; handleEdit: (program: Program) => void }) {
  const renderEvaluationRules = (rules: TradingRuleSet) => {
    if (!rules) return null;

    const rulesList = [
      { key: 'stopLoss', label: 'Stop Loss' },
      { key: 'eaAllowed', label: 'EA Allowed' },
      { key: 'weekendHolding', label: 'Weekend' },
      { key: 'overnightHolding', label: 'Overnight' },
      { key: 'newsTrading', label: 'News Trading' },
      { key: 'copyTrading', label: 'Copy Trading' },
      { key: 'consistency', label: 'Consistency' },
      { key: 'maxRiskPerTrade', label: 'Max Risk' },
    ];

    return (
      <div className="flex flex-wrap gap-1.5 max-w-[220px]">
        {rulesList
          .filter((rule) => rules?.[rule.key as keyof TradingRuleSet]?.required)
          .map((rule, idx) => (
            <Badge key={idx} variant="default" className="text-xs px-2 py-0.5">
              {rule.label}
            </Badge>
          ))}
      </div>
    );
  };

  const renderEvaluationSteps = (steps: ProgramStep[]) => {
    if (!steps || steps.length === 0) return null;

    return (
      <div className="space-y-1.5 max-w-[280px]">
        {steps.map((step) => (
          <div
            key={step._id}
            className="text-xs bg-muted/30 rounded px-2 py-1.5"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-foreground">Step {step.stepNumber}:</span>
              <span className="text-green-600 dark:text-green-400">+{step.profitTarget}%</span>
              <span className="text-red-600 dark:text-red-400">-{step.maxLoss}%</span>
              <span className="text-orange-600 dark:text-orange-400">Daily: {step.dailyLoss}%</span>
            </div>
            <div className="text-muted-foreground mt-0.5">
              Min Days: {step.minTradingDays} • {step.maxLossType}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <TabsContent value="program" className="mt-0">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <LayoutGrid className="h-5 w-5 text-primary" />
            Challenge Programs
          </CardTitle>
        </CardHeader>

        <CardContent className="px-0 sm:px-6">
          <div className="rounded-lg border border-border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Program Name</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-foreground">Phases</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Evaluation Steps</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Account Sizes</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-foreground">Profit Split</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Created</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {firmData?.programs?.length > 0 ? (
                  firmData.programs.map((program) => (
                    <tr key={program._id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-4">
                        <Badge variant="outline" className="text-xs font-medium capitalize">
                          {program.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 font-semibold text-foreground">
                        {program.name}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Badge variant="secondary" className="text-xs px-3 py-1">
                          {program.evaluationPhases}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        {renderEvaluationSteps(program.evaluationSteps)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1.5">
                          {program.accountSizes?.map((a) => (
                            <div
                              key={a._id}
                              className="flex items-center gap-1.5 text-sm bg-muted/30 rounded px-2 py-1"
                            >
                              <DollarSign className="h-3 w-3 text-muted-foreground" />
                              <span className="font-medium">
                                {a.size.toLocaleString()}
                              </span>
                              <span className="text-muted-foreground">→</span>
                              <span className="text-primary font-semibold">
                                ${a.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-700 dark:text-green-400 rounded-full px-3 py-1">
                          <TrendingUp className="h-3.5 w-3.5" />
                          <span className="font-bold text-sm">{program.profitSplit}%</span>
                        </div>
                      </td>



                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {new Date(program.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(program)}
                          className="hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={12} className="px-4 py-8 text-center text-muted-foreground">
                      No programs found. Create your first challenge program to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default ProgramTab;