'use client'

import { Card } from '@/components/ui/card'
import { AlertCircle, MessageCircle, Globe, Users } from 'lucide-react'

const threats = [
  {
    icon: MessageCircle,
    titleAr: 'SMS والرسائل المريبة',
    descriptionAr: 'رسائل نصية تدعي أنها من البنك أو شركات معروفة تطلب بيانات شخصية',
    color: 'text-warning',
    bgColor: 'bg-warning/10'
  },
  {
    icon: Globe,
    titleAr: 'المواقع الوهمية',
    descriptionAr: 'نسخ مزيفة من مواقع حقيقية مثل البنوك والمتاجر الإلكترونية',
    color: 'text-danger',
    bgColor: 'bg-danger/10'
  },
  {
    icon: Users,
    titleAr: 'حسابات وسائل التواصل',
    descriptionAr: 'اختراق حسابات فيسبوك والواتس آب والبريد الإلكتروني',
    color: 'text-primary',
    bgColor: 'bg-primary/10'
  },
  {
    icon: AlertCircle,
    titleAr: 'الأرقام الوهمية',
    descriptionAr: 'أشخاص ينتحلون شخصية شرطة أو بنوك أو شركات معروفة',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10'
  }
]

export function ThreatCards() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-3 text-foreground">
          الهجمات الشائعة اليوم
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
          تعرف على أكثر الطرق شيوعاً التي يستخدمها المحتالون
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {threats.map((threat) => {
            const Icon = threat.icon
            return (
              <Card
                key={threat.titleAr}
                className="p-6 hover:shadow-lg transition-shadow border-border"
              >
                <div className={`${threat.bgColor} w-16 h-16 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`w-8 h-8 ${threat.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {threat.titleAr}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {threat.descriptionAr}
                </p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
