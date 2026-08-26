export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = (session.user as any)?.id
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const socialAccounts = await prisma.socialAccount.findMany({
      where: { userId },
      select: {
        platform: true,
        profileName: true,
        profileImage: true,
        connectedAt: true,
      },
    })

    return NextResponse.json({
      accounts: socialAccounts.map((a: any) => ({
        platform: a.platform,
        profileName: a.profileName,
        profileImage: a.profileImage,
        connectedAt: a.connectedAt?.toISOString?.() ?? null,
      })),
    })
  } catch (error: any) {
    console.error('Error fetching accounts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
