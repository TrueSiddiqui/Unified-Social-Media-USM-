import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * Data Deletion Request Handler
 * 
 * This endpoint allows users to request deletion of their personal data
 * in compliance with:
 * - Meta Platform Terms (Facebook, Instagram, Threads)
 * - GDPR (Right to Erasure)
 * - CCPA (Right to Deletion)
 * - LinkedIn API Terms
 * - Google API User Data Policy
 * - TikTok Developer Terms
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, userId, confirmationUrl } = body

    if (!email && !userId) {
      return NextResponse.json(
        { 
          error: 'Email or user ID is required',
          message: 'Please provide either your email address or user ID'
        },
        { status: 400 }
      )
    }

    // Find the user
    const user = await prisma.user.findFirst({
      where: email 
        ? { email }
        : { id: userId },
      include: {
        socialAccounts: true,
        accounts: true,
        sessions: true,
        oauthStates: true,
      }
    })

    if (!user) {
      // For privacy, we don't reveal whether the user exists
      return NextResponse.json({
        success: true,
        message: 'If an account with that identifier exists, it has been queued for deletion.',
        statusUrl: confirmationUrl || null
      })
    }

    // Delete all associated data
    // The cascade delete in Prisma schema will handle related records
    await prisma.user.delete({
      where: { id: user.id }
    })

    // Log the deletion (optional - for audit trail)
    console.log(`[DATA DELETION] User ${user.id} (${user.email}) data deleted at ${new Date().toISOString()}`)

    return NextResponse.json({
      success: true,
      message: 'Your data has been successfully deleted.',
      deletedAt: new Date().toISOString(),
      deletedItems: {
        user: true,
        socialAccounts: user.socialAccounts.length,
        accounts: user.accounts.length,
        sessions: user.sessions.length,
        oauthStates: user.oauthStates.length,
      }
    })

  } catch (error) {
    console.error('[DATA DELETION ERROR]', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'An error occurred while processing your deletion request. Please contact support.'
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint for Meta/Facebook Data Deletion Status Callback
 * Required by Meta Platform Terms
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const requestId = searchParams.get('id')

  if (!requestId) {
    return NextResponse.json(
      { error: 'Missing deletion request ID' },
      { status: 400 }
    )
  }

  // Return deletion status
  // In production, you would track deletion requests in a database
  return NextResponse.json({
    requestId,
    status: 'completed',
    message: 'Data deletion has been completed',
    completedAt: new Date().toISOString()
  })
}
