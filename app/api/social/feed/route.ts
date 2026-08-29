export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { isPlatformConfigured } from '@/lib/platforms'
import { fetchFacebookFeed } from '@/lib/facebook'

// The unified feed reads each connected platform LIVE using the stored,
// encrypted access tokens. To respect user privacy, incoming posts are NOT
// stored in our database and are NEVER written to Git — they are fetched on
// demand and returned straight to the signed-in owner only.

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const connectedAccounts = await prisma.socialAccount.findMany({
      where: { userId },
    })

    if ((connectedAccounts?.length ?? 0) === 0) {
      return NextResponse.json({ posts: [], notices: [] })
    }

    const posts: any[] = []
    const notices: { platform: string; message: string }[] = []

    for (const account of connectedAccounts as any[]) {
      if (account.platform === 'facebook') {
        if (!isPlatformConfigured('facebook')) {
          notices.push({
            platform: 'facebook',
            message: 'Facebook is connected but API credentials are not configured yet.',
          })
          continue
        }
        try {
          const fbPosts = await fetchFacebookFeed(
            account.accessToken,
            account.profileName ?? 'Facebook',
            account.profileImage ?? null
          )
          posts.push(...fbPosts)
        } catch (err: any) {
          notices.push({
            platform: 'facebook',
            message: err?.message || 'Could not load Facebook posts.',
          })
        }
      } else {
        // Other platforms: live reading is being rolled out platform by platform.
        notices.push({
          platform: account.platform,
          message: 'Live feed for this platform is coming soon.',
        })
      }
    }

    posts.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    return NextResponse.json({ posts, notices })
  } catch (error: any) {
    console.error('Error fetching feed:', error?.message || error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
