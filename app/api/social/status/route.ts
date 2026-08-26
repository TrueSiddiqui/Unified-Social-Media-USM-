export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PLATFORMS } from '@/lib/platforms'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const platforms = PLATFORMS.map((p) => {
      const clientId = process.env[p.envClientId]
      const clientSecret = process.env[p.envClientSecret]
      return {
        id: p.id,
        configured: !!(clientId && clientSecret),
      }
    })

    return NextResponse.json({ platforms })
  } catch (error: any) {
    console.error('Error fetching platform status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
