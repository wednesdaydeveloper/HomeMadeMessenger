'use client '
import { signInWithGoogle } from '@/app/login/actions'
import React from 'react'
function GoogleSignInForm() {
  return (
    <div>
      <form className="w-full max-w-sm p-4 rounded shadow-md">
        <button className='btn btn-primary w-full' formAction={signInWithGoogle}>
          Sign in with Google
        </button>
      </form>
    </div>
  )
}
export default GoogleSignInForm