export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getPlatform } from '@/lib/platforms'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { mainPlatform: true },
    })
    return NextResponse.json({ mainPlatform: user?.mainPlatform ?? null })
  } catch (error: any) {
    console.error('Get main platform error:', error?.message || error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await req.json().catch(() => ({}))
    const platform: string | null = body?.platform ?? null
    if (platform !== null && !getPlatform(platform)) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
    }
    await prisma.user.update({
      where: { id: userId },
      data: { mainPlatform: platform },
    })
    return NextResponse.json({ mainPlatform: platform })
  } catch (error: any) {
    console.error('Set main platform error:', error?.message || error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
