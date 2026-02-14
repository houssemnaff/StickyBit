'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, Gamepad2, BookOpen } from 'lucide-react'

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-primary/10 to-transparent py-12 md:py-20">
      <div className="container mx-auto px-4 text-center">
        {/* Main Slogan */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-foreground">
            خلّيك آمن على الإنترنت
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            اتعلم كيفاش تحمي نفسك من الاحتيالات الإلكترونية والتصيد الاحتيالي والأرقام الوهمية
          </p>
        </div>

        {/* Main CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
          {/* Check Link */}
          <Link href="/detector">
            <Button
              size="lg"
              className="w-full h-touch bg-primary hover:bg-primary/90 text-primary-foreground text-base md:text-lg font-semibold"
            >
              <Search className="w-5 h-5 me-2" />
              هل هذا آمن؟
            </Button>
          </Link>

          {/* Simulator */}
          <Link href="/simulator">
            <Button
              size="lg"
              variant="secondary"
              className="w-full h-touch text-base md:text-lg font-semibold"
            >
              <Gamepad2 className="w-5 h-5 me-2" />
              جرّب هجوم وهمي
            </Button>
          </Link>

          {/* Learn */}
          <Link href="/academy">
            <Button
              size="lg"
              variant="outline"
              className="w-full h-touch text-base md:text-lg font-semibold"
            >
              <BookOpen className="w-5 h-5 me-2" />
              تعلّم
            </Button>
          </Link>
        </div>

        {/* Secondary Actions */}
        <div className="flex flex-col md:flex-row justify-center gap-3 mb-8">
          <Link href="/assessment">
            <Button variant="outline" className="text-sm">
              اختبر أمانك الشخصي
            </Button>
          </Link>
          <Link href="/recovery">
            <Button variant="outline" className="text-sm">
              طحت في احتيال؟
            </Button>
          </Link>
          <Link href="/report">
            <Button variant="outline" className="text-sm">
              بلّغ عن احتيال
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
