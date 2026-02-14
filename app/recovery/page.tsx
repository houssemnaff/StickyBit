'use client'

import { useState } from 'react'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { recoverySteps } from '@/lib/data'
import { ChevronDown, Phone, Ban } from 'lucide-react'

export default function RecoveryPage() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              طحت في احتيال؟
            </h1>
            <p className="text-lg text-danger mb-4">
              شنوا تعمل توّا؟
            </p>
            <p className="text-muted-foreground">
              اتبع هذه الخطوات بسرعة لحماية حسابك والحد من الضرر
            </p>
          </div>

          {/* Warning */}
          <Card className="mb-8 p-6 bg-danger/10 border-danger/30">
            <p className="text-sm text-danger font-semibold">
              ⚠️ تصرف بسرعة! كل دقيقة مهمة في هذه الحالة
            </p>
          </Card>

          {/* Steps */}
          <div className="space-y-4 mb-12">
            {recoverySteps.map((step) => (
              <Card key={step.step} className="border-border overflow-hidden">
                <button
                  onClick={() => setExpandedStep(expandedStep === step.step ? null : step.step)}
                  className="w-full p-6 text-right flex items-center justify-between hover:bg-secondary/50 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-primary flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full">
                        {step.step}
                      </span>
                      <h3 className="text-lg font-bold text-foreground">
                        {step.titleAr}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{step.descriptionAr}</p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition ${
                      expandedStep === step.step ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedStep === step.step && (
                  <div className="px-6 pb-6 border-t border-border">
                    {/* Tips */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-foreground mb-3">النقاط المهمة:</h4>
                      <ul className="space-y-2">
                        {step.tips.map((tip, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex gap-3">
                            <span className="text-primary font-semibold flex-shrink-0">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    {(step.step === 1 || step.step === 2) && (
                      <div className="space-y-2">
                        {step.step === 1 && (
                          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-touch">
                            اذهب إلى إعدادات الأمان
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Emergency Contacts */}
          <Card className="p-8 bg-secondary/50 border-border mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              جهات الاتصال العاجلة
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div>
                  <p className="font-semibold text-foreground">البنك التونسي</p>
                  <p className="text-sm text-muted-foreground">للعمليات المالية</p>
                </div>
                <a href="tel:71961000">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    اتصل
                  </Button>
                </a>
              </div>

              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div>
                  <p className="font-semibold text-foreground">شرطة الإنترنت</p>
                  <p className="text-sm text-muted-foreground">لتقديم بلاغ رسمي</p>
                </div>
                <a href="tel:71562911">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    اتصل
                  </Button>
                </a>
              </div>

              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div>
                  <p className="font-semibold text-foreground">الرقم الأخضر</p>
                  <p className="text-sm text-muted-foreground">حالة طوارئ</p>
                </div>
                <a href="tel:17">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    اتصل
                  </Button>
                </a>
              </div>
            </div>
          </Card>

          {/* Report Scam */}
          <Card className="p-8 text-center bg-primary/10 border-primary/30">
            <p className="text-lg font-semibold text-foreground mb-4">
              ساعدنا في حماية المجتمع
            </p>
            <p className="text-muted-foreground mb-6">
              بلّغ عن هذا الاحتيال ليتمكن المستخدمون الآخرون من تجنبه
            </p>
            <a href="/report">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground h-touch font-semibold flex items-center justify-center gap-2">
                <span>🚨</span>
                بلّغ عن احتيال
              </Button>
            </a>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
