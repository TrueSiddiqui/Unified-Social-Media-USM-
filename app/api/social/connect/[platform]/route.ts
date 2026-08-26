export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getPlatform } from '@/lib/platforms'
import crypto from 'crypto'

export async function GET(
  req: NextRequest,
  { params }: { params: { platform: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    const userId = (session.user as any)?.id
    if (!userId) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    const platformId = params?.platform
    const platform = getPlatform(platformId ?? '')
    if (!platform) {
      return NextResponse.redirect(new URL('/dashboard?error=invalid_platform', req.url))
    }

    const clientId = process.env[platform.envClientId]
    if (!clientId) {
      return NextResponse.redirect(new URL('/dashboard?error=not_configured', req.url))
    }

    // Generate state for CSRF protection
    const state = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await prisma.oAuthState.create({
      data: {
        state,
        platform: platformId,
        userId,
        expiresAt,
      },
    })

    // Build the base URL from the request
    const baseUrl = new URL(req.url).origin
    const redirectUri = `${baseUrl}${platform.callbackPath}`

    // Build authorization URL based on platform
    let authUrl: string

    switch (platformId) {
      case 'facebook':
        authUrl = `${platform.authUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${encodeURIComponent(platform.scopes)}&response_type=code`
        break
      case 'instagram':
        authUrl = `${platform.authUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${encodeURIComponent(platform.scopes)}&response_type=code`
        break
      case 'threads':
        authUrl = `${platform.authUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${encodeURIComponent(platform.scopes)}&response_type=code`
        break
      case 'twitter':
        // Twitter uses PKCE
        authUrl = `${platform.authUrl}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(platform.scopes)}&state=${state}&code_challenge=challenge&code_challenge_method=plain`
        break
      case 'linkedin':
        authUrl = `${platform.authUrl}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${encodeURIComponent(platform.scopes)}`
        break
      case 'youtube':
        authUrl = `${platform.authUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(platform.scopes)}&state=${state}&access_type=offline&prompt=consent`
        break
      case 'tiktok':
        authUrl = `${platform.authUrl}?client_key=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(platform.scopes)}&state=${state}`
        break
      default:
        return NextResponse.redirect(new URL('/dashboard?error=unsupported_platform', req.url))
    }

    return NextResponse.redirect(authUrl)
  } catch (error: any) {
    console.error('OAuth connect error:', error)
    return NextResponse.redirect(new URL('/dashboard?error=oauth_error', req.url))
  }
}
