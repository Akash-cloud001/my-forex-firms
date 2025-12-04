/* eslint-disable */
// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { LayoutGrid, Edit, DollarSign, TrendingUp, Gauge } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

function ProgramTab({ firmData, handleEdit }: any) {
  const renderFeatures = (program: any) => {
    const features = [
      { condition: program.stopLossRequired, label: 'Stop Loss', variant: 'default' as const },
      { condition: program.eaAllowed, label: 'EA Allowed', variant: 'default' as const },
      { condition: program.weekendHolding, label: 'Weekend', variant: 'default' as const },
      { condition: program.overnightHolding, label: 'Overnight', variant: 'default' as const },
      { condition: !program.newsTrading, label: 'No News', variant: 'destructive' as const },
      { condition: program.copyTrading, label: 'Copy Trading', variant: 'default' as const },
    ];

    return (
      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
        {features
          .filter((f) => f.condition)
          .map((feature, idx) => (
            <Badge key={idx} variant={feature.variant} className="text-xs px-2 py-0.5">
              {feature.label}
            </Badge>
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
              {/* <caption className="py-4 text-sm text-muted-foreground">
                A comprehensive list of all challenge programs and their details
              </caption> */}
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Program Name</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-foreground">Phases</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Account Sizes</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-foreground">Profit Split</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-foreground">Leverage</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Features</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Payout Schedule</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Created</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {firmData?.programs?.length > 0 ? (
                  firmData.programs.map((program: any) => (
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
                        <div className="space-y-1.5">
                          {program.accountSizes.map((a: any) => (
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
                      <td className="px-4 py-4 text-center">
                        <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-full px-3 py-1">
                          <Gauge className="h-3.5 w-3.5" />
                          <span className="font-bold text-sm">{program.leverage}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">{renderFeatures(program)}</td>
                      <td className="px-4 py-4">
                        <div className="space-y-1.5">
                          {program.payoutFrequency.map((p: any) => (
                            <div
                              key={p._id}
                              className="text-sm bg-muted/30 rounded px-2 py-1"
                            >
                              <span className="font-medium">{p.label}</span>
                              <span className="text-muted-foreground ml-1.5">
                                ({p.percentage})
                              </span>
                            </div>
                          ))}
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
                    <td colSpan={10} className="px-4 py-8 text-center text-muted-foreground">
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