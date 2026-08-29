'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PlatformIcon } from '@/components/platform-icon'
import { Heart, MessageCircle, Share2, ExternalLink } from 'lucide-react'
import { SafeDate } from '@/components/safe-format'
import { type LucideIcon } from 'lucide-react'
import Image from 'next/image'

interface FeedItemProps {
  platform: string
  platformIcon: LucideIcon | null
  platformColor: string
  profileName: string
  profileImage: string | null
  content: string
  imageUrl?: string | null
  timestamp: string
  likes?: number
  comments?: number
  permalink?: string | null
}

export function FeedItem({
  platform,
  platformIcon,
  platformColor,
  profileName,
  profileImage,
  content,
  imageUrl,
  timestamp,
  likes,
  comments,
  permalink,
}: FeedItemProps) {
  return (
    <Card variant="interactive" className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profileImage ?? undefined} alt={profileName ?? 'User'} />
              <AvatarFallback>{(profileName ?? 'U')?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div
              className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-card"
              style={{ backgroundColor: platformColor }}
            >
              <PlatformIcon
                icon={platformIcon}
                platformId={platform}
                color="#fff"
                size={10}
                className="h-2.5 w-2.5 text-white"
              />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{profileName}</span>
              <span className="text-xs text-muted-foreground">
                <SafeDate date={timestamp} options={{ dateStyle: 'medium' }} />
              </span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-wrap">{content}</p>

            {imageUrl ? (
              <div className="relative mt-3 aspect-video overflow-hidden rounded-lg bg-muted">
                <Image
                  src={imageUrl}
                  alt="Post media"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
              </div>
            ) : null}

            <div className="mt-3 flex items-center gap-4 text-muted-foreground">
              {typeof likes === 'number' ? (
                <span className="flex items-center gap-1.5 text-xs">
                  <Heart className="h-3.5 w-3.5" /> {likes}
                </span>
              ) : null}
              {typeof comments === 'number' ? (
                <span className="flex items-center gap-1.5 text-xs">
                  <MessageCircle className="h-3.5 w-3.5" /> {comments}
                </span>
              ) : null}
              <button
                className="flex items-center gap-1.5 text-xs hover:text-foreground transition-colors"
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator?.share) {
                    navigator.share({ text: content }).catch(() => {})
                  }
                }}
              >
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
              {permalink ? (
                <a
                  href={permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto flex items-center gap-1.5 text-xs hover:text-foreground transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> View original
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
