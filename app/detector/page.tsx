'use client'

import { useState } from 'react'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

type RiskLevel = null | 'safe' | 'suspicious' | 'danger'

const mockAnalyses = [
  {
    keyword: 'تأكيد الهوية',
    risk: 'danger',
    message: 'كلمات شائعة في رسائل التصيد الاحتيالي'
  },
  {
    keyword: 'انقر هنا',
    risk: 'suspicious',
    message: 'رسائل مريبة تحتوي على روابط غير متوقعة'
  },
  {
    keyword: 'bit.ly',
    risk: 'danger',
    message: 'روابط مختصرة مريبة - قد تخفي عنوان الموقع الحقيقي'
  },
  {
    keyword: 'فعّل حسابك',
    risk: 'danger',
    message: 'طلب تفعيل أو تأكيد - علامة تصيد'
  },
  {
    keyword: 'عاجل',
    risk: 'suspicious',
    message: 'إنشاء جو من الضغط والاستعجالية'
  }
]

export default function DetectorPage() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<{
    risk: RiskLevel
    riskScore: number
    findings: { keyword: string; risk: string; message: string }[]
  } | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeContent = async () => {
    if (!input.trim()) return

    setIsAnalyzing(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    let risk: RiskLevel = 'safe'
    let riskScore = 0
    const findings: { keyword: string; risk: string; message: string }[] = []

    const inputLower = input.toLowerCase()

    mockAnalyses.forEach((analysis) => {
      if (inputLower.includes(analysis.keyword.toLowerCase())) {
        findings.push(analysis)
        if (analysis.risk === 'danger') riskScore += 30
        else if (analysis.risk === 'suspicious') riskScore += 15
      }
    })

    // Determine risk level
    if (riskScore >= 30) risk = 'danger'
    else if (riskScore >= 15) risk = 'suspicious'
    else risk = 'safe'

    setResult({
      risk,
      riskScore: Math.min(riskScore, 100),
      findings
    })
    setIsAnalyzing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      analyzeContent()
    }
  }

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'safe':
        return { bg: 'bg-safe/10', border: 'border-safe', text: 'text-safe', icon: CheckCircle }
      case 'suspicious':
        return { bg: 'bg-warning/10', border: 'border-warning', text: 'text-warning', icon: AlertCircle }
      case 'danger':
        return { bg: 'bg-danger/10', border: 'border-danger', text: 'text-danger', icon: AlertTriangle }
      default:
        return { bg: '', border: '', text: '', icon: AlertCircle }
    }
  }

  const getRiskLabel = (risk: RiskLevel) => {
    switch (risk) {
      case 'safe':
        return 'آمن'
      case 'suspicious':
        return 'مشبوه'
      case 'danger':
        return 'خطير'
      default:
        return ''
    }
  }

  const colors = result ? getRiskColor(result.risk) : {}
  const Icon = colors.icon

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              تأكّد قبل ما تضغط
            </h1>
            <p className="text-muted-foreground">
              الصق رسالة أو رابط لنفحص إذا كان آمناً أم مريباً
            </p>
          </div>

          {/* Input Card */}
          {!result && (
            <Card className="p-6 md:p-8 mb-8 border-border">
              <label className="block mb-4">
                <p className="text-sm font-semibold text-foreground mb-2">الرسالة أو الرابط</p>
                <Textarea
                  placeholder="الصق الرسالة أو الرابط المريب هنا..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="min-h-32 font-mono text-sm"
                />
              </label>

              <Button
                onClick={analyzeContent}
                disabled={!input.trim() || isAnalyzing}
                size="lg"
                className="w-full h-touch bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold"
              >
                {isAnalyzing ? (
                  <>
                    <span className="animate-spin me-2">⏳</span>
                    جاري الفحص...
                  </>
                ) : (
                  <>
                    <span className="me-2">🔍</span>
                    فحص
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                أو اضغط Ctrl + Enter للفحص السريع
              </p>
            </Card>
          )}

          {/* Result Card */}
          {result && (
            <div className="space-y-6">
              <Card className={`p-8 border-2 ${colors.border} ${colors.bg}`}>
                {/* Result Header */}
                <div className="flex items-start gap-4 mb-6">
                  {Icon && <Icon className={`w-10 h-10 ${colors.text} flex-shrink-0 mt-1`} />}
                  <div>
                    <h2 className={`text-3xl font-bold ${colors.text}`}>
                      {result.risk === 'safe' && '🟢'}
                      {result.risk === 'suspicious' && '🟠'}
                      {result.risk === 'danger' && '🔴'}
                      {' '}
                      {getRiskLabel(result.risk)}
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      {result.risk === 'safe' && 'هذا المحتوى يبدو آمناً'}
                      {result.risk === 'suspicious' && 'هذا المحتوى قد يكون مريباً - كن حذراً'}
                      {result.risk === 'danger' && 'هذا المحتوى قد يكون خطيراً جداً - لا تتفاعل معه'}
                    </p>
                  </div>
                </div>

                {/* Risk Score */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-foreground">درجة الخطورة</span>
                    <span className="text-sm font-semibold text-foreground">{result.riskScore}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        result.risk === 'safe' ? 'bg-safe' : result.risk === 'suspicious' ? 'bg-warning' : 'bg-danger'
                      }`}
                      style={{ width: `${result.riskScore}%` }}
                    />
                  </div>
                </div>

                {/* Findings */}
                {result.findings.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">المؤشرات المكتشفة</h3>
                    <ul className="space-y-2">
                      {result.findings.map((finding, index) => (
                        <li key={index} className="text-sm p-3 bg-background rounded border border-border">
                          <p className="font-semibold text-foreground">{finding.keyword}</p>
                          <p className="text-muted-foreground text-xs mt-1">{finding.message}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.findings.length === 0 && (
                  <p className="text-sm text-muted-foreground">لم يتم اكتشاف مؤشرات مريبة معروفة</p>
                )}
              </Card>

              {/* Recommendations */}
              <Card className="p-6 bg-secondary/50 border-border">
                <h3 className="font-semibold text-foreground mb-4">الخطوات الموصى بها</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {result.risk === 'safe' && (
                    <>
                      <li>✓ يبدو أن هذا المحتوى آمن</li>
                      <li>✓ مع ذلك، كن حذراً دائماً من الروابط غير المتوقعة</li>
                    </>
                  )}
                  {result.risk === 'suspicious' && (
                    <>
                      <li>⚠ تجنب النقر على الروابط من هذا المحتوى</li>
                      <li>⚠ لا تشارك بيانات شخصية</li>
                      <li>⚠ إذا كانت من شخص موثوق، تحقق معه مباشرة</li>
                    </>
                  )}
                  {result.risk === 'danger' && (
                    <>
                      <li>🚫 لا تنقر على أي روابط من هذا المحتوى</li>
                      <li>🚫 لا تشارك أي بيانات شخصية</li>
                      <li>🚫 إذا كانت من حساب موثوق، تنبه صاحب الحساب</li>
                      <li>🚫 كن حذراً وقم بحذف الرسالة</li>
                    </>
                  )}
                </ul>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setResult(null)
                    setInput('')
                  }}
                  size="lg"
                  className="w-full h-touch bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold"
                >
                  فحص رسالة أخرى
                </Button>

                <Link href="/report" className="block">
                  <Button variant="outline" size="lg" className="w-full h-touch text-base font-semibold">
                    بلّغ عن هذا المحتوى
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
