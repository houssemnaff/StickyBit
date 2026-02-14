'use client'

import { useState } from 'react'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { lessons } from '@/lib/data'
import { Clock, Zap, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { getUserProgress } from '@/lib/scoring'

export default function AcademyPage() {
  const [completed, setCompleted] = useState<number[]>(() => {
    const progress = getUserProgress()
    return progress.lessonsCompleted
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-safe/10 text-safe'
      case 'intermediate':
        return 'bg-warning/10 text-warning'
      default:
        return 'bg-primary/10 text-primary'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'مبتدئ'
      case 'intermediate':
        return 'متوسط'
      default:
        return 'متقدم'
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              تعلّم تحمي روحك
            </h1>
            <p className="text-muted-foreground">
              دروس بسيطة وسهلة الفهم لحماية نفسك من الاحتيالات
            </p>
          </div>

          {/* Progress Summary */}
          <Card className="mb-8 p-6 bg-secondary/50 border-border">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">الدروس المكتملة</p>
                <p className="text-2xl font-bold text-primary">{completed.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الدروس المتبقية</p>
                <p className="text-2xl font-bold text-foreground">{lessons.length - completed.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">النسبة المئوية</p>
                <p className="text-2xl font-bold text-safe">
                  {Math.round((completed.length / lessons.length) * 100)}%
                </p>
              </div>
            </div>
          </Card>

          {/* Lessons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lessons.map((lesson) => {
              const isCompleted = completed.includes(lesson.id)

              return (
                <Card key={lesson.id} className="p-6 hover:shadow-lg transition-shadow border-border flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {lesson.titleAr}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {lesson.descriptionAr}
                      </p>
                    </div>
                    {isCompleted && (
                      <CheckCircle className="w-6 h-6 text-safe flex-shrink-0" />
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      <Clock className="w-4 h-4" />
                      {lesson.durationMinutes} دقائق
                    </div>
                    <div className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full ${getDifficultyColor(lesson.difficulty)}`}>
                      <Zap className="w-4 h-4" />
                      {getDifficultyLabel(lesson.difficulty)}
                    </div>
                  </div>

                  {/* Button */}
                  <Link href={`/academy/${lesson.id}`} className="mt-auto">
                    <Button
                      className="w-full h-touch bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                      disabled={isCompleted}
                    >
                      {isCompleted ? '✓ مكتملة' : 'ابدأ الدرس'}
                    </Button>
                  </Link>
                </Card>
              )
            })}
          </div>

          {/* CTA */}
          {completed.length === 0 && (
            <Card className="mt-12 p-8 text-center bg-primary/10 border-primary/30">
              <p className="text-lg text-muted-foreground mb-4">
                ابدأ رحلة تعلمك الآن
              </p>
              <Link href={`/academy/${lessons[0].id}`}>
                <Button size="lg" className="h-touch bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold">
                  ابدأ الدرس الأول
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
