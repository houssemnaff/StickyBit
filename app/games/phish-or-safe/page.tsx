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
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { applyAccessibilityStyles } from '@/lib/accessibility'

interface PhishScenario {
  id: string
  text: string
  language: string
  choices: string[]
  correctChoice: string
  explanations: string[]
  tags: string[]
  riskSignals: string[]
}

const POINTS = {
  CORRECT: 25,
  INCORRECT: 5,
}

export default function PhishOrSafePage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [userAnswer, setUserAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [showPoints, setShowPoints] = useState(false)
  const [lastPoints, setLastPoints] = useState(0)

  const scenarios: PhishScenario[] = gamesContent.games.phish_or_safe

  useEffect(() => {
    applyAccessibilityStyles()
  }, [])

  const currentScenario = scenarios[currentIndex]
  const isCorrect = userAnswer === currentScenario.correctChoice

  const handleAnswer = (choice: string) => {
    setUserAnswer(choice)
    setShowResult(true)

    if (choice === currentScenario.correctChoice) {
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
      // Game complete
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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              هل هذا احتيال ولا آمن؟
            </h1>
            <p className="text-muted-foreground text-lg">
              اختبر معك عشرة رسائل حقيقية وقول لي إذا الرسالة احتيال ولا آمنة
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
              {/* Scenario */}
              <div className="mb-8">
                <div className="bg-muted p-6 rounded-lg border border-border mb-4">
                  <p className="text-foreground text-lg leading-relaxed">
                    {currentScenario.text}
                  </p>
                </div>

                {/* Tags */}
                {currentScenario.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentScenario.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-accent text-accent-foreground text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {!showResult ? (
                // Choices
                <div className="space-y-3">
                  {currentScenario.choices.map((choice, idx) => (
                    <Button
                      key={idx}
                      onClick={() => handleAnswer(choice)}
                      variant="outline"
                      className="w-full h-auto py-4 px-6 text-lg justify-start rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <span className="flex-1 text-right">{choice}</span>
                    </Button>
                  ))}
                </div>
              ) : (
                // Result
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
                        {isCorrect ? 'ممتاز!' : 'جرّب مرة ثانية'}
                      </p>
                      <p className="text-foreground/80 mt-1">
                        الجواب الصحيح: {currentScenario.correctChoice}
                      </p>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-semibold text-foreground mb-2">
                      التفسير:
                    </p>
                    {currentScenario.explanations.map((exp, idx) => (
                      <p key={idx} className="text-foreground/80 mb-2 leading-relaxed">
                        {exp}
                      </p>
                    ))}
                  </div>

                  {/* Risk Signals */}
                  {currentScenario.riskSignals.length > 0 && (
                    <div className="bg-warning/10 border border-warning rounded-lg p-4">
                      <div className="flex gap-2 items-start mb-2">
                        <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                        <p className="font-semibold text-foreground">
                          الإشارات التحذيرية:
                        </p>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-foreground/80">
                        {currentScenario.riskSignals.map((signal, idx) => (
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
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  مبروك!
                </h2>
                <p className="text-xl text-muted-foreground mb-4">
                  انهيت جميع الأسئلة
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

              {/* Performance */}
              <div className="mb-8">
                <p className="text-lg text-foreground mb-4">
                  أنت الآن أفضل في التعرف على الرسائل المريبة!
                </p>
                <ul className="text-left space-y-2 text-foreground/80">
                  <li>✓ تعرّفت على 10 رسائل احتيالية مختلفة</li>
                  <li>✓ تعلمت الإشارات التحذيرية لكل نوع</li>
                  <li>✓ الآن تقدر تحمي نفسك ومعارفك</li>
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
