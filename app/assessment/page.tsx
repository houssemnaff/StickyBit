'use client'

import { useState } from 'react'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { assessmentQuestions } from '@/lib/data'
import { ArrowRight, Zap } from 'lucide-react'
import { addPoints, POINTS } from '@/lib/scoring'

interface AssessmentResult {
  riskScore: number
  level: 'weak' | 'medium' | 'strong'
  riskCount: number
  recommendations: string[]
}

export default function AssessmentPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<(boolean | null)[]>(new Array(assessmentQuestions.length).fill(null))
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState<AssessmentResult | null>(null)

  const handleAnswer = (answer: boolean) => {
    const newAnswers = [...answers]
    newAnswers[currentIndex] = answer
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentIndex < assessmentQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      calculateResult()
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const calculateResult = () => {
    let riskCount = 0
    const recommendations: string[] = []

    assessmentQuestions.forEach((question, index) => {
      const answer = answers[index]
      if (answer === null) return

      // If answer indicates risk (answer matches risk indicator)
      if ((question.risk && answer === true) || (!question.risk && answer === false)) {
        riskCount++

        if (question.id === 1) recommendations.push('استخدم كلمات سر مختلفة لكل حساب')
        if (question.id === 2) recommendations.push('فعّل المصادقة الثنائية على حساباتك المهمة')
        if (question.id === 3) recommendations.push('تحقق من الروابط قبل النقر عليها')
        if (question.id === 4) recommendations.push('تحقق دائماً من عنوان الموقع')
        if (question.id === 5) recommendations.push('لا تشارك معلومات شخصية على العام')
        if (question.id === 6) recommendations.push('غيّر كلمة السر بشكل دوري')
        if (question.id === 7) recommendations.push('احذر من الأرقام الوهمية')
        if (question.id === 8) recommendations.push('استخدم VPN عند الاتصال بـ WiFi عام')
        if (question.id === 9) recommendations.push('راقب حساباتك بشكل دوري')
        if (question.id === 10) recommendations.push('اقبل طلبات الإضافة من الأشخاص الموثوقين فقط')
      }
    })

    const riskPercentage = (riskCount / assessmentQuestions.length) * 100
    let level: 'weak' | 'medium' | 'strong'

    if (riskPercentage > 60) {
      level = 'weak'
    } else if (riskPercentage > 30) {
      level = 'medium'
    } else {
      level = 'strong'
    }

    const newResult: AssessmentResult = {
      riskScore: Math.round(100 - riskPercentage),
      level,
      riskCount,
      recommendations: [...new Set(recommendations)]
    }

    setResult(newResult)
    setShowResult(true)
    addPoints(POINTS.ASSESSMENT_COMPLETED)
  }

  const allAnswered = answers.every((a) => a !== null)
  const question = assessmentQuestions[currentIndex]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {!showResult ? (
            <>
              {/* Title */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  قدّاش حساباتك محمية؟
                </h1>
                <p className="text-muted-foreground">
                  اجب على هذه الأسئلة لتقييم مستوى حماية حساباتك
                </p>
              </div>

              {/* Progress */}
              <Card className="mb-8 p-6 bg-secondary/50 border-border">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">
                    السؤال {currentIndex + 1} من {assessmentQuestions.length}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {Math.round(((currentIndex + 1) / assessmentQuestions.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / assessmentQuestions.length) * 100}%` }}
                  />
                </div>
              </Card>

              {/* Question Card */}
              <Card className="p-8 mb-8 border-border">
                <h2 className="text-xl font-bold text-foreground mb-8 leading-relaxed">
                  {question.questionAr}
                </h2>

                <div className="space-y-3 mb-8">
                  <Button
                    onClick={() => handleAnswer(true)}
                    variant={answers[currentIndex] === true ? 'default' : 'outline'}
                    className={`w-full h-touch text-base font-semibold justify-start ${
                      answers[currentIndex] === true
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                        : ''
                    }`}
                  >
                    <span className="me-3">✓</span>
                    نعم
                  </Button>
                  <Button
                    onClick={() => handleAnswer(false)}
                    variant={answers[currentIndex] === false ? 'default' : 'outline'}
                    className={`w-full h-touch text-base font-semibold justify-start ${
                      answers[currentIndex] === false
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                        : ''
                    }`}
                  >
                    <span className="me-3">✕</span>
                    لا
                  </Button>
                </div>
              </Card>

              {/* Navigation */}
              <div className="flex gap-3">
                {currentIndex > 0 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex-1 h-touch"
                  >
                    السابق
                  </Button>
                )}

                <Button
                  onClick={handleNext}
                  disabled={answers[currentIndex] === null}
                  className="flex-1 h-touch bg-primary hover:bg-primary/90 text-primary-foreground font-semibold disabled:opacity-50"
                >
                  {currentIndex === assessmentQuestions.length - 1 ? 'نهاية الاختبار' : 'التالي'}
                  <ArrowRight className="w-4 h-4 ms-2" />
                </Button>
              </div>
            </>
          ) : result ? (
            <>
              {/* Result Header */}
              <Card
                className={`p-8 md:p-12 text-center mb-8 border-2 ${
                  result.level === 'strong'
                    ? 'border-safe bg-safe/10'
                    : result.level === 'medium'
                      ? 'border-warning bg-warning/10'
                      : 'border-danger bg-danger/10'
                }`}
              >
                <div className="mb-6">
                  <p className="text-5xl mb-4">
                    {result.level === 'strong' && '🟩'}
                    {result.level === 'medium' && '🟨'}
                    {result.level === 'weak' && '🟥'}
                  </p>
                  <h2
                    className={`text-3xl font-bold mb-2 ${
                      result.level === 'strong'
                        ? 'text-safe'
                        : result.level === 'medium'
                          ? 'text-warning'
                          : 'text-danger'
                    }`}
                  >
                    {result.level === 'strong' && 'حماية قوية'}
                    {result.level === 'medium' && 'حماية متوسطة'}
                    {result.level === 'weak' && 'حماية ضعيفة'}
                  </h2>
                  <p className="text-muted-foreground">
                    {result.level === 'strong' && 'حساباتك محمية بشكل جيد، استمر في الحفاظ على هذا المستوى'}
                    {result.level === 'medium' && 'حساباتك محمية بشكل معقول، لكن يمكنك تحسين الحماية'}
                    {result.level === 'weak' && 'حساباتك تحتاج إلى حماية أفضل، اتبع التوصيات أدناه'}
                  </p>
                </div>

                <div className="bg-background rounded-lg p-6 border border-border">
                  <p className="text-sm text-muted-foreground mb-2">درجة الأمان</p>
                  <p className="text-5xl font-bold text-primary">{result.riskScore}</p>
                </div>
              </Card>

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <Card className="p-6 md:p-8 mb-8 bg-secondary/50 border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-warning" />
                    <h3 className="text-lg font-bold text-foreground">التوصيات</h3>
                  </div>

                  <ul className="space-y-3">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex gap-3 text-sm">
                        <span className="text-primary font-semibold flex-shrink-0">→</span>
                        <span className="text-muted-foreground">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Next Actions */}
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setShowResult(false)
                    setCurrentIndex(0)
                    setAnswers(new Array(assessmentQuestions.length).fill(null))
                    setResult(null)
                  }}
                  size="lg"
                  className="w-full h-touch bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold"
                >
                  أعيد الاختبار
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-touch text-base font-semibold"
                  onClick={() => (window.location.href = '/academy')}
                >
                  اذهب إلى الأكاديمية
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  )
}
