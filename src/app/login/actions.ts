'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { LoginForm } from './models'
import { SubmitHandler } from 'react-hook-form'

const login = async (formData: LoginForm): Promise<SubmitHandler<LoginForm>> =>  {
  const supabase = await createClient()
  const { error }  = await supabase.auth.signInWithPassword(formData)
  if (error) {
    redirect('/error')
  } else {
    revalidatePath('/', 'layout')
    redirect('/todolist')
  }
}

const signup = async (formData: LoginForm): Promise<SubmitHandler<LoginForm>> => {
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp(formData)

  if (error) {
    redirect('/error')
  } else {
    revalidatePath('/', 'layout')
    redirect('/login')
  }
}

export { login, signup }