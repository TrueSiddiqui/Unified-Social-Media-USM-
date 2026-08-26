import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layouts/container'
import { Section } from '@/components/layouts/section'
import { ThemeToggle } from '@/components/theme-toggle'
import { Zap, Rss, Shield, Layers, ArrowRight } from 'lucide-react'
import { LandingPlatforms } from '@/components/landing-platforms'

const features = [
  {
    icon: Layers,
    title: 'All Platforms, One View',
    description: 'Connect Facebook, Instagram, Threads, X, LinkedIn, YouTube, and TikTok in a single dashboard.',
  },
  {
    icon: Rss,
    title: 'Unified Feed',
    description: 'See posts from all your connected platforms in one chronological timeline.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your tokens are encrypted and your data stays under your control.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
            <Zap className="h-6 w-6 text-primary" />
            <span>SocialHub</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="gap-1">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <Section className="hero-gradient">
        <Container size="lg">
          <div className="flex flex-col items-center py-20 text-center md:py-32">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/50 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm">
              <Zap className="h-4 w-4 text-primary" />
              All your social media in one place
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Your Social Media,{' '}
              <span className="text-primary">Unified</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Connect all your favorite platforms and view everything from a single, beautiful dashboard. No more switching between apps.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="gap-2 px-8">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* Platforms */}
      <Section>
        <Container size="lg">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight">Connect Your Platforms</h2>
            <p className="mt-3 text-muted-foreground">Seven platforms. One dashboard. Zero hassle.</p>
          </div>
          <LandingPlatforms />
        </Container>
      </Section>

      {/* Features */}
      <Section className="bg-muted/30">
        <Container size="lg">
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="flex flex-col items-center rounded-xl bg-card p-8 text-center shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold tracking-tight">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              )
            })}
          </div>
        </Container>
      </Section>

      {/* Footer */}
      <footer className="border-t py-8">
        <Container size="lg">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4" /> SocialHub
            </div>
            <p className="text-xs text-muted-foreground">
              Manage all your social media from one place.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  )
}
