'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { PointsToast } from '@/components/shared/points-toast'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import gamesContent from '@/lib/games-content.json'
import { addPoints } from '@/lib/scoring'
import { CheckCircle, XCircle, Link as LinkIcon, AlertTriangle } from 'lucide-react'
import { applyAccessibilityStyles } from '@/lib/accessibility'

interface URLScenario {
  id: string
  options: string[]
  correctIndex: number
  explanations: string[]
  signals: string[]
}

const POINTS = {
  CORRECT: 25,
  INCORRECT: 5,
}

export default function URLSpotterPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [userAnswer, setUserAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showPoints, setShowPoints] = useState(false)
  const [lastPoints, setLastPoints] = useState(0)

  const scenarios: URLScenario[] = gamesContent.games.url_spotter

  useEffect(() => {
    applyAccessibilityStyles()
  }, [])

  const currentScenario = scenarios[currentIndex]
  const isCorrect = userAnswer === currentScenario.correctIndex

  const handleAnswer = (index: number) => {
    setUserAnswer(index)
    setShowResult(true)

    if (index === currentScenario.correctIndex) {
      setScore(score + POINTS.CORRECT)
      setLastPoints(POINTS.CORRECT)
      addPoints(POINTS.CORRECT)
    } else {
      setScore(score + POINTS.INCORRECT)
      setLastPoints(POINTS.INCORRECT)
      addPoints(POINTS.INCORRECT)
    }
    setShowPoints(true)
  }

  const handleNext = () => {
    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowResult(false)
      setUserAnswer(null)
    } else {
      setShowResult(true)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setShowResult(false)
    setUserAnswer(null)
    setScore(0)
  }

  const isGameComplete = currentIndex === scenarios.length - 1 && showResult
  const progress = ((currentIndex + 1) / scenarios.length) * 100

  return (
    <div className="flex flex-col min-h-screen">
      <PointsToast
        points={lastPoints}
        show={showPoints}
        onClose={() => setShowPoints(false)}
      />
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
              <LinkIcon className="w-8 h-8 text-primary" />
              اصطياد الروابط المريبة
            </h1>
            <p className="text-muted-foreground text-lg">
              اختار الرابط الآمن من بين روابط مريبة
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                السؤال {currentIndex + 1} من {scenarios.length}
              </span>
              <span className="text-sm font-medium text-primary">
                {score} نقطة
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {!isGameComplete ? (
            // Game Content
            <Card className="p-6 md:p-8 mb-8">
              {/* Instructions */}
              <div className="bg-accent/10 border border-accent rounded-lg p-4 mb-8">
                <p className="text-foreground font-medium mb-2">
                  📌 اختار الرابط الآمن:
                </p>
                <p className="text-foreground/80 text-sm">
                  أحد هذه الروابط آمن والآخر مريب. اختار الرابط الموثوق.
                </p>
              </div>

              {/* URLs */}
              <div className="space-y-3 mb-8">
                {currentScenario.options.map((url, idx) => (
                  <Button
                    key={idx}
                    onClick={() => !showResult && handleAnswer(idx)}
                    disabled={showResult}
                    variant={
                      showResult
                        ? idx === currentScenario.correctIndex
                          ? 'default'
                          : idx === userAnswer
                          ? 'destructive'
                          : 'outline'
                        : 'outline'
                    }
                    className="w-full h-auto py-4 px-6 text-left rounded-lg break-all transition-colors"
                  >
                    <div className="w-full text-right">
                      <p className="text-xs text-muted-foreground mb-1">
                        رابط {idx + 1}
                      </p>
                      <p className="font-mono text-sm">{url}</p>
                      {showResult && idx === currentScenario.correctIndex && (
                        <div className="flex items-center gap-1 mt-2 text-xs">
                          <CheckCircle className="w-4 h-4" />
                          <span>هذا الرابط آمن</span>
                        </div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>

              {showResult && (
                <div className="space-y-6">
                  {/* Result Status */}
                  <div
                    className={`p-4 rounded-lg border-2 flex items-start gap-4 ${
                      isCorrect
                        ? 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-600'
                        : 'bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-600'
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    )}
                    <div>
                      <p className="font-bold text-foreground">
                        {isCorrect ? 'محفوظ! 🎯' : 'خطر! احذر من هذا الرابط'}
                      </p>
                      <p className="text-foreground/80 mt-1 text-sm">
                        الرابط الآمن:
                        {'\n'}
                        {currentScenario.options[currentScenario.correctIndex]}
                      </p>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-semibold text-foreground mb-2">
                      التفسير:
                    </p>
                    {currentScenario.explanations.map((exp, idx) => (
                      <p key={idx} className="text-foreground/80 mb-2 leading-relaxed text-sm">
                        {exp}
                      </p>
                    ))}
                  </div>

                  {/* Red Flags */}
                  {currentScenario.signals.length > 0 && (
                    <div className="bg-warning/10 border border-warning rounded-lg p-4">
                      <div className="flex gap-2 items-start mb-2">
                        <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                        <p className="font-semibold text-foreground">
                          الإشارات المريبة:
                        </p>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-foreground/80 text-sm">
                        {currentScenario.signals.map((signal, idx) => (
                          <li key={idx}>{signal}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Next Button */}
                  <Button
                    onClick={handleNext}
                    size="lg"
                    className="w-full"
                  >
                    {currentIndex < scenarios.length - 1
                      ? 'السؤال التالي'
                      : 'انتهيت!'}
                  </Button>
                </div>
              )}
            </Card>
          ) : (
            // Game Complete
            <Card className="p-8 text-center mb-8">
              <div className="mb-6">
                <LinkIcon className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  عبقري الروابط!
                </h2>
                <p className="text-xl text-muted-foreground mb-4">
                  انهيت جميع تحديات الروابط
                </p>
              </div>

              {/* Final Score */}
              <div className="bg-primary/10 rounded-lg p-6 mb-8">
                <p className="text-muted-foreground mb-2">النتيجة النهائية</p>
                <p className="text-5xl font-bold text-primary">{score}</p>
                <p className="text-muted-foreground mt-2">
                  من أصل {scenarios.length * POINTS.CORRECT} نقطة
                </p>
              </div>

              {/* Skills */}
              <div className="mb-8">
                <p className="text-lg text-foreground mb-4">
                  تعلمت كيف تتعرف على الروابط المريبة!
                </p>
                <ul className="text-left space-y-2 text-foreground/80">
                  <li>✓ تعرفت على الروابط المزيفة (punycode)</li>
                  <li>✓ تعرفت على الـ TLDs المريبة</li>
                  <li>✓ تعلمت خطورة الروابط المختصرة</li>
                  <li>✓ عندك مهارات الكشف عن الروابط المريبة</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={handleRestart}
                  size="lg"
                  className="w-full"
                >
                  جرّب مرة ثانية
                </Button>
                <Button
                  onClick={() => window.location.href = '/games'}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  العودة للألعاب الأخرى
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
