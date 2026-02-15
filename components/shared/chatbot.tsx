'use client'

import { useState, useRef, useEffect } from 'react'
import { getChatResponse } from '@/lib/chat'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MessageCircle, X, Send, Copy, Check, Loader2 } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  suggestions?: string[]
  timestamp: Date
}

const INITIAL_SUGGESTIONS = [
  'عندي مشكلة في حسابي على الفيسبوك',
  'استقبلت رسالة مريبة من البنك',
  'كيف أحمي كلمة سرّي؟',
  'تلقيت رابط مريب على الواتس',
  'كيف أفعّل المصادقة الثنائية؟',
]

const CHATBOT_RESPONSES = {
  'حسابي': {
    suggestions: [
      'غيّر كلمة السرّ فوراً إذا كنت متأكد من التسريب',
      'فعّل المصادقة الثنائية على حسابك',
      'تحقق من الأجهزة المرتبطة بحسابك وحذف غير المعروفة',
      'لا تشارك رابط تسجيل الدخول مع أحد',
    ],
    response: 'إليك نصائح لحماية حسابك:',
  },
  'رسالة مريبة': {
    suggestions: [
      'لا تنقر على أي روابط في الرسالة',
      'احذف الرسالة فوراً',
      'بلّغ عن الرسالة كرسالة احتيالية',
      'اتصل بالبنك مباشرة من رقم موثوق',
    ],
    response: 'إذا استقبلت رسالة مريبة، اتبع هذه الخطوات:',
  },
  'كلمة السرّ': {
    suggestions: [
      'استخدم كلمة سرّ قوية (8+ أحرف + أرقام + رموز)',
      'لا تستخدم نفس الكلمة لكل الحسابات',
      'غيّر كلمتك كل 3 أشهر',
      'استخدم تطبيق لإدارة كلمات السرّ (Bitwarden, 1Password)',
    ],
    response: 'نصائح لكلمة سرّ قوية:',
  },
  'رابط': {
    suggestions: [
      'لا تنقر على روابط من مصادر غير موثوقة',
      'تحقق من عنوان الموقع قبل إدخال بيانات',
      'ابحث عن قفل الأمان (🔒) في شريط العنوان',
      'استخدم أداة كشف الروابط الخطرة',
    ],
    response: 'احذر من الروابط المريبة. إليك نصائح الأمان:',
  },
  'مصادقة': {
    suggestions: [
      'المصادقة الثنائية تضيف طبقة حماية إضافية',
      'استخدم تطبيق (Google Authenticator, Authy)',
      'احفظ رموز النسخ الاحتياطي في مكان آمن',
      'غيّر رقم الهاتف المرتبط إذا تم اختراقه',
    ],
    response: 'المصادقة الثنائية توفر حماية أفضل:',
  },
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'مرحبا! أنا هنا لمساعدتك في حماية نفسك من الاحتيالات الإلكترونية. كيف يمكنني مساعدتك اليوم؟',
      suggestions: INITIAL_SUGGESTIONS,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSuggestionClick = (suggestion: string) => {
    addMessage(suggestion, 'user')
    processUserMessage(suggestion)
  }

  const addMessage = (content: string, role: 'user' | 'assistant', suggestions?: string[]) => {
    const message: Message = {
      id: Date.now().toString(),
      role,
      content,
      suggestions,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, message])
  }



  const processUserMessage = async (userMessage: string) => {
    // 1. Check local responses first
    let response = ''
    let suggestions: string[] = []
    let foundLocal = false

    for (const [key, data] of Object.entries(CHATBOT_RESPONSES)) {
      if (userMessage.includes(key)) {
        response = data.response
        suggestions = data.suggestions
        foundLocal = true
        break
      }
    }

    if (foundLocal) {
      setTimeout(() => {
        addMessage(response, 'assistant', suggestions)
      }, 500)
    } else {
      // 2. Fallback to OpenRouter AI
      setIsLoading(true)
      try {
        const result = await getChatResponse(userMessage)
        if (result.success && result.message) {
           addMessage(result.message, 'assistant', [])
        } else {
           addMessage(result.message || 'حدث خطأ غير متوقع', 'assistant')
        }
      } catch (error) {
        addMessage('عذراً، حدث خطأ أثناء الاتصال بالمساعد الذكي.', 'assistant')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    addMessage(input, 'user')
    processUserMessage(input)
    setInput('')
  }

  const copySuggestion = (suggestion: string) => {
    navigator.clipboard.writeText(suggestion)
    setCopiedId(suggestion)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-3 sm:p-4 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow hover:bg-primary/90"
        aria-label="فتح المحادثة مع المساعد"
      >
        {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
      </button>

      {isOpen && (
        <Card className="fixed bottom-20 right-6 z-40 w-11/12 max-w-sm h-[70vh] sm:w-96 sm:h-96 flex flex-col shadow-2xl">
          <div className="bg-primary text-primary-foreground p-4 rounded-t-lg">
            <h3 className="font-bold text-lg">حكيم'مساعدك الآمن'</h3>
            <p className="text-sm text-primary-foreground/80">نصائح أمان فورية</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] sm:max-w-xs ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-2 sm:p-3`}>
                  <p className="text-sm">{message.content}</p>

                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.suggestions.map((suggestion, idx) => (
                        <div
                          key={idx}
                          className="w-full text-right text-xs p-2 bg-background/50 hover:bg-background rounded transition-colors flex items-center justify-between group cursor-pointer"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <span>{suggestion}</span>
                          {message.role === 'assistant' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                copySuggestion(suggestion)
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
                            >
                              {copiedId === suggestion ? (
                                <Check className="w-3 h-3 text-green-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="border-t p-2 sm:p-3 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب سؤالك..."
              className="flex-1"
            />
            <Button
              type="submit"
              size="icon"
              className="bg-primary hover:bg-primary/90"
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </Card>
      )}
    </>
  )
}

