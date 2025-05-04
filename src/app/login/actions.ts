'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const reuslt = await supabase.auth.signInWithPassword(data)
  console.log('error', JSON.stringify(reuslt.error))
  if (reuslt.error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const reuslt = await supabase.auth.signUp(data)
  console.log('error', JSON.stringify(reuslt.error))

  if (reuslt.error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}