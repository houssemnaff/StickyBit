'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getUserProgress, BADGES, getPointsToNextLevel } from '@/lib/scoring'
import { Zap, Award, Flame, TrendingUp, RotateCcw } from 'lucide-react'
import Link from 'next/link'

interface UserProgress {
  points: number
  level: number
  lessonsCompleted: number[]
  quizzesPassed: number[]
  badges: string[]
  lastActivityDate?: Date
}

export default function ProfilePage() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [showAllBadges, setShowAllBadges] = useState(false)

  useEffect(() => {
    const savedProgress = getUserProgress()
    setProgress(savedProgress)
  }, [])

  if (!progress) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>جاري التحميل...</p>
        </main>
        <Footer />
      </div>
    )
  }

  const pointsToNextLevel = getPointsToNextLevel(progress.points)
  const allBadges = Object.values(BADGES)
  const earnedBadges = allBadges.filter((b) => progress.badges.includes(b.id))
  const lockedBadges = allBadges.filter((b) => !progress.badges.includes(b.id))

  const dailyActivities = [
    { name: 'أكمل درس', completed: progress.lessonsCompleted.length > 0, points: 50 },
    { name: 'خذ اختبار', completed: progress.quizzesPassed.length > 0, points: 25 },
    { name: 'جرّب السيناريو', completed: true, points: 10 },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              ملفي الشخصي
            </h1>
            <p className="text-muted-foreground">
              تابع تقدمك وإنجازاتك في رحلة الأمان الرقمي
            </p>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Level Card */}
            <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">المستوى</h3>
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <p className="text-4xl font-bold text-primary">{progress.level}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {pointsToNextLevel > 0 ? `${pointsToNextLevel} نقطة لالمستوى التالي` : 'الحد الأقصى'}
              </p>
            </Card>

            {/* Points Card */}
            <Card className="p-6 bg-gradient-to-br from-secondary/20 to-secondary/10 border-secondary/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">النقاط</h3>
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-4xl font-bold text-secondary">{progress.points}</p>
              <p className="text-xs text-muted-foreground mt-2">
                نقاط مكتسبة إجمالاً
              </p>
            </Card>

            {/* Streak Card */}
            <Card className="p-6 bg-gradient-to-br from-warning/20 to-warning/10 border-warning/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">الدروس</h3>
                <Flame className="w-5 h-5 text-warning" />
              </div>
              <p className="text-4xl font-bold text-warning">{progress.lessonsCompleted.length}</p>
              <p className="text-xs text-muted-foreground mt-2">
                درس مكتمل
              </p>
            </Card>
          </div>

          {/* Progress Bar */}
          <Card className="p-6 mb-8 bg-secondary/50 border-border">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-foreground">التقدم نحو المستوى {progress.level + 1}</p>
              <p className="text-sm font-semibold text-foreground">
                {progress.points} / {progress.points + pointsToNextLevel}
              </p>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300 rounded-full"
                style={{
                  width: pointsToNextLevel > 0
                    ? `${(progress.points / (progress.points + pointsToNextLevel)) * 100}%`
                    : '100%'
                }}
              />
            </div>
          </Card>

          {/* Badges Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-warning" />
              الشارات ({earnedBadges.length} / {allBadges.length})
            </h2>

            {/* Earned Badges */}
            {earnedBadges.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-foreground mb-3">الشارات المكتسبة</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {earnedBadges.map((badge) => (
                    <Card key={badge.id} className="p-6 text-center border-safe/50 bg-safe/5 hover:shadow-md transition">
                      <div className="text-5xl mb-2">{badge.icon}</div>
                      <h4 className="font-semibold text-foreground text-sm mb-1">{badge.nameAr}</h4>
                      <p className="text-xs text-muted-foreground">{badge.descriptionAr}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Locked Badges */}
            {lockedBadges.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">الشارات المتاحة</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(showAllBadges ? lockedBadges : lockedBadges.slice(0, 4)).map((badge) => (
                    <Card key={badge.id} className="p-6 text-center border-muted bg-muted/30 opacity-60 hover:opacity-80 transition">
                      <div className="text-5xl mb-2 grayscale">🔒</div>
                      <h4 className="font-semibold text-foreground text-sm mb-1">{badge.nameAr}</h4>
                      <p className="text-xs text-muted-foreground">{badge.descriptionAr}</p>
                    </Card>
                  ))}
                </div>

                {!showAllBadges && lockedBadges.length > 4 && (
                  <Button
                    variant="outline"
                    onClick={() => setShowAllBadges(true)}
                    className="w-full mt-4 h-touch"
                  >
                    عرض المزيد من الشارات
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Daily Challenges */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">التحديات اليومية</h2>
            <div className="space-y-3">
              {dailyActivities.map((activity, index) => (
                <Card key={index} className="p-4 flex items-center justify-between border-border">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        activity.completed
                          ? 'bg-safe border-safe'
                          : 'border-muted'
                      }`}
                    >
                      {activity.completed && <span className="text-white text-xs">✓</span>}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{activity.name}</p>
                      <p className="text-xs text-muted-foreground">+{activity.points} نقطة</p>
                    </div>
                  </div>
                  {activity.completed && <span className="text-xs font-semibold text-safe">مكتملة</span>}
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link href="/academy">
              <Button variant="outline" className="w-full h-touch">
                اذهب إلى الأكاديمية
              </Button>
            </Link>
            <Link href="/simulator">
              <Button variant="outline" className="w-full h-touch">
                جرّب السيناريو
              </Button>
            </Link>
            <Link href="/assessment">
              <Button variant="outline" className="w-full h-touch">
                اختبر أمانك
              </Button>
            </Link>
          </div>

          {/* Reset Progress */}
          <Card className="p-6 bg-danger/5 border-danger/30 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              هل تريد إعادة تعيين جميع التقدم والإحصائيات؟
            </p>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center justify-center gap-2 mx-auto"
              onClick={() => {
                if (confirm('هل أنت متأكد؟ لن يمكن التراجع عن هذا.')) {
                  localStorage.removeItem('cyberaman_progress')
                  window.location.reload()
                }
              }}
            >
              <RotateCcw className="w-4 h-4" />
              إعادة تعيين
            </Button>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
