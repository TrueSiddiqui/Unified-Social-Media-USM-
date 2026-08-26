export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// This is a placeholder feed endpoint.
// In production, each platform's API would be called with the stored tokens.
// For now, it returns a message explaining that live feed data requires
// valid API credentials and connected accounts.

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

    const connectedAccounts = await prisma.socialAccount.findMany({
      where: { userId },
      select: {
        platform: true,
        profileName: true,
        profileImage: true,
      },
    })

    if ((connectedAccounts?.length ?? 0) === 0) {
      return NextResponse.json({ posts: [] })
    }

    // Generate placeholder posts to demonstrate the feed UI
    // In production, these would be fetched from each platform's API
    const posts = connectedAccounts.map((account: any, index: number) => ({
      id: `placeholder-${account.platform}-${index}`,
      platform: account.platform,
      profileName: account.profileName ?? 'Unknown',
      profileImage: account.profileImage,
      content: `This is a placeholder post from your ${account.platform} account. Once the platform API credentials are configured, real posts from your feed will appear here.`,
      imageUrl: null,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
    }))

    return NextResponse.json({ posts })
  } catch (error: any) {
    console.error('Error fetching feed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
