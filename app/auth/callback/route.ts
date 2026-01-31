
import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/app/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // Setup successful login, redirect to specific page
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // Handle OAuth callback (code)
  const code = searchParams.get('code')
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
        // IMPORTANT: Sync user to public table if not exists
        // Get the session user
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
             // Check if user exists in public table
            const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .eq('id', user.id)
                .single()

            if (!existingUser) {
                 // Insert usage public profile
                 await supabase.from('users').insert({
                     id: user.id,
                     email: user.email!,
                     name: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
                     image: user.user_metadata.avatar_url,
                 })
            }
        }
        
        return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(new URL('/login?error=auth_code_error', request.url))
}
