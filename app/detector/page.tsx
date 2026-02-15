'use client'

import { useState, useRef } from 'react'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertTriangle, CheckCircle, Info, Upload, X, Link2, Shield } from 'lucide-react'

type RiskLevel = null | 'safe' | 'suspicious' | 'danger'

const mockAnalyses = [
  {
    keyword: 'تأكيد الهوية',
    risk: 'danger',
    message: 'كلمات شائعة في رسائل التصيد الاحتيالي'
  },
  {
    keyword: 'انقر هنا',
    risk: 'suspicious',
    message: 'رسائل مريبة تحتوي على روابط غير متوقعة'
  },
  {
    keyword: 'bit.ly',
    risk: 'danger',
    message: 'روابط مختصرة مريبة - قد تخفي عنوان الموقع الحقيقي'
  },
  {
    keyword: 'فعّل حسابك',
    risk: 'danger',
    message: 'طلب تفعيل أو تأكيد - علامة تصيد'
  },
  {
    keyword: 'عاجل',
    risk: 'suspicious',
    message: 'إنشاء جو من الضغط والاستعجالية'
  },
  {
    keyword: 'جائزة',
    risk: 'danger',
    message: 'وعود بجوائز مجانية - احتيال شائع'
  },
  {
    keyword: 'ربحت',
    risk: 'danger',
    message: 'وعود بجوائز مجانية - احتيال شائع'
  },
  {
    keyword: 'مبروك',
    risk: 'suspicious',
    message: 'قد تكون رسالة تصيد احتيالي'
  },
  {
    keyword: 'فزت',
    risk: 'danger',
    message: 'وعود بجوائز مجانية - احتيال شائع'
  },
  {
    keyword: 'فوراً',
    risk: 'suspicious',
    message: 'يستعمل أسلوب الاستعجال للضغط'
  },
  {
    keyword: 'آخر فرصة',
    risk: 'suspicious',
    message: 'يستعمل أسلوب الاستعجال للضغط'
  },
  {
    keyword: 'سارع',
    risk: 'suspicious',
    message: 'يستعمل أسلوب الاستعجال للضغط'
  },
  {
    keyword: 'كلمة السر',
    risk: 'danger',
    message: 'يطلب معلومات حساسة'
  },
  {
    keyword: 'رمز التحقق',
    risk: 'danger',
    message: 'يطلب معلومات حساسة'
  },
  {
    keyword: 'OTP',
    risk: 'danger',
    message: 'يطلب رمز التحقق - معلومات حساسة'
  },
  {
    keyword: 'كود',
    risk: 'suspicious',
    message: 'قد يطلب معلومات حساسة'
  },
  {
    keyword: 'بطاقة',
    risk: 'danger',
    message: 'يطلب معلومات بطاقة بنكية'
  },
  {
    keyword: 'حساب بنكي',
    risk: 'danger',
    message: 'يطلب معلومات حساب بنكي'
  },
  {
    keyword: 'poste',
    risk: 'suspicious',
    message: 'ينتحل صفة مؤسسة رسمية'
  },
  {
    keyword: 'بريد',
    risk: 'suspicious',
    message: 'قد ينتحل صفة مؤسسة بريدية'
  },
  {
    keyword: 'بنك',
    risk: 'suspicious',
    message: 'قد ينتحل صفة بنك'
  },
  {
    keyword: 'steg',
    risk: 'suspicious',
    message: 'قد ينتحل صفة مؤسسة رسمية'
  },
  {
    keyword: 'tunisie telecom',
    risk: 'suspicious',
    message: 'قد ينتحل صفة مؤسسة اتصالات'
  },
  {
    keyword: 'دينار',
    risk: 'suspicious',
    message: 'يتضمن طلب مالي'
  },
  {
    keyword: 'TND',
    risk: 'suspicious',
    message: 'يتضمن طلب مالي'
  },
  {
    keyword: 'دفع',
    risk: 'suspicious',
    message: 'يتضمن طلب دفع'
  },
  {
    keyword: 'تحويل',
    risk: 'suspicious',
    message: 'يتضمن طلب تحويل مالي'
  },
  {
    keyword: 'tinyurl',
    risk: 'danger',
    message: 'رابط مختصر مريب'
  },
  {
    keyword: 'short',
    risk: 'suspicious',
    message: 'رابط مختصر قد يخفي الوجهة'
  }
]

export default function DetectorPage() {
  const [textInput, setTextInput] = useState('')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [result, setResult] = useState<{
    risk: RiskLevel
    riskScore: number
    findings: { keyword: string; risk: string; message: string }[]
    virusTotalData?: {
      malicious: number
      suspicious: number
      harmless: number
      undetected: number
      total: number
    }
  } | null>(null)
  const [isAnalyzingText, setIsAnalyzingText] = useState(false)
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Extract URLs from text
  const extractUrls = (text: string): string[] => {
    const urlRegex = /https?:\/\/[^\s]+/gi
    return text.match(urlRegex) || []
  }

  // Analyze URL with VirusTotal API
  const analyzeUrlWithVirusTotal = async (url: string) => {
    try {
      const response = await fetch('/api/virustotal/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze URL')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('VirusTotal URL analysis error:', error)
      return null
    }
  }

  // Analyze file with VirusTotal API
  const analyzeFileWithVirusTotal = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/virustotal/file', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to analyze file')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('VirusTotal file analysis error:', error)
      return null
    }
  }

  const analyzeContent = async (textToAnalyze: string) => {
    if (!textToAnalyze.trim()) return

    setIsAnalyzingText(true)

    let risk: RiskLevel = 'safe'
    let riskScore = 0
    const findings: { keyword: string; risk: string; message: string }[] = []
    let virusTotalData = undefined

    const inputLower = textToAnalyze.toLowerCase()

    // Extract and analyze URLs with VirusTotal
    const urls = extractUrls(textToAnalyze)
    if (urls.length > 0) {
      const vtResult = await analyzeUrlWithVirusTotal(urls[0])
      
      if (vtResult && vtResult.data) {
        const stats = vtResult.data.attributes.last_analysis_stats
        virusTotalData = {
          malicious: stats.malicious || 0,
          suspicious: stats.suspicious || 0,
          harmless: stats.harmless || 0,
          undetected: stats.undetected || 0,
          total: stats.malicious + stats.suspicious + stats.harmless + stats.undetected
        }

        if (stats.malicious > 0) {
          riskScore += 40
          findings.push({
            keyword: 'VirusTotal: رابط خطير',
            risk: 'danger',
            message: `${stats.malicious} محرك مكافحة فيروسات اكتشف تهديداً في هذا الرابط`
          })
        } else if (stats.suspicious > 0) {
          riskScore += 25
          findings.push({
            keyword: 'VirusTotal: رابط مشبوه',
            risk: 'suspicious',
            message: `${stats.suspicious} محرك اعتبر الرابط مشبوهاً`
          })
        } else if (stats.harmless > 5) {
          findings.push({
            keyword: 'VirusTotal: رابط نظيف',
            risk: 'safe',
            message: `${stats.harmless} محرك أكد أن الرابط آمن`
          })
        }
      }
    }

    // Check for non-.tn domains
    for (const url of urls) {
      if (!/\.(tn|gov\.tn|com\.tn)($|\/)/i.test(url)) {
        riskScore += 20
        findings.push({
          keyword: 'رابط خارجي',
          risk: 'suspicious',
          message: 'الرابط لا ينتمي للموقع الرسمي (.tn أو .gov.tn)'
        })
      }
    }

    // Check against keyword database
    mockAnalyses.forEach((analysis) => {
      if (inputLower.includes(analysis.keyword.toLowerCase())) {
        findings.push(analysis)
        if (analysis.risk === 'danger') riskScore += 30
        else if (analysis.risk === 'suspicious') riskScore += 15
      }
    })

    // Determine risk level
    if (riskScore >= 60) risk = 'danger'
    else if (riskScore >= 30) risk = 'suspicious'
    else risk = 'safe'

    setResult({
      risk,
      riskScore: Math.min(riskScore, 100),
      findings,
      virusTotalData
    })
    setIsAnalyzingText(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const imageUrl = event.target?.result as string
      setUploadedImage(imageUrl)
      setUploadedFile(file)
      
      setIsAnalyzingImage(true)
      
      // Analyze file with VirusTotal
      const vtResult = await analyzeFileWithVirusTotal(file)
      
      // Simulate OCR extraction (integrate real OCR in production)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Mock extracted text
      const mockExtractedText = `
        عاجل! فزت بجائزة 1000 دينار
        للحصول على الجائزة انقر على الرابط:
        https://bit.ly/fake-link
        أدخل رمز التحقق OTP وكلمة السر
      `
      
      setIsAnalyzingImage(false)
      
      // Analyze extracted text
      await analyzeContent(mockExtractedText)
      
      // Add VirusTotal results if available
      if (vtResult && vtResult.data) {
        const stats = vtResult.data.attributes.last_analysis_stats
        const virusTotalData = {
          malicious: stats.malicious || 0,
          suspicious: stats.suspicious || 0,
          harmless: stats.harmless || 0,
          undetected: stats.undetected || 0,
          total: stats.malicious + stats.suspicious + stats.harmless + stats.undetected
        }

        setResult(prev => prev ? {
          ...prev,
          virusTotalData,
          riskScore: Math.min((prev.riskScore || 0) + (stats.malicious * 10), 100)
        } : null)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const fakeEvent = {
        target: {
          files: [file]
        }
      } as any
      handleImageUpload(fakeEvent)
    }
  }

  const removeImage = () => {
    setUploadedImage(null)
    setUploadedFile(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'rgb(239, 68, 68)'
    if (score >= 40) return 'rgb(245, 158, 11)'
    return 'rgb(16, 185, 129)'
  }

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'تهديد مرتفع: محاولة احتيال مالي'
    if (score >= 40) return 'مشبوه: يحتاج تحقق'
    return 'آمن نسبياً'
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              محلل التهديدات الذكي
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              حلّل أي رسالة أو رابط أو صورة مشبوهة للكشف عن محاولات الاحتيال
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">
              <Shield className="w-4 h-4" />
              مدعوم بـ VirusTotal API
            </div>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left side - Risk Score Circle */}
            <div className="space-y-6">
              <Card className="p-8 bg-white border-slate-200 shadow-md">
                <div className="flex flex-col items-center">
                  {/* Circular progress */}
                  <div className="relative h-64 w-64 mb-6">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 200 200">
                      <circle 
                        cx="100" 
                        cy="100" 
                        r="85" 
                        fill="none" 
                        stroke="#e2e8f0" 
                        strokeWidth="12" 
                      />
                      <circle
                        cx="100"
                        cy="100"
                        r="85"
                        fill="none"
                        stroke={result ? getRiskColor(result.riskScore) : '#e2e8f0'}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${(result?.riskScore || 0) * 5.34} 534`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span 
                        className="text-6xl font-black"
                        style={{ color: result ? getRiskColor(result.riskScore) : '#94a3b8' }}
                      >
                        {result?.riskScore || 0}%
                      </span>
                      <span className="text-sm text-slate-500 mt-2">درجة الخطر</span>
                    </div>
                  </div>

                  {result && (
                    <div 
                      className={`rounded-full px-6 py-2 text-sm font-semibold ${
                        result.riskScore >= 70
                          ? 'bg-red-100 text-red-700'
                          : result.riskScore >= 40
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {getRiskLabel(result.riskScore)}
                    </div>
                  )}
                </div>
              </Card>

              {/* VirusTotal Results */}
              {result?.virusTotalData && (
                <Card className="p-6 bg-white border-slate-200 shadow-md">
                  <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                    <Shield className="h-5 w-5 text-blue-600" />
                    نتائج VirusTotal
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                      <div className="text-2xl font-bold text-red-700">
                        {result.virusTotalData.malicious}
                      </div>
                      <div className="text-xs text-red-600">خطير</div>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                      <div className="text-2xl font-bold text-amber-700">
                        {result.virusTotalData.suspicious}
                      </div>
                      <div className="text-xs text-amber-600">مشبوه</div>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                      <div className="text-2xl font-bold text-emerald-700">
                        {result.virusTotalData.harmless}
                      </div>
                      <div className="text-xs text-emerald-600">آمن</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-2xl font-bold text-slate-700">
                        {result.virusTotalData.undetected}
                      </div>
                      <div className="text-xs text-slate-600">غير مكتشف</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-slate-500 text-center">
                    تم الفحص بواسطة {result.virusTotalData.total} محرك أمان
                  </div>
                </Card>
              )}

              {/* Indicators */}
              {result && result.findings.length > 0 && (
                <Card className="p-6 bg-white border-slate-200 shadow-md">
                  <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                    <Info className="h-5 w-5 text-emerald-600" />
                    لماذا يعتبر هذا تهديداً؟
                  </h3>
                  <ul className="space-y-3">
                    {result.findings.map((finding, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                        <div>
                          <p className="text-slate-900 font-semibold">{finding.keyword}</p>
                          <p className="text-slate-600 text-xs mt-1">{finding.message}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Recommendations */}
              {result && (
                <Card className={`p-6 border-2 ${
                  result.riskScore >= 70
                    ? 'bg-red-50 border-red-200'
                    : result.riskScore >= 40
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-emerald-50 border-emerald-200'
                }`}>
                  <h4 className="mb-3 flex items-center gap-2 font-bold text-slate-900">
                    <CheckCircle className={`h-5 w-5 ${
                      result.riskScore >= 70
                        ? 'text-red-600'
                        : result.riskScore >= 40
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`} />
                    نصيحة فورية
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {result.riskScore >= 70 && '⛔ خطر عالي! لا تضغط على أي رابط ولا تعطي أي معلومات. بلّغ فوراً.'}
                    {result.riskScore >= 40 && result.riskScore < 70 && '⚠️ مشبوه! تحقق من المصدر الرسمي قبل أي تفاعل.'}
                    {result.riskScore < 40 && '✅ يبدو آمناً، لكن كن حذراً دائماً مع الرسائل من مصادر غير معروفة.'}
                  </p>
                </Card>
              )}
            </div>

            {/* Right side - Input sections */}
            <div className="space-y-6">
              {/* Image Upload Section */}
              <Card className="p-6 bg-white border-slate-200 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <Upload className="h-5 w-5 text-emerald-600" />
                  تحليل صورة (Capture d'écran)
                </h3>
                
                {!uploadedImage ? (
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-12 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all"
                  >
                    <Upload className="w-12 h-12 text-slate-400 mb-3" />
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      اسحب صورة الرسالة المشبوهة هنا
                    </p>
                    <p className="text-xs text-slate-500">
                      أو اضغط لاختيار ملف من جهازك
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden border-2 border-slate-200">
                      <img
                        src={uploadedImage}
                        alt="Uploaded screenshot"
                        className="w-full h-auto max-h-64 object-contain bg-slate-50"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute top-2 left-2 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-all shadow-lg"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>

                    {isAnalyzingImage && (
                      <div className="text-center py-4">
                        <div className="inline-block animate-spin text-3xl mb-2">⏳</div>
                        <p className="text-sm text-slate-600">
                          جاري استخراج النص وفحص الملف...
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </Card>

              {/* Text/Link Input Section */}
              <Card className="p-6 bg-white border-slate-200 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <Link2 className="h-5 w-5 text-emerald-600" />
                  تحليل نص أو رابط (Link/SMS)
                </h3>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="انسخ هنا الرابط الذي وصلك أو محتوى الرسالة المشبوهة..."
                  className="mb-4 w-full rounded-lg border-2 border-slate-200 bg-white p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  rows={6}
                />
                <Button
                  onClick={() => analyzeContent(textInput)}
                  disabled={isAnalyzingText || !textInput.trim()}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-6 text-base shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzingText ? (
                    <>
                      <span className="animate-spin me-2">⏳</span>
                      جاري التحليل مع VirusTotal...
                    </>
                  ) : (
                    <>
                      <span className="me-2">🔍</span>
                      ابدأ التحليل الذكي فوراً
                    </>
                  )}
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}