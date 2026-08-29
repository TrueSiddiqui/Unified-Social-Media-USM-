'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/layouts/container'
import { PageHeader } from '@/components/layouts/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PlatformIcon } from '@/components/platform-icon'
import { PLATFORMS } from '@/lib/platforms'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Unlink, Check, Loader2, User, Shield, Star } from 'lucide-react'
import { toast } from 'sonner'

interface AccountInfo {
  platform: string
  profileName: string | null
  profileImage: string | null
  connectedAt: string
}

export function SettingsContent() {
  const { data: session, status } = useSession() || {}
  const router = useRouter()
  const [accounts, setAccounts] = useState<AccountInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [disconnecting, setDisconnecting] = useState<string | null>(null)
  const [mainPlatform, setMainPlatform] = useState<string>('')
  const [savingMain, setSavingMain] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [status, router])

  const fetchAccounts = useCallback(async () => {
    try {
      const res = await fetch('/api/social/accounts')
      if (res.ok) {
        const data = await res.json()
        setAccounts(data?.accounts ?? [])
      }
    } catch (err) {
      console.error('Failed to fetch accounts:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchMainPlatform = useCallback(async () => {
    try {
      const res = await fetch('/api/user/main-platform')
      if (res.ok) {
        const data = await res.json()
        setMainPlatform(data?.mainPlatform ?? '')
      }
    } catch (err) {
      console.error('Failed to fetch main platform:', err)
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAccounts()
      fetchMainPlatform()
    }
  }, [status, fetchAccounts, fetchMainPlatform])

  const handleMainPlatformChange = async (platform: string) => {
    const value = platform === 'none' ? '' : platform
    setSavingMain(true)
    try {
      const res = await fetch('/api/user/main-platform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: value || null }),
      })
      if (res.ok) {
        setMainPlatform(value)
        toast.success('Main platform updated')
      } else {
        toast.error('Failed to update main platform')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSavingMain(false)
    }
  }

  const handleDisconnect = async (platform: string) => {
    setDisconnecting(platform)
    try {
      const res = await fetch('/api/social/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform }),
      })
      if (res.ok) {
        toast.success('Platform disconnected')
        fetchAccounts()
      } else {
        toast.error('Failed to disconnect')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setDisconnecting(null)
    }
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <Container size="md" className="py-8">
        <Skeleton className="h-[400px] rounded-xl" />
      </Container>
    )
  }

  return (
    <Container size="md" className="py-8">
      <PageHeader
        title="Settings"
        description="Manage your account and connected platforms."
      />

      <div className="mt-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" /> Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="text-sm font-medium">{(session?.user as any)?.name ?? 'Not set'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm font-medium" suppressHydrationWarning>
                  {(session?.user as any)?.email ?? 'Not set'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="h-4 w-4" /> Main Platform
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">
              Choose your primary platform. It&apos;s highlighted across your dashboard and pre-selected when you compose.
            </p>
            <Select
              value={mainPlatform || 'none'}
              onValueChange={handleMainPlatformChange}
              disabled={savingMain}
            >
              <SelectTrigger className="w-full sm:w-72">
                <SelectValue placeholder="Select a main platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No preference</SelectItem>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {savingMain ? (
              <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> Saving…
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" /> Connected Platforms
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {PLATFORMS.map((p) => {
                  const account = accounts.find((a: AccountInfo) => a.platform === p.id)
                  const connected = !!account
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${p.color}15` }}
                        >
                          <PlatformIcon icon={p.icon} platformId={p.id} color={p.color} size={18} />
                        </div>
                        <div>
                          <span className="text-sm font-medium">{p.name}</span>
                          {connected && account?.profileName ? (
                            <p className="text-xs text-muted-foreground">@{account.profileName}</p>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {connected ? (
                          <>
                            <Badge variant="default" className="gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-xs">
                              <Check className="h-3 w-3" /> Connected
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDisconnect(p.id)}
                              disabled={disconnecting === p.id}
                              className="text-destructive hover:text-destructive"
                            >
                              {disconnecting === p.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Unlink className="h-4 w-4" />
                              )}
                            </Button>
                          </>
                        ) : (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            Not Connected
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
