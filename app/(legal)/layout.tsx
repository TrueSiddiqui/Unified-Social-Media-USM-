import { Container } from '@/components/layouts/container'
import Link from 'next/link'

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-sm font-medium hover:underline">
              ← Back to USM
            </Link>
            <div className="flex gap-4">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
            </div>
          </div>
        </Container>
      </nav>
      {children}
    </div>
  )
}
