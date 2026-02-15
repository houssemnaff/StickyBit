import { NextRequest, NextResponse } from 'next/server'

const VIRUSTOTAL_API_URL = 'https://www.virustotal.com/api/v3'
const POLL_INTERVAL_MS = 2000
const MAX_POLL_ATTEMPTS = 10

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

type AnalysisPayload = {
  attributes?: {
    status?: string
  }
  [key: string]: unknown
}

type PollResult = {
  analysis: AnalysisPayload | null
  completed: boolean
  status: string
}

async function pollAnalysis(analysisId: string, apiKey: string): Promise<PollResult> {
  let lastPayload: AnalysisPayload | null = null

  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    const response = await fetch(`${VIRUSTOTAL_API_URL}/analyses/${analysisId}`, {
      headers: {
        'x-apikey': apiKey,
        accept: 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to get analysis results: ${errorText}`)
    }

    const payload = await response.json()
    const status = (payload?.data?.attributes?.status as string | undefined) ?? 'unknown'
    lastPayload = payload?.data ?? null

    if (status === 'completed') {
      return {
        analysis: lastPayload,
        completed: true,
        status,
      }
    }

    await sleep(POLL_INTERVAL_MS)
  }

  if (!lastPayload) {
    throw new Error('VirusTotal did not return an analysis payload')
  }

  return {
    analysis: lastPayload,
    completed: false,
    status: (lastPayload.attributes?.status as string | undefined) ?? 'queued',
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const url = body?.url?.trim()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.VIRUSTOTAL_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'VirusTotal API key not configured' },
        { status: 500 }
      )
    }

    const scanResponse = await fetch(`${VIRUSTOTAL_API_URL}/urls`, {
      method: 'POST',
      headers: {
        'x-apikey': apiKey,
        'content-type': 'application/x-www-form-urlencoded',
        accept: 'application/json',
      },
      body: new URLSearchParams({ url }),
    })

    if (!scanResponse.ok) {
      const errorText = await scanResponse.text()
      console.error('VirusTotal URL scan error:', errorText)
      throw new Error('Failed to submit URL to VirusTotal')
    }

    const scanData = await scanResponse.json()
    const analysisId = scanData?.data?.id

    if (!analysisId) {
      throw new Error('VirusTotal did not return an analysis id')
    }

    const { analysis, completed, status } = await pollAnalysis(analysisId, apiKey)

    return NextResponse.json({
      success: true,
      completed,
      status,
      data: analysis,
    }, { status: completed ? 200 : 202 })
  } catch (error) {
    console.error('VirusTotal URL analysis error:', error)
    return NextResponse.json(
      {
        error: 'Failed to analyze URL',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}