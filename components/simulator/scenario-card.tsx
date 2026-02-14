'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, Globe, MessageSquare, Mail } from 'lucide-react'
import Image from 'next/image'

interface Scenario {
  id: number
  type: 'sms' | 'website' | 'whatsapp' | 'email'
  title: string
  content: string
  image?: string
  safe: boolean
  explanation: string
  tips: string[]
}

const typeIcons: Record<string, React.ReactNode> = {
  sms: <MessageCircle className="w-5 h-5" />,
  website: <Globe className="w-5 h-5" />,
  whatsapp: <MessageSquare className="w-5 h-5" />,
  email: <Mail className="w-5 h-5" />,
}

const typeLabels: Record<string, string> = {
  sms: 'رسالة نصية',
  website: 'موقع ويب',
  whatsapp: 'واتس آب',
  email: 'بريد إلكتروني',
}

interface ScenarioCardProps {
  scenario: Scenario
  onAnswer: (answer: boolean) => void
}

export function ScenarioCard({ scenario, onAnswer }: ScenarioCardProps) {
  return (
    <Card className="p-6 md:p-8 border-border">
      {/* Type Badge */}
      <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
        {typeIcons[scenario.type]}
        <span>{typeLabels[scenario.type]}</span>
      </div>

      {/* Scenario Title */}
      <h2 className="text-2xl font-bold text-foreground mb-4">
        {scenario.title}
      </h2>

      {/* Scenario Image */}
      {scenario.image && (
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-sm h-96 rounded-lg overflow-hidden border border-border shadow-md">
            <Image
              src={scenario.image}
              alt={scenario.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Scenario Content */}
      {!scenario.image && (
        <div className="bg-muted p-6 rounded-lg mb-8 border border-border">
          <p className="text-foreground leading-relaxed whitespace-pre-wrap break-words">
            {scenario.content}
          </p>
        </div>
      )}

      {/* Question */}
      <div className="mb-8">
        <p className="text-lg font-semibold text-foreground mb-6 text-center">
          تشوفها آمنة ولا لا؟
        </p>

        {/* Answer Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => onAnswer(true)}
            size="lg"
            className="h-touch bg-safe hover:bg-safe/90 text-white text-base font-semibold"
          >
            <span className="text-xl me-2">✅</span>
            آمنة
          </Button>
          <Button
            onClick={() => onAnswer(false)}
            size="lg"
            className="h-touch bg-danger hover:bg-danger/90 text-white text-base font-semibold"
          >
            <span className="text-xl me-2">❌</span>
            خطيرة
          </Button>
        </div>
      </div>

      {/* Hint */}
      <p className="text-xs text-muted-foreground text-center">
        فكّر جيداً قبل ما تجاوب
      </p>
    </Card>
  )
}
