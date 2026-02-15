import { NextRequest, NextResponse } from 'next/server'

const VIRUSTOTAL_API_URL = 'https://www.virustotal.com/api/v3'
const MAX_FILE_SIZE = 32 * 1024 * 1024
const POLL_INTERVAL_MS = 3000
const MAX_POLL_ATTEMPTS = 6

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function pollAnalysis(analysisId: string, apiKey: string) {
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
    const status = payload?.data?.attributes?.status
    if (status === 'completed') {
      return payload.data
    }

    await sleep(POLL_INTERVAL_MS)
  }

  throw new Error('Analysis is still queued, try again in a few seconds')
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds the 32MB public API limit' },
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

    const arrayBuffer = await file.arrayBuffer()
    const fileBlob = new Blob([arrayBuffer], {
      type: file.type || 'application/octet-stream',
    })

    const vtFormData = new FormData()
    vtFormData.append('file', fileBlob, file.name || 'upload.bin')

    const scanResponse = await fetch(`${VIRUSTOTAL_API_URL}/files`, {
      method: 'POST',
      headers: {
        'x-apikey': apiKey,
        accept: 'application/json',
      },
      body: vtFormData,
    })

    if (!scanResponse.ok) {
      const errorText = await scanResponse.text()
      console.error('VirusTotal scan error:', errorText)
      throw new Error('Failed to upload file to VirusTotal')
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
    console.error('VirusTotal file analysis error:', error)
    return NextResponse.json(
      {
        error: 'Failed to analyze file',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}