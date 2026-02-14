'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { attackerMethods, getMethodById } from '@/lib/attacker-methods'
import { applyAccessibilityStyles } from '@/lib/accessibility'
import Link from 'next/link'
import { ArrowRight, Shield, TrendingDown, CheckCircle } from 'lucide-react'

export default function MethodDetailPage({ params }: { params: { methodId: string } }) {
  const methodId = parseInt(params.methodId, 10)
  const method = getMethodById(methodId)
  const [activeTab, setActiveTab] = useState<'stages' | 'protection'>('stages')

  useEffect(() => {
    applyAccessibilityStyles()
  }, [])

  if (!method) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              لم نجد هذا النوع من الهجوم
            </h1>
            <Link href="/how-attackers-work">
              <Button className="bg-primary">العودة للقائمة</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const getColorClass = (color: string) => {
    switch (color) {
      case 'danger':
        return 'from-red-600 to-red-700'
      case 'warning':
        return 'from-orange-600 to-orange-700'
      case 'safe':
        return 'from-green-600 to-green-700'
      default:
        return 'from-blue-600 to-blue-700'
    }
  }

  const relatedMethods = attackerMethods.filter(m => m.id !== methodId).slice(0, 3)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link href="/how-attackers-work" className="mb-6 inline-block">
            <Button
              variant="outline"
              className="gap-2 border-primary text-primary hover:bg-primary/10"
            >
              <ArrowRight className="w-4 h-4" />
              العودة للقائمة
            </Button>
          </Link>

          {/* Hero Section */}
          <div
            className={`gradient bg-gradient-to-r ${getColorClass(method.color)} text-white rounded-lg p-8 md:p-12 mb-12`}
          >
            <div className="flex items-center gap-6 mb-6">
              <span className="text-6xl">{method.icon}</span>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{method.titleAr}</h1>
                <p className="text-lg opacity-90 mt-2">{method.titleFr}</p>
              </div>
            </div>
            <p className="text-lg max-w-2xl">
              تعرّف على كيفية تنفيذ هذا النوع من الهجمات وكيفية حماية نفسك منه
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('stages')}
              className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
                activeTab === 'stages'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-foreground border border-border hover:border-primary'
              }`}
            >
              <TrendingDown className="inline-block w-5 h-5 ml-2" />
              مراحل الهجوم
            </button>
            <button
              onClick={() => setActiveTab('protection')}
              className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
                activeTab === 'protection'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-foreground border border-border hover:border-primary'
              }`}
            >
              <Shield className="inline-block w-5 h-5 ml-2" />
              كيفية الحماية
            </button>
          </div>

          {/* Content */}
          {activeTab === 'stages' && (
            <div className="space-y-6 mb-12">
              {method.stages.map((stage, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-border">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-primary w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        {stage.stageNumber}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground">
                          {stage.stageName}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {stage.stageNameFr}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* How It Works */}
                    <div className="bg-muted/50 rounded-lg p-6">
                      <h4 className="font-bold text-foreground mb-3 text-lg flex items-center gap-2">
                        <span className="text-2xl">⚙️</span> كيف يعمل
                      </h4>
                      <p className="text-foreground whitespace-pre-line leading-relaxed">
                        {stage.howWorks}
                      </p>
                    </div>

                    {/* Example */}
                    <div className="bg-danger/10 border-l-4 border-danger rounded-lg p-6">
                      <h4 className="font-bold text-foreground mb-3 text-lg flex items-center gap-2">
                        <span className="text-2xl">🎯</span> مثال من الواقع
                      </h4>
                      <p className="text-foreground whitespace-pre-line leading-relaxed font-mono">
                        {stage.attackExampleAr}
                      </p>
                    </div>

                    {/* Data Stolen */}
                    <div>
                      <h4 className="font-bold text-foreground mb-4 text-lg flex items-center gap-2">
                        <span className="text-2xl">💾</span> البيانات التي تُسرق
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {stage.dataStolen.map((data, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 bg-danger/15 text-danger-foreground p-4 rounded-lg"
                          >
                            <span className="text-xl">🚨</span>
                            <span className="font-semibold">{data}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'protection' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {method.protectionSteps.map((step, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-t-4 border-safe">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl font-bold text-safe w-10 h-10 rounded-full bg-safe/20 flex items-center justify-center">
                      {index + 1}
                    </div>
                    <h4 className="font-bold text-foreground text-lg">{step.title}</h4>
                  </div>

                  <p className="text-sm text-foreground whitespace-pre-line leading-relaxed mb-6">
                    {step.description}
                  </p>

                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      أمثلة عملية
                    </p>
                    {step.examples.map((example, i) => (
                      <div
                        key={i}
                        className="bg-foreground/5 rounded p-3 text-xs text-foreground border-r-2 border-safe"
                      >
                        <p className="whitespace-pre-line font-mono">{example}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Summary Card */}
          <Card className="p-8 bg-gradient-to-r from-primary/10 to-safe/10 mb-12">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-8 h-8 text-safe flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">ملخص مهم</h3>
                <ul className="space-y-2 text-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    فهم طرق الهجوم هو أول خطوة للحماية
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    لا تتردد في الاتصال بالخدمات الرسمية للتحقق
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    الحذر والتفكير قبل النقر على الروابط ينقذك
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    أخبر أصدقائك وعائلتك بهذه الطرق
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Related Methods */}
          {relatedMethods.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                أنواع هجمات أخرى تستحق الاهتمام
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedMethods.map(related => (
                  <Link key={related.id} href={`/how-attackers-work/${related.id}`}>
                    <Card className="h-full p-6 hover:shadow-lg transition-shadow cursor-pointer hover:border-primary">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-4xl">{related.icon}</span>
                        <div>
                          <h3 className="font-bold text-foreground">{related.titleAr}</h3>
                          <p className="text-xs text-muted-foreground">{related.titleFr}</p>
                        </div>
                      </div>
                      <p className="text-sm text-foreground/80">
                        اكتشف {related.stages.length} مراحل من هذا النوع من الهجمات
                      </p>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
