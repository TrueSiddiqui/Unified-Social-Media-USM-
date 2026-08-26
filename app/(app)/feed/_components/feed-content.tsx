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
import { Rss, Link2, RefreshCw } from 'lucide-react'
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
}

export function FeedContent() {
  const { data: session, status } = useSession() || {}
  const router = useRouter()
  const [posts, setPosts] = useState<FeedPost[]>([])
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
              />
            )
          })
        )}
      </div>
    </Container>
  )
}
