import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  type LucideIcon,
} from 'lucide-react'

export interface PlatformConfig {
  id: string
  name: string
  icon: LucideIcon | null
  color: string
  bgColor: string
  textColor: string
  authUrl: string
  callbackPath: string
  scopes: string
  envClientId: string
  envClientSecret: string
  description: string
}

export const PLATFORMS: PlatformConfig[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: '#1877F2',
    bgColor: 'bg-[#1877F2]',
    textColor: 'text-[#1877F2]',
    authUrl: 'https://www.facebook.com/v19.0/dialog/oauth',
    callbackPath: '/api/auth/facebook/callback',
    scopes: 'public_profile,email',
    envClientId: 'FACEBOOK_APP_ID',
    envClientSecret: 'FACEBOOK_APP_SECRET',
    description: 'Connect your Facebook account to view your feed and posts.',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: '#E4405F',
    bgColor: 'bg-gradient-to-br from-[#833AB4] via-[#E4405F] to-[#FCAF45]',
    textColor: 'text-[#E4405F]',
    authUrl: 'https://api.instagram.com/oauth/authorize',
    callbackPath: '/api/auth/instagram/callback',
    scopes: 'user_profile,user_media',
    envClientId: 'INSTAGRAM_APP_ID',
    envClientSecret: 'INSTAGRAM_APP_SECRET',
    description: 'Connect Instagram to see your photos and stories.',
  },
  {
    id: 'threads',
    name: 'Threads',
    icon: null,
    color: '#000000',
    bgColor: 'bg-black dark:bg-white',
    textColor: 'text-black dark:text-white',
    authUrl: 'https://threads.net/oauth/authorize',
    callbackPath: '/api/auth/threads/callback',
    scopes: 'threads_basic,threads_content_publish',
    envClientId: 'THREADS_APP_ID',
    envClientSecret: 'THREADS_APP_SECRET',
    description: 'Connect Threads to view and share text posts.',
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: Twitter,
    color: '#000000',
    bgColor: 'bg-black dark:bg-white',
    textColor: 'text-black dark:text-white',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    callbackPath: '/api/auth/twitter/callback',
    scopes: 'tweet.read users.read offline.access',
    envClientId: 'TWITTER_CLIENT_ID',
    envClientSecret: 'TWITTER_CLIENT_SECRET',
    description: 'Connect X to see your timeline and tweets.',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: '#0A66C2',
    bgColor: 'bg-[#0A66C2]',
    textColor: 'text-[#0A66C2]',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    callbackPath: '/api/auth/linkedin/callback',
    scopes: 'openid profile email',
    envClientId: 'LINKEDIN_CLIENT_ID',
    envClientSecret: 'LINKEDIN_CLIENT_SECRET',
    description: 'Connect LinkedIn to view professional updates.',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: Youtube,
    color: '#FF0000',
    bgColor: 'bg-[#FF0000]',
    textColor: 'text-[#FF0000]',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    callbackPath: '/api/auth/youtube/callback',
    scopes: 'https://www.googleapis.com/auth/youtube.readonly',
    envClientId: 'GOOGLE_CLIENT_ID',
    envClientSecret: 'GOOGLE_CLIENT_SECRET',
    description: 'Connect YouTube to see your subscriptions and videos.',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: null,
    color: '#000000',
    bgColor: 'bg-black dark:bg-white',
    textColor: 'text-black dark:text-white',
    authUrl: 'https://www.tiktok.com/v2/auth/authorize/',
    callbackPath: '/api/auth/tiktok/callback',
    scopes: 'user.info.basic,video.list',
    envClientId: 'TIKTOK_CLIENT_KEY',
    envClientSecret: 'TIKTOK_CLIENT_SECRET',
    description: 'Connect TikTok to see your videos and trends.',
  },
]

export function getPlatform(id: string): PlatformConfig | undefined {
  return PLATFORMS.find((p) => p.id === id)
}

export function isPlatformConfigured(platformId: string): boolean {
  const platform = getPlatform(platformId)
  if (!platform) return false
  const clientId = process.env[platform.envClientId]
  const clientSecret = process.env[platform.envClientSecret]
  return !!(clientId && clientSecret)
}
