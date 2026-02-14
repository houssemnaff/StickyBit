'use client'

import { useState, useMemo } from 'react'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { glossaryTerms } from '@/lib/data'
import { ChevronDown, Search } from 'lucide-react'

export default function GlossaryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedTerm, setExpandedTerm] = useState<number | null>(null)

  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter(
      (term) =>
        term.termAr.includes(searchTerm) ||
        term.termEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.includes(searchTerm)
    )
  }, [searchTerm])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              قاموس الأمان
            </h1>
            <p className="text-muted-foreground">
              شرح بسيط للمصطلحات الأمنية والتقنية
            </p>
          </div>

          {/* Search */}
          <div className="mb-8 relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="ابحث عن مصطلح..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ps-4 pr-12 h-touch text-base"
            />
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-6">
            {filteredTerms.length} من {glossaryTerms.length} مصطلح
          </p>

          {/* Terms */}
          {filteredTerms.length > 0 ? (
            <div className="space-y-3">
              {filteredTerms.map((term, index) => (
                <Card key={index} className="border-border overflow-hidden">
                  <button
                    onClick={() => setExpandedTerm(expandedTerm === index ? null : index)}
                    className="w-full p-6 text-right flex items-center justify-between hover:bg-secondary/50 transition"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground">
                        {term.termAr}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {term.termEn}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition ${
                        expandedTerm === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {expandedTerm === index && (
                    <div className="px-6 pb-6 border-t border-border space-y-4">
                      {/* Definition */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">التعريف</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {term.definition}
                        </p>
                      </div>

                      {/* Example */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">مثال تونسي</h4>
                        <div className="bg-muted p-4 rounded-lg text-sm text-foreground border border-border">
                          {term.example}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center bg-secondary/50 border-border">
              <p className="text-lg text-muted-foreground">
                لم يتم العثور على نتائج لـ "{searchTerm}"
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                جرّب البحث عن مصطلح آخر
              </p>
            </Card>
          )}

          {/* Tips */}
          <Card className="mt-12 p-8 bg-primary/10 border-primary/30">
            <h3 className="text-lg font-bold text-foreground mb-3">نصيحة</h3>
            <p className="text-sm text-muted-foreground">
              كلما فهمت المصطلحات الأمنية بشكل أفضل، كلما زادت حماية نفسك من الاحتيالات. لا تتردد في العودة إلى هذا القاموس عند مواجهة مصطلح جديد.
            </p>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
