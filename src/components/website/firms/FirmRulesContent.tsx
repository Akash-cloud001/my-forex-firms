"use client"
import React, { useMemo, useState } from 'react'
import { CustomAccordionItem } from '@/components/ui/custom-accordion'
import { IFundingFirm } from '@/models/FirmDetails'
import { IFirmRule } from '@/models/firmRule'

interface FirmWithRules extends IFundingFirm {
  firmRules?: IFirmRule[]
}

interface FirmRulesContentProps {
  firmData: FirmWithRules | null
}

const FirmRulesContent: React.FC<FirmRulesContentProps> = ({ firmData }) => {
  const [openCategories, setOpenCategories] = useState<Set<number>>(new Set([0]))

  const toggleCategory = (index: number) => {
    setOpenCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const groupedCategories = useMemo(() => {
    if (!firmData?.firmRules?.length) return []

    const grouped = new Map<string, {
      name: string
      questions: Array<{ question: string; answer: string }>
    }>()

    firmData.firmRules.forEach((rule) => {
      rule.categories?.forEach((cat) => {
        if (!cat.status || !cat.name.trim()) return

        const key = cat.name.trim()
        const questions = cat.questions
          .filter(q => q.status)
          .map(q => ({ question: q.question, answer: q.answer }))

        if (grouped.has(key)) {
          const existing = grouped.get(key)!
          questions.forEach(q => {
            if (!existing.questions.some(eq => eq.question === q.question)) {
              existing.questions.push(q)
            }
          })
        } else {
          grouped.set(key, { name: cat.name, questions })
        }
      })
    })

    return Array.from(grouped.values())
  }, [firmData])

  if (!firmData?.firmRules?.length || !groupedCategories.length) {
    return (
      <div className="w-full py-12 text-center">
        <div className="card-custom-grad rounded-3xl p-8 sm:p-12">
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
            No Rules Available
          </h3>
          <p className="text-foreground/60 text-sm sm:text-base">
            Rules and policies for this firm are not currently available.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full py-6">
      <div className="space-y-4 sm:space-y-6">
        {groupedCategories.map((category, index) => (
          <div key={index} className="w-full">
            <div className="card-custom-grad rounded-3xl overflow-hidden pt-2 pb-3 px-4">
              <CustomAccordionItem
                question={category.name}
                answer={
                  <div className="space-y-4 sm:space-y-6 pt-2 px-2">
                    {category.questions.map((qa, qaIndex) => (
                      <div key={qaIndex} className="space-y-2">
                        <h4 className="text-base font-semibold text-foreground mb-2">
                          {qa.question}
                        </h4>
                        <div className="text-sm md:text-base text-foreground/90 font-light leading-relaxed">
                          {qa.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                }
                isOpen={openCategories.has(index)}
                onToggle={() => toggleCategory(index)}
                questionSize="text-xl sm:text-2xl md:text-3xl"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FirmRulesContent

