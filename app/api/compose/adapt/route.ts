export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { adaptForPlatforms } from '@/lib/adapt'
import { getPlatform } from '@/lib/platforms'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const source: string = (body?.source ?? '').toString()
    const platforms: string[] = Array.isArray(body?.platforms) ? body.platforms : []

    if (!source.trim()) {
      return NextResponse.json({ error: 'Please write something first.' }, { status: 400 })
    }
    const validPlatforms = platforms.filter((p) => !!getPlatform(p))
    if (validPlatforms.length === 0) {
      return NextResponse.json({ error: 'Select at least one platform.' }, { status: 400 })
    }

    const versions = await adaptForPlatforms(source, validPlatforms)
    return NextResponse.json({ versions })
  } catch (error: any) {
    console.error('Adapt error:', error?.message || error)
    return NextResponse.json(
      { error: error?.message || 'Failed to adapt content' },
      { status: 500 }
    )
  }
}
