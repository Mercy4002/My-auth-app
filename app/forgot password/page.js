'use client'
import { useState } from 'react'
import { createClient } from '@/lib/Supabase'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const supabase = createClient()

  async function handleReset() {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`
    })
    setMessage(error ? error.message : 'Check your email for a reset link!')
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
      <h1>Reset password</h1>
      <input placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8 }}/>
      <button onClick={handleReset} style={{ width: '100%', padding: 10 }}>Send reset link</button>
      {message && <p>{message}</p>}
    </div>
  )
}