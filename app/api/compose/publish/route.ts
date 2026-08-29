export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getPlatform, isPlatformConfigured } from '@/lib/platforms'
import { getFacebookPages, publishToFacebookPage } from '@/lib/facebook'

interface IncomingDraft {
  platform: string
  content: string
  aiModified?: boolean
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const source: string = (body?.source ?? '').toString()
    const drafts: IncomingDraft[] = Array.isArray(body?.drafts) ? body.drafts : []

    if (!source.trim()) {
      return NextResponse.json({ error: 'Nothing to publish.' }, { status: 400 })
    }
    const validDrafts = drafts.filter(
      (d) => d && getPlatform(d.platform) && (d.content ?? '').toString().trim().length > 0
    )
    if (validDrafts.length === 0) {
      return NextResponse.json({ error: 'No valid platform drafts to publish.' }, { status: 400 })
    }

    // Persist the authoring session (user's own content only — never leaves the DB).
    const compose = await prisma.compose.create({
      data: { userId, sourceContent: source },
    })

    const socialAccounts = await prisma.socialAccount.findMany({ where: { userId } })

    const results = [] as Array<{
      platform: string
      status: string
      publishedUrl: string | null
      error: string | null
      aiModified: boolean
    }>

    for (const draft of validDrafts) {
      const platform = getPlatform(draft.platform)!
      const content = draft.content.toString()
      const aiModified = !!draft.aiModified
      let status = 'draft'
      let publishedPostId: string | null = null
      let publishedUrl: string | null = null
      let error: string | null = null
      let publishedAt: Date | null = null

      const account = socialAccounts.find((a: any) => a.platform === draft.platform)

      if (!platform.supportsPublish) {
        status = 'skipped'
        error = platform.publishNote || 'Publishing to this platform is coming soon.'
      } else if (!isPlatformConfigured(draft.platform)) {
        status = 'skipped'
        error = 'This platform is not configured yet (missing API credentials).'
      } else if (!account) {
        status = 'skipped'
        error = 'Connect this platform first to publish.'
      } else {
        try {
          if (draft.platform === 'facebook') {
            const pages = await getFacebookPages(account.accessToken)
            if (pages.length === 0) {
              status = 'failed'
              error =
                'No Facebook Page found. Facebook requires a Page you manage to publish.'
            } else {
              const published = await publishToFacebookPage(pages[0], content)
              status = 'published'
              publishedPostId = published.id
              publishedUrl = published.url
              publishedAt = new Date()
            }
          } else {
            status = 'skipped'
            error = platform.publishNote || 'Publishing to this platform is coming soon.'
          }
        } catch (err: any) {
          status = 'failed'
          error = err?.message || 'Failed to publish'
        }
      }

      await prisma.platformDraft.create({
        data: {
          composeId: compose.id,
          userId,
          platform: draft.platform,
          content,
          aiModified,
          status,
          publishedPostId,
          publishedUrl,
          error,
          publishedAt,
        },
      })

      results.push({ platform: draft.platform, status, publishedUrl, error, aiModified })
    }

    return NextResponse.json({ composeId: compose.id, results })
  } catch (error: any) {
    console.error('Publish error:', error?.message || error)
    return NextResponse.json(
      { error: error?.message || 'Failed to publish' },
      { status: 500 }
    )
  }
}
