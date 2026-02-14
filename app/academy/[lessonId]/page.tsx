'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { lessons } from '@/lib/data'
import { ArrowRight, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { completeLesson, addPoints, POINTS, checkBadges, getUserProgress, saveUserProgress } from '@/lib/scoring'
import { useRouter } from 'next/navigation'

interface PageProps {
  params: Promise<{ lessonId: string }>
}

export default function LessonPage({ params }: PageProps) {
  const [lessonId, setLessonId] = useState<number | null>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([])
  const [quizComplete, setQuizComplete] = useState(false)
  const [newBadges, setNewBadges] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    params.then((p) => {
      const id = parseInt(p.lessonId, 10)
      setLessonId(id)
      setQuizAnswers(new Array(lessons[id - 1]?.quiz?.length || 0).fill(null))
    })
  }, [params])

  if (!lessonId) return null

  const lesson = lessons[lessonId - 1]
  if (!lesson) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">الدرس غير موجود</p>
            <Link href="/academy">
              <Button className="mt-4">العودة إلى الأكاديمية</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleCompleteLesson = () => {
    // Award lesson-specific points from lesson data
    const lessonPoints = (lesson as any).points || POINTS.LESSON_COMPLETED
    const progress = completeLesson(lesson.id, lessonPoints)
    const badges = checkBadges(progress)
    if (badges.length > 0) {
      const newProgress = getUserProgress()
      newProgress.badges = [...new Set([...newProgress.badges, ...badges])]
      saveUserProgress(newProgress)
      setNewBadges(badges)
    }
    setTimeout(() => {
      router.push('/academy')
    }, 2000)
  }

  const handleAnswerQuestion = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers]
    newAnswers[questionIndex] = answerIndex
    setQuizAnswers(newAnswers)
  }

  const handleSubmitQuiz = () => {
    const allAnswered = quizAnswers.every((answer) => answer !== null)
    if (allAnswered) {
      setQuizComplete(true)
      addPoints(POINTS.QUIZ_PASSED)
    }
  }

  const correctAnswers = quizAnswers.reduce((sum, answer, index) => {
    if (answer === lesson.quiz[index]?.correct) {
      return sum + 1
    }
    return sum
  }, 0)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <Link href="/academy">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowRight className="w-4 h-4 me-2" />
                العودة إلى الأكاديمية
              </Button>
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {lesson.titleAr}
            </h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {lesson.durationMinutes} دقائق
              </div>
            </div>
          </div>

          {/* Progress */}
          <Card className="mb-8 p-4 bg-secondary/50 border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {showQuiz
                  ? `السؤال ${currentSection + 1} من ${lesson.quiz.length}`
                  : `القسم ${currentSection + 1} من ${lesson.sections.length}`}
              </span>
              <div className="flex gap-1">
                {Array.from({
                  length: showQuiz ? lesson.quiz.length : lesson.sections.length
                }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full ${
                      i <= currentSection ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </Card>

          {/* Content */}
          {!showQuiz && !quizComplete && (
            <div>
              {lesson.sections.map((section, index) => (
                <Card key={index} className={`p-8 mb-8 border-border ${index !== currentSection ? 'hidden' : ''}`}>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    {section.title}
                  </h2>
                  <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                    {section.content}
                  </div>
                </Card>
              ))}

              {/* Navigation */}
              <div className="flex gap-3 mb-8">
                {currentSection > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentSection(currentSection - 1)}
                    className="flex-1 h-touch"
                  >
                    الرجوع
                  </Button>
                )}

                {currentSection < lesson.sections.length - 1 ? (
                  <Button
                    onClick={() => setCurrentSection(currentSection + 1)}
                    className="flex-1 h-touch bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  >
                    التالي
                    <ArrowRight className="w-4 h-4 ms-2" />
                  </Button>
                ) : lesson.quiz.length > 0 ? (
                  <Button
                    onClick={() => {
                      setShowQuiz(true)
                      setCurrentSection(0)
                    }}
                    className="flex-1 h-touch bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  >
                    اختبر معرفتك
                    <CheckCircle className="w-4 h-4 ms-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleCompleteLesson}
                    className="flex-1 h-touch bg-safe hover:bg-safe/90 text-white font-semibold"
                  >
                    أكمل الدرس
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Quiz */}
          {showQuiz && !quizComplete && (
            <div>
              {lesson.quiz.map((question, index) => (
                <Card key={index} className={`p-8 mb-8 border-border ${index !== currentSection ? 'hidden' : ''}`}>
                  <h3 className="text-lg font-bold text-foreground mb-6">
                    {question.question}
                  </h3>

                  <div className="space-y-3 mb-8">
                    {question.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() => handleAnswerQuestion(index, optionIndex)}
                        className={`w-full p-4 text-right rounded-lg border-2 transition-colors ${
                          quizAnswers[index] === optionIndex
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              quizAnswers[index] === optionIndex
                                ? 'border-primary bg-primary'
                                : 'border-border'
                            }`}
                          >
                            {quizAnswers[index] === optionIndex && (
                              <span className="text-white text-xs">✓</span>
                            )}
                          </div>
                          <span className="text-foreground">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
              ))}

              {/* Quiz Navigation */}
              <div className="flex gap-3 mb-8">
                {currentSection > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentSection(currentSection - 1)}
                    className="flex-1 h-touch"
                  >
                    السؤال السابق
                  </Button>
                )}

                {currentSection < lesson.quiz.length - 1 ? (
                  <Button
                    onClick={() => setCurrentSection(currentSection + 1)}
                    className="flex-1 h-touch bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  >
                    السؤال التالي
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmitQuiz}
                    disabled={quizAnswers.some((a) => a === null)}
                    className="flex-1 h-touch bg-safe hover:bg-safe/90 text-white font-semibold disabled:opacity-50"
                  >
                    إرسال
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Quiz Complete */}
          {quizComplete && (
            <Card className="p-8 md:p-12 text-center bg-safe/10 border-safe/30">
              <div className="mb-6">
                <p className="text-5xl mb-4">🎉</p>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  أحسنت!
                </h2>
                <p className="text-lg text-muted-foreground">
                  لقد أكملت هذا الدرس بنجاح
                </p>
              </div>

              <div className="bg-background rounded-lg p-6 mb-8 border border-border">
                <p className="text-sm text-muted-foreground mb-2">نتيجة الاختبار</p>
                <p className="text-4xl font-bold text-primary">
                  {correctAnswers} / {lesson.quiz.length}
                </p>
              </div>

              {newBadges.length > 0 && (
                <div className="bg-warning/10 rounded-lg p-6 mb-8 border border-warning/30">
                  <p className="text-sm text-warning font-semibold mb-2">شارة جديدة!</p>
                  <p className="text-lg font-bold text-foreground">
                    {newBadges.length > 0 ? 'لقد ربحت شارة جديدة!' : ''}
                  </p>
                </div>
              )}

              <Button
                onClick={() => router.push('/academy')}
                size="lg"
                className="w-full h-touch bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold"
              >
                العودة إلى الأكاديمية
              </Button>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
