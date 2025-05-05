'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { login, signup } from '@/app/login/actions'
import { LoginForm } from './models'
import GoogleSignInForm from '@/components/auth/GoogleSignInForm'


export default function Login() {
  // フォームを初期化する
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <>
      <div className='min-h-screen flex flex-col justify-center bg-gray-100'>
        <div className='flex justify-center mt-4 rounded-md'>
          <form className='shadow-md w-96 px-8 py-8 border border-gray-300 rounded-md'>
            <div className='w-full mt-4'>
              <label className='font-bold'>E-mail</label>
              <input data-testid='email'
                placeholder='sample@email.com'
                type='email'
                {...register('email', {
                  required: 'メールアドレスは必須です。',
                  pattern: {
                    value: /([a-z\d+\-.]@[a-z\d-]+(?:\.[a-z]+)*)/i,
                    message: 'メールアドレスの形式が不正です。'
                  }
                })}
                name='email'
                defaultValue={email}
                className='block rounded-md w-full text-sm border border-gray-300 text-gray-900 px-2 py-2'
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className='text-red-500' data-testid='email-error'>{errors.email?.message}</div>
            </div>
            <div className='w-full mt-4'>
              <label className='font-bold'>パスワード</label>
              <input data-testid='password'
                type='password'
                {...register('password', {
                  required: 'パスワードは必須です。'
                })}
                name='password'
                defaultValue={password}
                className='block rounded-md w-full text-sm border border-gray-300 text-gray-900 px-2 py-2'
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className='text-red-500' data-testid='password-error'>{errors.password?.message}</div>
            </div>
            <div className='flex items-center justify-center mt-4 mb-4'>
              <button onClick={handleSubmit(login)} className='shadow-md bg-blue-500 text-white font-bold rounded-md px-4 py-4'>
                ログイン
              </button>
              <button onClick={handleSubmit(signup)} className='shadow-md bg-blue-500 text-white font-bold rounded-md px-4 py-4'>
                登録
              </button>
            </div>
          </form>
        </div>
        <div className='flex justify-center mt-4 '>
          <GoogleSignInForm />
        </div>
      </div>
    </>
  )
}