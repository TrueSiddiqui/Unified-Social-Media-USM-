'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/layouts/container'
import { PageHeader } from '@/components/layouts/page-header'
import { PlatformCard } from '@/components/platform-card'
import { PLATFORMS } from '@/lib/platforms'
import { Skeleton } from '@/components/ui/skeleton'

interface SocialAccountInfo {
  platform: string
  profileName: string | null
  profileImage: string | null
}

interface PlatformStatus {
  id: string
  configured: boolean
}

export function DashboardContent() {
  const { data: session, status } = useSession() || {}
  const router = useRouter()
  const [accounts, setAccounts] = useState<SocialAccountInfo[]>([])
  const [platformStatuses, setPlatformStatuses] = useState<PlatformStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [status, router])

  const fetchData = useCallback(async () => {
    try {
      const [accountsRes, statusRes] = await Promise.all([
        fetch('/api/social/accounts'),
        fetch('/api/social/status'),
      ])
      if (accountsRes.ok) {
        const data = await accountsRes.json()
        setAccounts(data?.accounts ?? [])
      }
      if (statusRes.ok) {
        const data = await statusRes.json()
        setPlatformStatuses(data?.platforms ?? [])
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData()
    }
  }, [status, fetchData])

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <Container size="lg" className="py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-[220px] rounded-xl" />
          ))}
        </div>
      </Container>
    )
  }

  const isConnected = (platformId: string) =>
    accounts.some((a: SocialAccountInfo) => a.platform === platformId)

  const isConfigured = (platformId: string) =>
    platformStatuses.some((s: PlatformStatus) => s.id === platformId && s.configured)

  const getAccount = (platformId: string) =>
    accounts.find((a: SocialAccountInfo) => a.platform === platformId)

  const handleConnect = (platformId: string) => {
    window.location.href = `/api/social/connect/${platformId}`
  }

  return (
    <Container size="lg" className="py-8">
      <PageHeader
        title="Dashboard"
        description="Connect and manage your social media accounts."
      />
      {loading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-[220px] rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {PLATFORMS.map((p) => {
            const account = getAccount(p.id)
            return (
              <PlatformCard
                key={p.id}
                id={p.id}
                name={p.name}
                icon={p.icon}
                color={p.color}
                description={p.description}
                isConnected={isConnected(p.id)}
                isConfigured={isConfigured(p.id)}
                profileName={account?.profileName}
                profileImage={account?.profileImage}
                onConnect={() => handleConnect(p.id)}
                onDisconnect={() => fetchData()}
              />
            )
          })}
        </div>
      )}
    </Container>
  )
}
