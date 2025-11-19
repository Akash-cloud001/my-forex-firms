/* eslint-disable */
// @ts-nocheck
import React from 'react'

import { Card, CardContent,  CardHeader, CardTitle } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { CreditCard, Edit } from 'lucide-react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
function ProgramTab({firmData,handleEdit}:any) {
  return (
    <TabsContent value="program">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Program{" "}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Table>
                <TableCaption>List of all challenge programs.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Evaluation Phases</TableHead>
                    <TableHead>Account Sizes</TableHead>
                    <TableHead>Profit Split</TableHead>
                    <TableHead>Leverage</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Payout</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {firmData?.programs.map((program: any) => (
                    <TableRow key={program._id}>
                      <TableCell>{program.type}</TableCell>
                      <TableCell className="font-medium">
                        {program.name}
                      </TableCell>
                      <TableCell>{program.evaluationPhases}</TableCell>

                      <TableCell>
                        {program.accountSizes.map((a: any) => (
                          <div key={a._id}>
                            ${a.size.toLocaleString()} – ${a.price}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>{program.profitSplit}%</TableCell>
                      <TableCell>{program.leverage}</TableCell>
                      <TableCell className="max-w-[180px]">
                        <div className="flex flex-wrap gap-1">
                          {program.stopLossRequired && <Badge>Stop Loss</Badge>}
                          {program.eaAllowed && <Badge>EA</Badge>}
                          {program.weekendHolding && <Badge>Weekend</Badge>}
                          {program.overnightHolding && <Badge>Overnight</Badge>}
                          {program.newsTrading && (
                            <Badge variant="destructive">No News</Badge>
                          )}
                          {program.copyTrading && <Badge>Copy</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        {program.payoutFrequency.map((p: any) => (
                          <div key={p._id}>
                            {p.label} ({p.percentage})
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                        {new Date(program.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(program)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
  )
}

export default ProgramTab