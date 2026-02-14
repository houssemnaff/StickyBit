'use server'

import { OpenRouter } from '@openrouter/sdk'

const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'X-Title': 'CyberAman',
  },
})

export async function getChatResponse(userMessage: string) {
  try {
    const completion = await openRouter.chat.completions.create({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a cybersecurity expert assistant named "CyberAman Assistant". Your goal is to help users protect themselves from online scams and cyber threats. Provide concise, helpful, and accurate advice in Arabic.',
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
      message: completion.choices[0].message.content,
    }
  } catch (error) {
    console.error('Error calling OpenRouter:', error)
    return {
      success: false,
      message: 'عذراً، حدث خطأ أثناء الاتصال بالمساعد الذكي. يرجى المحاولة لاحقاً.',
    }
  }
}
