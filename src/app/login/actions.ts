'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { LoginForm } from './models'
import { SubmitHandler } from 'react-hook-form'
import { Provider } from '@supabase/supabase-js'

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

const signInWith = (provider: Provider) => async () => {
  const supabase = await createClient()
  const authUrl = (
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
    )
    + '/auth/callback?next=/todolist'
  console.log('authUrl: ', authUrl)
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: authUrl
    }
  })

  if (error) {
    console.error('Error signing in:', error)
  } else {
    redirect(data.url)
  }
}

const signInWithGoogle = signInWith('google')

export { login, signup, signInWithGoogle }