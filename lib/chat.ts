'use server'

import OpenRouter from '@openrouter/sdk'

// إنشاء الكائن OpenRouter مرة واحدة للسيرفر
const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || '', // استخدم environment variable بدل الكتابة المباشرة
  defaultHeaders: {
    // Optional headers recommended by OpenRouter for site ranking; use NEXT_PUBLIC_SITE_URL for client-known URL
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'X-Title': process.env.NEXT_PUBLIC_SITE_NAME || 'CyberAman',
  },
})

export async function getChatResponse(userMessage: string) {
  if (!userMessage || userMessage.trim() === '') {
    return {
      success: false,
      message: 'يرجى إدخال رسالة صالحة.',
    }
  }

  try {
    // استخدم chat.send كما في توثيق OpenRouter
    const completion = await openRouter.chat.send({
      model: 'openai/gpt-5.2',
      messages: [
        {
          role: 'system',
          content:
            'أنت مساعد خبير في الأمن السيبراني باسم "CyberAman Assistant". هدفك هو مساعدة المستخدمين على حماية أنفسهم من الاحتيال والتهديدات السيبرانية. قدم نصائح مختصرة ودقيقة وبلغة عربية سهلة.',
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      stream: false,
    })

    return {
      success: true,
      message: completion.choices?.[0]?.message?.content || 'لم يتم الحصول على استجابة من النموذج.',
    }
  } catch (error: any) {
    console.error('Error calling OpenRouter:', error)

    // تحسين الرسالة حسب نوع الخطأ
    let errorMessage = 'عذراً، حدث خطأ أثناء الاتصال بالمساعد الذكي. يرجى المحاولة لاحقاً.'
    if (error?.response?.status === 401) {
      errorMessage = 'مفتاح API غير صالح. تحقق من إعداداتك.'
    }

    return {
      success: false,
      message: errorMessage,
    }
  }
}
