'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PlatformIcon } from '@/components/platform-icon'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Check, Link2, Unlink, Info, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { type LucideIcon } from 'lucide-react'

interface PlatformCardProps {
  id: string
  name: string
  icon: LucideIcon | null
  color: string
  description: string
  isConnected: boolean
  isConfigured: boolean
  profileName?: string | null
  profileImage?: string | null
  onConnect: () => void
  onDisconnect: () => void
}

export function PlatformCard({
  id,
  name,
  icon,
  color,
  description,
  isConnected,
  isConfigured,
  profileName,
  profileImage,
  onConnect,
  onDisconnect,
}: PlatformCardProps) {
  const [loading, setLoading] = useState(false)

  const handleConnect = async () => {
    if (!isConfigured) {
      toast.error(`${name} is not configured. API credentials are required.`)
      return
    }
    setLoading(true)
    onConnect()
  }

  const handleDisconnect = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/social/disconnect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: id }),
      })
      if (res.ok) {
        toast.success(`Disconnected from ${name}`)
        onDisconnect()
      } else {
        toast.error(`Failed to disconnect from ${name}`)
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card
      variant="interactive"
      className="relative overflow-hidden transition-all duration-normal"
    >
      {/* Color accent bar */}
      <div className="absolute left-0 top-0 h-1 w-full" style={{ backgroundColor: color }} />

      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${color}15` }}
            >
              <PlatformIcon icon={icon} platformId={id} color={color} size={24} />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold tracking-tight">{name}</h3>
              {isConnected && profileName ? (
                <p className="text-sm text-muted-foreground">@{profileName}</p>
              ) : null}
            </div>
          </div>
          {isConnected ? (
            <Badge variant="default" className="gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
              <Check className="h-3 w-3" /> Connected
            </Badge>
          ) : !isConfigured ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="gap-1 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                    <Info className="h-3 w-3" /> Not Configured
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-sm">Developer API credentials are required. Add <code>{name}</code> credentials to your environment variables.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">
              Not Connected
            </Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

        {isConnected ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={handleDisconnect}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Unlink className="h-4 w-4" />}
            Disconnect
          </Button>
        ) : (
          <Button
            size="sm"
            className="w-full gap-2"
            style={{ backgroundColor: isConfigured ? color : undefined }}
            onClick={handleConnect}
            disabled={loading || !isConfigured}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
            {isConfigured ? 'Connect' : 'Credentials Required'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
