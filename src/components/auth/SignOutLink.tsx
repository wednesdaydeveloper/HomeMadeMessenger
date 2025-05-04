'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

const SignOutLink = () => {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault()
        handleSignOut()
      }}
      style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
    >
      Sign out
    </a>
  )
}

export default SignOutLink