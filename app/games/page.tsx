'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { applyAccessibilityStyles } from '@/lib/accessibility'
import { Gamepad2, MessageSquareWarning, Shield, Link as LinkIcon, Star, Zap } from 'lucide-react'
import Link from 'next/link'

export default function GamesPage() {
  useEffect(() => {
    applyAccessibilityStyles()
  }, [])

  const games = [
    {
      id: 'phish-or-safe',
      titleAr: 'هل هذا احتيال ولا آمن؟',
      descriptionAr: 'اختبر معك 10 رسائل حقيقية من SMS و email و WhatsApp. اختار إذا الرسالة احتيال ولا آمنة.',
      icon: MessageSquareWarning,
      color: 'from-red-500 to-orange-500',
      scenarios: 10,
      points: 250,
      tags: ['SMS', 'Email', 'WhatsApp'],
    },
    {
      id: 'otp-defense',
      titleAr: 'دفاعك عن الـ OTP',
      descriptionAr: 'تعلم كيفاش تحمي نفسك من محاولات سرقة الـ OTP. اختار الرد الصحيح على كل محاولة احتيال.',
      icon: Shield,
      color: 'from-blue-500 to-cyan-500',
      scenarios: 10,
      points: 300,
      tags: ['OTP', 'Banking', 'Security'],
    },
    {
      id: 'url-spotter',
      titleAr: 'اصطياد الروابط المريبة',
      descriptionAr: 'تعرف على الروابط المزيفة والمريبة. اختار الرابط الآمن من بين خيارات مريبة.',
      icon: LinkIcon,
      color: 'from-green-500 to-teal-500',
      scenarios: 10,
      points: 250,
      tags: ['URLs', 'Phishing', 'Detection'],
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Gamepad2 className="w-10 h-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                ألعاب الأمان الرقمي
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              تعلم الأمان الرقمي من خلال ألعاب تفاعلية ممتعة. كل لعبة لها 10 سيناريوهات واقعية وتفاعلية.
            </p>
          </div>

          {/* Games Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {games.map((game) => {
              const IconComponent = game.icon
              return (
                <Card
                  key={game.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                >
                  {/* Color Header */}
                  <div
                    className={`h-24 bg-gradient-to-r ${game.color} flex items-end justify-start p-6`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {game.titleAr}
                    </h2>
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed flex-1">
                      {game.descriptionAr}
                    </p>

                    {/* Stats */}
                    <div className="bg-muted rounded-lg p-3 mb-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-foreground">
                          {game.scenarios} سيناريو واقعي
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-foreground">
                          حتى {game.points} نقطة
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {game.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Link href={`/games/${game.id}`} className="w-full">
                      <Button className="w-full">
                        ابدأ اللعبة الآن
                      </Button>
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Info Section */}
          <Card className="p-8 mb-8 bg-primary/5 border-primary/20">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              📚 كيفاش الألعاب تساعدك؟
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-3">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  تعليم عملي
                </h3>
                <p className="text-muted-foreground text-sm">
                  تعلم من خلال سيناريوهات واقعية تونسية تحاكي الهجمات الحقيقية
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-3">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  تغذية راجعة فورية
                </h3>
                <p className="text-muted-foreground text-sm">
                  تحصل على تفسير مباشر لكل جواب خاطئ وتفهم الأخطار
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-3">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  نقاط وإنجازات
                </h3>
                <p className="text-muted-foreground text-sm">
                  اجمع نقاط وفتح badges جديدة وقيس تقدمك
                </p>
              </div>
            </div>
          </Card>

          {/* Learning Path */}
          <Card className="p-8 bg-accent/5 border-accent/20">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              🎯 المسار التعليمي الموصى به
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-4 p-3 bg-background rounded-lg border border-border">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    ابدأ بـ "هل هذا احتيال ولا آمن؟"
                  </p>
                  <p className="text-sm text-muted-foreground">
                    تعلم الإشارات التحذيرية الأساسية للرسائل المريبة
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 bg-background rounded-lg border border-border">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    ثم انتقل إلى "دفاعك عن الـ OTP"
                  </p>
                  <p className="text-sm text-muted-foreground">
                    تعلم كيفاش تحمي نفسك من محاولات سرقة الكود
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 bg-background rounded-lg border border-border">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    أخيرا "اصطياد الروابط المريبة"
                  </p>
                  <p className="text-sm text-muted-foreground">
                    احترف الكشف عن الروابط المزيفة والمريبة
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
