'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/layouts/container'
import { PageHeader } from '@/components/layouts/page-header'
import { FeedItem } from '@/components/feed-item'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getPlatform } from '@/lib/platforms'
import { Rss, Link2, RefreshCw, Info } from 'lucide-react'
import Link from 'next/link'

interface FeedPost {
  id: string
  platform: string
  profileName: string
  profileImage: string | null
  content: string
  imageUrl?: string | null
  timestamp: string
  likes?: number
  comments?: number
  permalink?: string | null
}

interface FeedNotice {
  platform: string
  message: string
}

export function FeedContent() {
  const { data: session, status } = useSession() || {}
  const router = useRouter()
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [notices, setNotices] = useState<FeedNotice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [status, router])

  const fetchFeed = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/social/feed')
      if (res.ok) {
        const data = await res.json()
        setPosts(data?.posts ?? [])
        setNotices(data?.notices ?? [])
      } else {
        setError('Failed to load feed')
      }
    } catch {
      setError('Failed to load feed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchFeed()
    }
  }, [status])

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <Container size="md" className="py-8">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[160px] rounded-xl" />
          ))}
        </div>
      </Container>
    )
  }

  return (
    <Container size="md" className="py-8">
      <PageHeader
        title="Unified Feed"
        description="Posts from all your connected platforms in one place."
        actions={
          <Button variant="outline" size="sm" onClick={fetchFeed} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        }
      />

      {!loading && (notices?.length ?? 0) > 0 ? (
        <div className="mt-6 space-y-2">
          {notices.map((n: FeedNotice, i: number) => {
            const p = getPlatform(n.platform)
            return (
              <div
                key={`${n.platform}-${i}`}
                className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300"
              >
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  <span className="font-medium">{p?.name ?? n.platform}:</span> {n.message}
                </span>
              </div>
            )
          })}
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[160px] rounded-xl" />
          ))
        ) : error ? (
          <div className="flex flex-col items-center gap-4 rounded-xl bg-muted/50 py-16 text-center">
            <Rss className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={fetchFeed}>Try Again</Button>
          </div>
        ) : (posts?.length ?? 0) === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-xl bg-muted/50 py-16 text-center">
            <Rss className="h-12 w-12 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">No posts yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Connect your social media accounts to see your feed here.
              </p>
            </div>
            <Link href="/dashboard">
              <Button className="gap-2">
                <Link2 className="h-4 w-4" /> Connect Platforms
              </Button>
            </Link>
          </div>
        ) : (
          posts.map((post: FeedPost) => {
            const platform = getPlatform(post.platform)
            return (
              <FeedItem
                key={post.id}
                platform={post.platform}
                platformIcon={platform?.icon ?? null}
                platformColor={platform?.color ?? '#888'}
                profileName={post.profileName}
                profileImage={post.profileImage}
                content={post.content}
                imageUrl={post?.imageUrl}
                timestamp={post.timestamp}
                likes={post?.likes}
                comments={post?.comments}
                permalink={post?.permalink}
              />
            )
          })
        )}
      </div>
    </Container>
  )
}
