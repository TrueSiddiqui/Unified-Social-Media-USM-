import { decryptToken } from '@/lib/crypto'

const GRAPH = 'https://graph.facebook.com/v19.0'

export interface FacebookPage {
  id: string
  name: string
  accessToken: string
}

export interface NormalizedPost {
  id: string
  platform: string
  profileName: string
  profileImage: string | null
  content: string
  imageUrl: string | null
  timestamp: string
  likes: number
  comments: number
  permalink: string | null
}

/**
 * Meta only allows API reading/publishing through Pages the user manages.
 * Given a stored (encrypted) user access token, resolve the manageable Pages
 * and their page-scoped access tokens.
 */
export async function getFacebookPages(encryptedUserToken: string): Promise<FacebookPage[]> {
  const userToken = decryptToken(encryptedUserToken)
  const res = await fetch(
    `${GRAPH}/me/accounts?fields=id,name,access_token&access_token=${encodeURIComponent(userToken)}`
  )
  const data = await res.json()
  if (!res.ok || data?.error) {
    throw new Error(data?.error?.message || 'Could not load Facebook Pages')
  }
  const pages: FacebookPage[] = (data?.data ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    accessToken: p.access_token,
  }))
  return pages
}

/**
 * Publish a text message to a Facebook Page feed.
 * Returns the created post id and a permalink.
 */
export async function publishToFacebookPage(
  page: FacebookPage,
  message: string
): Promise<{ id: string; url: string }> {
  const res = await fetch(`${GRAPH}/${page.id}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, access_token: page.accessToken }),
  })
  const data = await res.json()
  if (!res.ok || data?.error || !data?.id) {
    throw new Error(data?.error?.message || 'Facebook rejected the post')
  }
  const postId: string = data.id
  return {
    id: postId,
    url: `https://www.facebook.com/${postId}`,
  }
}

/**
 * Fetch recent posts from the first Page the user manages.
 * Returns normalized posts for the unified feed. Reads live — nothing is stored.
 */
export async function fetchFacebookFeed(
  encryptedUserToken: string,
  profileName: string,
  profileImage: string | null
): Promise<NormalizedPost[]> {
  const pages = await getFacebookPages(encryptedUserToken)
  if (pages.length === 0) {
    return []
  }
  const page = pages[0]
  const fields =
    'id,message,created_time,permalink_url,full_picture,likes.summary(true),comments.summary(true)'
  const res = await fetch(
    `${GRAPH}/${page.id}/posts?fields=${encodeURIComponent(fields)}&limit=25&access_token=${encodeURIComponent(page.accessToken)}`
  )
  const data = await res.json()
  if (!res.ok || data?.error) {
    throw new Error(data?.error?.message || 'Could not load Facebook feed')
  }
  return (data?.data ?? [])
    .filter((p: any) => p?.message || p?.full_picture)
    .map((p: any) => ({
      id: `facebook-${p.id}`,
      platform: 'facebook',
      profileName: page.name || profileName || 'Facebook Page',
      profileImage,
      content: p?.message ?? '',
      imageUrl: p?.full_picture ?? null,
      timestamp: p?.created_time ?? new Date().toISOString(),
      likes: p?.likes?.summary?.total_count ?? 0,
      comments: p?.comments?.summary?.total_count ?? 0,
      permalink: p?.permalink_url ?? null,
    }))
}
