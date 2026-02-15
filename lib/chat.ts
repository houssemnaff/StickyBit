'use server'

export async function getChatResponse(userMessage: string) {
  if (!userMessage || userMessage.trim() === '') {
    return {
      success: false,
      message: 'يرجى إدخال رسالة صالحة.',
    }
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'CyberAman',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4-turbo',
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
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`OpenRouter API error: ${response.status} - ${errorData?.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    const message = data.choices?.[0]?.message?.content || 'لم يتم الحصول على استجابة من النموذج.'

    return {
      success: true,
      message,
    }
  } catch (error: any) {
    console.error('Error calling OpenRouter:', error)

    let errorMessage = 'عذراً، حدث خطأ أثناء الاتصال بالمساعد الذكي. يرجى المحاولة لاحقاً.'
    if (error?.message?.includes('401')) {
      errorMessage = 'مفتاح API غير صالح. تحقق من إعداداتك.'
    }

    return {
      success: false,
      message: errorMessage,
    }
  }
}
