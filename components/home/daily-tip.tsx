'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Lightbulb, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { dailyTips } from '@/lib/data'

export function DailyTip() {
  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    // Get a deterministic daily tip based on the current date
    const today = new Date()
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    )
    setTipIndex(dayOfYear % dailyTips.length)
  }, [])

  const currentTip = dailyTips[tipIndex]

  const getNextTip = () => {
    setTipIndex((prev) => (prev + 1) % dailyTips.length)
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <Card className="bg-secondary/50 border-secondary p-8 md:p-10">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-warning rounded-full p-3 flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                نصيحة الأمان لليوم
              </h3>
              <p className="text-muted-foreground text-sm">
                تعلم نصيحة جديدة كل يوم لحماية نفسك
              </p>
            </div>
          </div>

          <div className="bg-background rounded-lg p-6 mb-6 border border-border">
            <p className="text-lg text-foreground leading-relaxed">
              {currentTip}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={getNextTip}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            نصيحة أخرى
          </Button>
        </Card>
      </div>
    </section>
  )
}
