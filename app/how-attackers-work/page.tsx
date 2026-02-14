'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { attackerMethods } from '@/lib/attacker-methods'
import { applyAccessibilityStyles } from '@/lib/accessibility'
import { ChevronRight, Shield } from 'lucide-react'

export default function HowAttackersWorkPage() {
  const [selectedMethod, setSelectedMethod] = useState(0)
  const [expandedStage, setExpandedStage] = useState<number | null>(null)

  useEffect(() => {
    applyAccessibilityStyles()
  }, [])

  const currentMethod = attackerMethods[selectedMethod]

  const getColorClass = (color: string) => {
    switch (color) {
      case 'danger':
        return 'border-l-4 border-danger bg-red-50 dark:bg-red-950'
      case 'warning':
        return 'border-l-4 border-warning bg-orange-50 dark:bg-orange-950'
      case 'safe':
        return 'border-l-4 border-safe bg-green-50 dark:bg-green-950'
      default:
        return 'border-l-4 border-primary'
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Page Title */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              كيف يسرق المهاجمون بيانات الناس؟ 🔍
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              تعرّف على تقنيات الهجوم الحقيقية وكيفية حماية نفسك من كل نوع من الهجمات
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
            {/* Methods List */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <h2 className="text-lg font-bold mb-4 text-foreground">أنواع الهجمات</h2>
                <div className="space-y-2">
                  {attackerMethods.map((method, index) => (
                    <button
                      key={method.id}
                      onClick={() => {
                        setSelectedMethod(index)
                        setExpandedStage(null)
                      }}
                      className={`w-full text-right p-4 rounded-lg transition-all border-2 ${
                        selectedMethod === index
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card text-foreground border-border hover:border-primary'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{method.icon}</span>
                        <div className="text-sm">
                          <p className="font-semibold">{method.titleAr}</p>
                          <p className="opacity-75">{method.titleFr}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Method Details */}
            <div className="lg:col-span-3">
              {/* Method Header */}
              <div className={`p-6 rounded-lg mb-8 ${getColorClass(currentMethod.color)}`}>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{currentMethod.icon}</span>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">{currentMethod.titleAr}</h2>
                    <p className="text-sm opacity-75">{currentMethod.titleFr}</p>
                  </div>
                </div>
              </div>

              {/* Attack Stages */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6 text-foreground">مراحل الهجوم</h3>
                <div className="space-y-4">
                  {currentMethod.stages.map((stage, index) => (
                    <Card key={index} className="overflow-hidden">
                      <button
                        onClick={() =>
                          setExpandedStage(expandedStage === index ? null : index)
                        }
                        className="w-full p-6 text-right hover:bg-muted transition-colors flex items-center justify-between gap-4"
                      >
                        <ChevronRight
                          className={`w-5 h-5 transition-transform flex-shrink-0 ${
                            expandedStage === index ? 'rotate-90' : ''
                          }`}
                        />
                        <div className="text-right flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-lg font-bold text-primary">
                              المرحلة {stage.stageNumber}
                            </span>
                            <span className="text-lg font-semibold text-foreground">
                              {stage.stageName}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {stage.stageNameFr}
                          </p>
                        </div>
                      </button>

                      {/* Expanded Content */}
                      {expandedStage === index && (
                        <div className="border-t border-border bg-muted p-6 space-y-6">
                          {/* How It Works */}
                          <div>
                            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                              <span className="text-warning">⚠️</span> كيف يعمل الهجوم
                            </h4>
                            <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                              {stage.howWorks}
                            </p>
                          </div>

                          {/* Example Attack */}
                          <div>
                            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                              <span className="text-danger">🎯</span> مثال حقيقي
                            </h4>
                            <div className="bg-danger/10 border border-danger/20 rounded p-4">
                              <p className="text-sm text-foreground whitespace-pre-line">
                                {stage.attackExampleAr}
                              </p>
                            </div>
                          </div>

                          {/* Data Stolen */}
                          <div>
                            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                              <span className="text-danger">💾</span> البيانات المسروقة
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {stage.dataStolen.map((data, i) => (
                                <div
                                  key={i}
                                  className="bg-danger/20 text-danger-foreground text-sm p-2 rounded text-center font-semibold"
                                >
                                  {data}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>

              {/* Protection Steps */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
                  <Shield className="w-7 h-7 text-safe" />
                  كيف تحمي نفسك
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentMethod.protectionSteps.map((step, index) => (
                    <Card key={index} className="p-6 bg-safe/5 border border-safe/20 hover:border-safe/40 transition-colors">
                      <h4 className="font-bold text-foreground mb-3 text-lg">
                        {index + 1}. {step.title}
                      </h4>
                      <p className="text-sm text-foreground whitespace-pre-line leading-relaxed mb-4">
                        {step.description}
                      </p>
                      <div className="space-y-2">
                        {step.examples.map((example, i) => (
                          <div
                            key={i}
                            className="bg-foreground/5 rounded p-3 text-xs text-foreground font-mono border-l-2 border-safe"
                          >
                            {example}
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-12 p-8 bg-primary/10 border-2 border-primary rounded-lg text-center">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  هل عانيت من هجوم؟ نحن هنا لمساعدتك
                </h3>
                <p className="text-foreground mb-6 max-w-xl mx-auto">
                  إذا اعتقدت أنك تعرضت لهجوم أو سرقة بيانات، اذهب إلى قسم دليل التعافي أو تواصل مع السلطات المختصة
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <Button className="bg-primary text-primary-foreground hover:opacity-90 touch:min-h-touch">
                    دليل التعافي من الهجوم
                  </Button>
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10 touch:min-h-touch"
                  >
                    الاتصال بالدعم
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
