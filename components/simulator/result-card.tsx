'use client'

import { Card } from '@/components/ui/card'
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react'

interface Scenario {
  id: number
  type: 'sms' | 'website' | 'whatsapp' | 'email'
  title: string
  content: string
  safe: boolean
  explanation: string
  tips: string[]
}

interface ResultCardProps {
  scenario: Scenario
  isCorrect: boolean
  userAnswer: boolean
}

export function ResultCard({ scenario, isCorrect, userAnswer }: ResultCardProps) {
  return (
    <Card className={`p-6 md:p-8 border-2 ${isCorrect ? 'border-safe bg-safe/5' : 'border-danger bg-danger/5'}`}>
      {/* Result Header */}
      <div className="flex items-start gap-4 mb-6">
        {isCorrect ? (
          <CheckCircle className="w-10 h-10 text-safe flex-shrink-0 mt-1" />
        ) : (
          <XCircle className="w-10 h-10 text-danger flex-shrink-0 mt-1" />
        )}
        <div>
          <h3 className={`text-2xl font-bold ${isCorrect ? 'text-safe' : 'text-danger'}`}>
            {isCorrect ? 'أحسنت!' : 'في الواقع...'}
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            {isCorrect
              ? 'أنت محق، هذا '
              : 'الإجابة الصحيحة هي: '}
            {scenario.safe ? 'آمن' : 'خطير'}
          </p>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-background rounded-lg p-6 mb-6 border border-border">
        <p className="text-foreground leading-relaxed">
          {scenario.explanation}
        </p>
      </div>

      {/* Tips */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-warning" />
          <h4 className="font-semibold text-foreground">نصائح للحماية</h4>
        </div>

        <ul className="space-y-2">
          {scenario.tips.map((tip, index) => (
            <li key={index} className="flex gap-3 text-sm text-muted-foreground">
              <span className="text-primary font-semibold flex-shrink-0">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
