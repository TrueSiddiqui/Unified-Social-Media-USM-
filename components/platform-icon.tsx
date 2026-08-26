'use client'

import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlatformIconProps {
  icon: LucideIcon | null
  platformId: string
  color: string
  className?: string
  size?: number
}

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.286-1.6-1.7-.366 2.173-1.14 3.83-2.333 4.911-1.394 1.264-3.26 1.705-5.084 1.537-1.474-.135-2.764-.726-3.634-1.665-.88-.952-1.34-2.204-1.293-3.522.09-2.554 1.874-4.34 4.56-4.565.904-.076 1.724-.026 2.46.141v2.126c-.635-.19-1.39-.27-2.28-.201-1.67.14-2.6 1.131-2.65 2.564-.027.755.213 1.44.674 1.938.48.52 1.2.848 2.086.937 1.27.117 2.437-.177 3.344-.932.79-.659 1.322-1.66 1.586-3.012-.075-.044-.152-.086-.23-.127-1.22-.626-2.773-.936-4.544-.58l-.416-2.043c2.306-.462 4.27-.1 5.843.737l.049.028c.99.534 1.777 1.272 2.323 2.237.68 1.203 1.063 2.752.722 4.527-.415 2.168-1.527 3.872-3.22 4.93-1.48.926-3.362 1.4-5.578 1.412z" />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.3 0 .59.05.86.13V9.01a6.32 6.32 0 0 0-.86-.06 6.32 6.32 0 0 0-6.32 6.34 6.32 6.32 0 0 0 6.32 6.33 6.32 6.32 0 0 0 6.34-6.33V8.75a8.19 8.19 0 0 0 4.77 1.52V6.84a4.84 4.84 0 0 1-1.01-.15z" />
    </svg>
  )
}

export function PlatformIcon({ icon: Icon, platformId, color, className, size = 20 }: PlatformIconProps) {
  if (platformId === 'threads') {
    return <ThreadsIcon className={cn('shrink-0', className)} />
  }
  if (platformId === 'tiktok') {
    return <TikTokIcon className={cn('shrink-0', className)} />
  }
  if (Icon) {
    return <Icon className={cn('shrink-0', className)} size={size} style={{ color }} />
  }
  return null
}
