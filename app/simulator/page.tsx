'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { scenarios } from '@/lib/data'
import { ScenarioCard } from '@/components/simulator/scenario-card'
import { ResultCard } from '@/components/simulator/result-card'
import { PointsToast } from '@/components/shared/points-toast'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { applyAccessibilityStyles } from '@/lib/accessibility'
import { addPoints, POINTS } from '@/lib/scoring'
import { ArrowRight } from 'lucide-react'

export default function SimulatorPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)
  const [showPointsToast, setShowPointsToast] = useState(false)
  const [lastPointsEarned, setLastPointsEarned] = useState(0)

  useEffect(() => {
    applyAccessibilityStyles()
  }, [])

  const currentScenario = scenarios[currentIndex]
  const isCorrect = userAnswer === currentScenario.safe

  const handleAnswer = (answer: boolean) => {
    setUserAnswer(answer)
    setShowResult(true)

    if (answer === currentScenario.safe) {
      setScore(score + POINTS.SCENARIO_CORRECT)
      setLastPointsEarned(POINTS.SCENARIO_CORRECT)
      addPoints(POINTS.SCENARIO_CORRECT)
    } else {
      setScore(score + POINTS.SCENARIO_INCORRECT)
      setLastPointsEarned(POINTS.SCENARIO_INCORRECT)
      addPoints(POINTS.SCENARIO_INCORRECT)
    }
    setShowPointsToast(true)
  }

  const handleNext = () => {
    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowResult(false)
      setUserAnswer(null)
      setCompletedCount(completedCount + 1)
    } else {
      // Quiz finished
      setCompletedCount(completedCount + 1)
    }
  }

  const resetSimulator = () => {
    setCurrentIndex(0)
    setShowResult(false)
    setUserAnswer(null)
    setScore(0)
    setCompletedCount(0)
  }

  const isFinished = currentIndex === scenarios.length - 1 && showResult

  return (
    <div className="flex flex-col min-h-screen">
      <PointsToast
        points={lastPointsEarned}
        show={showPointsToast}
        onClose={() => setShowPointsToast(false)}
      />
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              تجربة هجوم وهمي
            </h1>
            <p className="text-muted-foreground">
              اختبر معرفتك بالتعرف على الهجمات الإلكترونية والرسائل المريبة
            </p>
          </div>

          {/* Progress */}
          <Card className="mb-8 p-6 bg-secondary/50 border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">السيناريو</p>
                <p className="text-2xl font-bold text-foreground">
                  {currentIndex + 1} / {scenarios.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">النقاط المكتسبة</p>
                <p className="text-2xl font-bold text-primary">
                  {score}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / scenarios.length) * 100}%` }}
              />
            </div>
          </Card>

          {!isFinished ? (
            <>
              {!showResult ? (
                <ScenarioCard scenario={currentScenario} onAnswer={handleAnswer} />
              ) : (
                <div className="space-y-6">
                  <ResultCard
                    scenario={currentScenario}
                    isCorrect={isCorrect}
                    userAnswer={userAnswer!}
                  />

                  {currentIndex < scenarios.length - 1 && (
                    <Button
                      onClick={handleNext}
                      size="lg"
                      className="w-full h-touch bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold flex items-center justify-center gap-2"
                    >
                      سيناريو التالي
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <Card className="p-8 md:p-12 text-center bg-safe/10 border-safe/30">
              <div className="mb-6">
                <p className="text-5xl mb-4">🎉</p>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  أحسنت!
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  انتهيت من جميع السيناريوهات
                </p>
              </div>

              <div className="bg-background rounded-lg p-6 mb-8 border border-border">
                <p className="text-sm text-muted-foreground mb-2">إجمالي النقاط</p>
                <p className="text-5xl font-bold text-primary">{score}</p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={resetSimulator}
                  size="lg"
                  className="w-full h-touch bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold"
                >
                  جرّب مجدداً
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
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
