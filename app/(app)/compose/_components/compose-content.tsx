'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/layouts/container'
import { PageHeader } from '@/components/layouts/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { PlatformIcon } from '@/components/platform-icon'
import { PLATFORMS, getPlatform } from '@/lib/platforms'
import {
  Sparkles,
  Send,
  Loader2,
  Link2,
  Check,
  AlertTriangle,
  Info,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'

interface AccountInfo {
  platform: string
  profileName: string | null
}

interface Draft {
  platform: string
  content: string
  aiModified: boolean
}

interface PublishResult {
  platform: string
  status: string
  publishedUrl: string | null
  error: string | null
  aiModified: boolean
}

export function ComposeContent() {
  const { status } = useSession() || {}
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [accounts, setAccounts] = useState<AccountInfo[]>([])
  const [mainPlatform, setMainPlatform] = useState<string | null>(null)

  const [source, setSource] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [adapting, setAdapting] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [results, setResults] = useState<PublishResult[] | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login')
  }, [status, router])

  const load = useCallback(async () => {
    try {
      const [accRes, mpRes] = await Promise.all([
        fetch('/api/social/accounts'),
        fetch('/api/user/main-platform'),
      ])
      let connected: AccountInfo[] = []
      if (accRes.ok) {
        const data = await accRes.json()
        connected = data?.accounts ?? []
        setAccounts(connected)
      }
      let mp: string | null = null
      if (mpRes.ok) {
        const data = await mpRes.json()
        mp = data?.mainPlatform ?? null
        setMainPlatform(mp)
      }
      // Default selection: all connected platforms.
      setSelected(connected.map((a) => a.platform))
    } catch (err) {
      console.error('Failed to load compose data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated') load()
  }, [status, load])

  const toggle = (platform: string) => {
    setResults(null)
    setDrafts([])
    setSelected((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    )
  }

  const handleAdapt = async () => {
    if (!source.trim()) {
      toast.error('Write your post first.')
      return
    }
    if (selected.length === 0) {
      toast.error('Select at least one platform.')
      return
    }
    setAdapting(true)
    setResults(null)
    try {
      const res = await fetch('/api/compose/adapt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, platforms: selected }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to adapt')
      setDrafts(
        (data?.versions ?? []).map((v: any) => ({
          platform: v.platform,
          content: v.content ?? source,
          aiModified: !!v.aiModified,
        }))
      )
      toast.success('AI drafted a version for each platform. Review before publishing.')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to adapt content')
    } finally {
      setAdapting(false)
    }
  }

  const handleUseAsIs = () => {
    if (!source.trim()) {
      toast.error('Write your post first.')
      return
    }
    if (selected.length === 0) {
      toast.error('Select at least one platform.')
      return
    }
    setResults(null)
    setDrafts(selected.map((p) => ({ platform: p, content: source, aiModified: false })))
  }

  const updateDraft = (platform: string, content: string) => {
    setDrafts((prev) =>
      prev.map((d) =>
        d.platform === platform ? { ...d, content, aiModified: false } : d
      )
    )
  }

  const handlePublish = async () => {
    if (drafts.length === 0) return
    setPublishing(true)
    try {
      const res = await fetch('/api/compose/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, drafts }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to publish')
      setResults(data?.results ?? [])
      const published = (data?.results ?? []).filter((r: PublishResult) => r.status === 'published')
      if (published.length > 0) {
        toast.success(`Published to ${published.length} platform${published.length > 1 ? 's' : ''}.`)
      } else {
        toast.info('Review the results below.')
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to publish')
    } finally {
      setPublishing(false)
    }
  }

  if (status === 'loading' || status === 'unauthenticated' || loading) {
    return (
      <Container size="md" className="py-8">
        <Skeleton className="h-[420px] rounded-xl" />
      </Container>
    )
  }

  const connectedIds = accounts.map((a) => a.platform)
  const hasConnected = connectedIds.length > 0

  return (
    <Container size="md" className="py-8">
      <PageHeader
        title="Compose"
        description="Write once. TDB adapts it for each platform and posts everywhere you choose."
      />

      {!hasConnected ? (
        <div className="mt-6 flex flex-col items-center gap-4 rounded-xl bg-muted/50 py-16 text-center">
          <Link2 className="h-12 w-12 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold">Connect a platform to start posting</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Connect at least one social account, then compose and cross-post from here.
            </p>
          </div>
          <Link href="/dashboard">
            <Button className="gap-2">
              <Link2 className="h-4 w-4" /> Connect Platforms
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {/* Compose box */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Write your update once. We'll tailor it for each platform..."
                className="min-h-[140px] resize-y"
              />

              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Post to
                </p>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.filter((p) => connectedIds.includes(p.id)).map((p) => {
                    const isSel = selected.includes(p.id)
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggle(p.id)}
                        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                          isSel
                            ? 'border-primary bg-primary/10 text-foreground'
                            : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        <PlatformIcon icon={p.icon} platformId={p.id} color={p.color} size={16} />
                        {p.name}
                        {mainPlatform === p.id ? (
                          <Badge variant="outline" className="ml-1 h-4 px-1 text-[10px]">
                            Main
                          </Badge>
                        ) : null}
                        {isSel ? <Check className="h-3.5 w-3.5 text-primary" /> : null}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={handleAdapt} disabled={adapting} className="gap-2">
                  {adapting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Adapt with AI
                </Button>
                <Button variant="outline" onClick={handleUseAsIs} disabled={adapting}>
                  Use my text as-is
                </Button>
              </div>

              <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-800 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  AI only reshapes formatting to fit each platform &mdash; it never invents,
                  removes, or changes your facts or meaning. Anything AI adjusted is clearly
                  labelled, and you can edit every version before it posts.
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Review section */}
          {drafts.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Review each version</h3>
              </div>

              {drafts.map((d) => {
                const p = getPlatform(d.platform)
                if (!p) return null
                const over = d.content.length > p.maxChars
                const result = results?.find((r) => r.platform === d.platform)
                return (
                  <Card key={d.platform}>
                    <CardContent className="space-y-3 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="flex h-7 w-7 items-center justify-center rounded-lg"
                            style={{ backgroundColor: `${p.color}15` }}
                          >
                            <PlatformIcon icon={p.icon} platformId={p.id} color={p.color} size={15} />
                          </div>
                          <span className="text-sm font-medium">{p.name}</span>
                          {d.aiModified ? (
                            <Badge className="gap-1 bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800 text-[10px]">
                              <Sparkles className="h-3 w-3" /> AI-modified
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-muted-foreground">
                              Your text
                            </Badge>
                          )}
                        </div>
                        <span
                          className={`text-xs ${over ? 'font-semibold text-destructive' : 'text-muted-foreground'}`}
                        >
                          {d.content.length}/{p.maxChars}
                        </span>
                      </div>

                      <Textarea
                        value={d.content}
                        onChange={(e) => updateDraft(d.platform, e.target.value)}
                        className="min-h-[110px] resize-y"
                      />

                      {over ? (
                        <p className="flex items-center gap-1.5 text-xs text-destructive">
                          <AlertTriangle className="h-3.5 w-3.5" /> This is longer than {p.name}
                          &apos;s recommended limit.
                        </p>
                      ) : null}

                      {!p.supportsPublish ? (
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Info className="h-3.5 w-3.5" /> {p.publishNote}
                        </p>
                      ) : null}

                      {result ? (
                        <div
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                            result.status === 'published'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : result.status === 'failed'
                                ? 'bg-destructive/10 text-destructive'
                                : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {result.status === 'published' ? (
                            <>
                              <Check className="h-3.5 w-3.5" /> Published
                              {result.publishedUrl ? (
                                <a
                                  href={result.publishedUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-1 inline-flex items-center gap-1 underline"
                                >
                                  View <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : null}
                            </>
                          ) : (
                            <>
                              <Info className="h-3.5 w-3.5" />
                              {result.status === 'failed' ? 'Not posted' : 'Skipped'}
                              {result.error ? `: ${result.error}` : ''}
                            </>
                          )}
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                )
              })}

              <div className="flex justify-end">
                <Button onClick={handlePublish} disabled={publishing} className="gap-2">
                  {publishing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Publish to {drafts.length} platform{drafts.length > 1 ? 's' : ''}
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </Container>
  )
}
