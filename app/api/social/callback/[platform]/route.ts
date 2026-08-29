export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getPlatform } from '@/lib/platforms'
import { encryptToken } from '@/lib/crypto'

interface TokenResponse {
  access_token: string
  refresh_token?: string
  expires_in?: number
  token_type?: string
}

interface ProfileResponse {
  id: string
  name?: string
  picture?: string
}

async function exchangeCodeForToken(
  platformId: string,
  code: string,
  redirectUri: string
): Promise<TokenResponse | null> {
  const platform = getPlatform(platformId)
  if (!platform) return null

  const clientId = process.env[platform.envClientId] ?? ''
  const clientSecret = process.env[platform.envClientSecret] ?? ''

  let tokenUrl: string
  let body: string
  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }

  switch (platformId) {
    case 'facebook':
      tokenUrl = 'https://graph.facebook.com/v19.0/oauth/access_token'
      body = `client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`
      break
    case 'instagram':
      tokenUrl = 'https://api.instagram.com/oauth/access_token'
      body = `client_id=${clientId}&client_secret=${clientSecret}&grant_type=authorization_code&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`
      break
    case 'threads':
      tokenUrl = 'https://graph.threads.net/oauth/access_token'
      body = `client_id=${clientId}&client_secret=${clientSecret}&grant_type=authorization_code&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`
      break
    case 'twitter':
      tokenUrl = 'https://api.twitter.com/2/oauth2/token'
      body = `code=${code}&grant_type=authorization_code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&code_verifier=challenge`
      headers['Authorization'] = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      break
    case 'linkedin':
      tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken'
      body = `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}&client_id=${clientId}&client_secret=${clientSecret}`
      break
    case 'youtube':
      tokenUrl = 'https://oauth2.googleapis.com/token'
      body = `code=${code}&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${encodeURIComponent(redirectUri)}&grant_type=authorization_code`
      break
    case 'tiktok':
      tokenUrl = 'https://open.tiktokapis.com/v2/oauth/token/'
      body = `client_key=${clientId}&client_secret=${clientSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${encodeURIComponent(redirectUri)}`
      break
    default:
      return null
  }

  try {
    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers,
      body,
    })
    const data = await res.json()
    if (data?.access_token) {
      return {
        access_token: data.access_token,
        refresh_token: data?.refresh_token,
        expires_in: data?.expires_in,
      }
    }
    console.error(`Token exchange failed for ${platformId}:`, data)
    return null
  } catch (err) {
    console.error(`Token exchange error for ${platformId}:`, err)
    return null
  }
}

async function fetchProfile(
  platformId: string,
  accessToken: string
): Promise<ProfileResponse | null> {
  try {
    let url: string
    let headers: Record<string, string> = {}

    switch (platformId) {
      case 'facebook': {
        const fbBase = 'https://graph.facebook.com/v19.0/me'
        url = `${fbBase}?fields=id,name,picture.type(large)&access_token=${encodeURIComponent(accessToken)}`
        break
      }
      case 'instagram':
        url = `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
        break
      case 'threads':
        url = `https://graph.threads.net/me?fields=id,username&access_token=${accessToken}`
        break
      case 'twitter':
        url = 'https://api.twitter.com/2/users/me?user.fields=profile_image_url'
        headers = { Authorization: `Bearer ${accessToken}` }
        break
      case 'linkedin':
        url = 'https://api.linkedin.com/v2/userinfo'
        headers = { Authorization: `Bearer ${accessToken}` }
        break
      case 'youtube':
        url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&access_token=${accessToken}`
        break
      case 'tiktok':
        url = 'https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url'
        headers = { Authorization: `Bearer ${accessToken}` }
        break
      default:
        return null
    }

    const res = await fetch(url, { headers })
    const data = await res.json()

    switch (platformId) {
      case 'facebook':
        return { id: data?.id ?? '', name: data?.name, picture: data?.picture?.data?.url }
      case 'instagram':
        return { id: data?.id ?? '', name: data?.username }
      case 'threads':
        return { id: data?.id ?? '', name: data?.username }
      case 'twitter':
        return { id: data?.data?.id ?? '', name: data?.data?.username, picture: data?.data?.profile_image_url }
      case 'linkedin':
        return { id: data?.sub ?? '', name: data?.name, picture: data?.picture }
      case 'youtube': {
        const ch = data?.items?.[0]
        return { id: ch?.id ?? '', name: ch?.snippet?.title, picture: ch?.snippet?.thumbnails?.default?.url }
      }
      case 'tiktok':
        return { id: data?.data?.user?.open_id ?? '', name: data?.data?.user?.display_name, picture: data?.data?.user?.avatar_url }
      default:
        return null
    }
  } catch (err) {
    console.error(`Profile fetch error for ${platformId}:`, err)
    return null
  }
}

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

    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      console.error(`OAuth error for ${platformId}:`, error)
      return NextResponse.redirect(new URL(`/dashboard?error=${error}`, req.url))
    }

    if (!code || !state) {
      return NextResponse.redirect(new URL('/dashboard?error=missing_params', req.url))
    }

    // Verify state
    const oauthState = await prisma.oAuthState.findUnique({ where: { state } })
    if (!oauthState || oauthState.userId !== userId || oauthState.platform !== platformId) {
      return NextResponse.redirect(new URL('/dashboard?error=invalid_state', req.url))
    }
    if (new Date() > oauthState.expiresAt) {
      await prisma.oAuthState.delete({ where: { id: oauthState.id } })
      return NextResponse.redirect(new URL('/dashboard?error=state_expired', req.url))
    }

    // Clean up state
    await prisma.oAuthState.delete({ where: { id: oauthState.id } })

    // Exchange code for token
    const baseUrl = new URL(req.url).origin
    const redirectUri = `${baseUrl}${platform.callbackPath}`
    const tokenData = await exchangeCodeForToken(platformId, code, redirectUri)

    if (!tokenData) {
      return NextResponse.redirect(new URL('/dashboard?error=token_exchange_failed', req.url))
    }

    // Fetch profile
    const profile = await fetchProfile(platformId, tokenData.access_token)

    // Calculate token expiry
    const tokenExpiresAt = tokenData.expires_in
      ? new Date(Date.now() + tokenData.expires_in * 1000)
      : null

    // Upsert social account
    await prisma.socialAccount.upsert({
      where: {
        userId_platform: {
          userId,
          platform: platformId,
        },
      },
      update: {
        platformUserId: profile?.id ?? 'unknown',
        profileName: profile?.name ?? null,
        profileImage: profile?.picture ?? null,
        accessToken: encryptToken(tokenData.access_token),
        refreshToken: tokenData.refresh_token ? encryptToken(tokenData.refresh_token) : null,
        tokenExpiresAt,
        scopes: platform.scopes,
      },
      create: {
        userId,
        platform: platformId,
        platformUserId: profile?.id ?? 'unknown',
        profileName: profile?.name ?? null,
        profileImage: profile?.picture ?? null,
        accessToken: encryptToken(tokenData.access_token),
        refreshToken: tokenData.refresh_token ? encryptToken(tokenData.refresh_token) : null,
        tokenExpiresAt,
        scopes: platform.scopes,
      },
    })

    return NextResponse.redirect(new URL('/dashboard?connected=' + platformId, req.url))
  } catch (error: any) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(new URL('/dashboard?error=callback_error', req.url))
  }
}
