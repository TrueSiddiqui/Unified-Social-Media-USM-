'use client'

import Link from 'next/link'
import { useCurrentYear } from '@/hooks/use-current-year'

export function Footer() {
  const year = useCurrentYear()
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 text-sm text-muted-foreground md:flex-row md:py-4">
        <div>
          © {year ?? ''} TrueSiddiqui. All rights reserved.
        </div>
        <nav className="flex gap-4">
          <Link 
            href="/privacy" 
            className="hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
          <Link 
            href="/terms" 
            className="hover:text-foreground transition-colors"
          >
            Terms of Service
          </Link>
          <a 
            href="https://github.com/TrueSiddiqui/Unified-Social-Media-USM-" 
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  )
}
