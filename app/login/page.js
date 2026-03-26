'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [message, setMessage]     = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const router   = useRouter()
  const supabase = createClient()

  async function handleLogin() {
    if (!email || !password) {
      setMessage('Please fill in both fields.')
      return
    }
    setIsLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setIsLoading(false)
    if (error) {
      setMessage(error.message)
    } else {
      router.push('/dashboard')
    }
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Nunito:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --blue-deep:   #2c5282;
          --blue-mid:    #3a6fa8;
          --blue-soft:   #4a85c0;
          --blue-pale:   #ebf4ff;
          --blue-tint:   #d6e8f8;
          --blue-focus:  #3a6fa8;
          --blue-btn:    #2c5282;
          --blue-btn-h:  #245074;
          --white:       #ffffff;
          --ink:         #1a2e44;
          --ink-muted:   #4a6580;
          --ink-hint:    #7a96b0;
          --border-idle: #b8d0e8;
          --shadow-btn:  0 4px 18px rgba(44,82,130,0.28);
          --shadow-card: 0 2px 16px rgba(44,82,130,0.10);
          --radius:      14px;
          --radius-sm:   10px;
        }

        body { background: var(--blue-pale); }

        .page-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'Nunito', sans-serif;
        }

        /* ════════════════════════
           LEFT PANEL
        ════════════════════════ */
        .left-panel {
          position: relative;
          background: linear-gradient(160deg, var(--blue-deep) 0%, var(--blue-mid) 55%, #5592cc 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 52px 48px;
          overflow: hidden;
        }
        .left-panel::before {
          content: '';
          position: absolute;
          top: -100px; left: -100px;
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(255,255,255,0.13) 0%, transparent 65%);
          pointer-events: none;
        }
        .left-panel::after {
          content: '';
          position: absolute;
          bottom: -80px; right: -80px;
          width: 360px; height: 360px;
          background: radial-gradient(circle, rgba(255,220,160,0.09) 0%, transparent 65%);
          pointer-events: none;
        }
        .l-dots {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px);
          background-size: 30px 30px;
          pointer-events: none;
        }

        /* Brand */
        .brand {
          position: relative; z-index: 2;
          display: flex; align-items: center; gap: 11px;
        }
        .brand-mark {
          width: 38px; height: 38px;
          background: rgba(255,255,255,0.18);
          border: 1.5px solid rgba(255,255,255,0.32);
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
        }
        .brand-mark svg { width: 19px; height: 19px; }
        .brand-name {
          font-family: 'Lora', serif;
          font-size: 20px; font-weight: 600;
          color: #fff; letter-spacing: 0.04em;
        }

        /* Left body */
        .left-body { position: relative; z-index: 2; }

        .l-badge {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.13em; text-transform: uppercase;
          color: rgba(255,255,255,0.88);
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.24);
          padding: 6px 15px; border-radius: 100px;
          margin-bottom: 28px;
        }
        .l-badge-dot { width: 7px; height: 7px; background: #a8d8ff; border-radius: 50%; }

        /* Welcome-back illustration */
        .wave-illustration {
          width: 88px; height: 88px;
          background: rgba(255,255,255,0.14);
          border: 1.5px solid rgba(255,255,255,0.24);
          border-radius: 24px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 28px;
        }
        .wave-illustration svg { width: 44px; height: 44px; }

        .l-heading {
          font-family: 'Lora', serif;
          font-size: 48px; font-weight: 400; line-height: 1.12;
          color: #fff; margin-bottom: 18px;
        }
        .l-heading em { font-style: italic; color: #c9e4ff; }

        .l-sub {
          font-size: 15px; font-weight: 300;
          color: rgba(255,255,255,0.70); line-height: 1.78;
          max-width: 310px; margin-bottom: 36px;
        }

        /* Testimonial / quote card */
        .quote-card {
          background: rgba(255,255,255,0.11);
          border: 1px solid rgba(255,255,255,0.20);
          border-radius: var(--radius);
          padding: 22px 24px;
        }
        .quote-mark {
          font-family: 'Lora', serif;
          font-size: 48px; line-height: 0.8;
          color: rgba(255,255,255,0.30);
          margin-bottom: 8px;
          display: block;
        }
        .quote-text {
          font-size: 14px; font-weight: 300;
          color: rgba(255,255,255,0.80);
          line-height: 1.70; font-style: italic;
          margin-bottom: 16px;
        }
        .quote-author {
          display: flex; align-items: center; gap: 12px;
        }
        .q-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(255,255,255,0.22);
          border: 1.5px solid rgba(255,255,255,0.30);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: #fff;
          flex-shrink: 0;
        }
        .q-name {
          font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.90);
        }
        .q-role {
          font-size: 11px; font-weight: 300; color: rgba(255,255,255,0.55);
          margin-top: 2px;
        }

        /* Footer */
        .l-footer { position: relative; z-index: 2; }
        .trust-card {
          background: rgba(255,255,255,0.11);
          border: 1px solid rgba(255,255,255,0.20);
          border-radius: var(--radius);
          padding: 16px 20px;
          display: flex; align-items: center; gap: 16px;
        }
        .av-stack { display: flex; }
        .av {
          width: 30px; height: 30px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.40);
          margin-left: -7px;
          background: rgba(255,255,255,0.20);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600; color: #fff;
        }
        .av:first-child { margin-left: 0; }
        .trust-copy { font-size: 13px; color: rgba(255,255,255,0.80); font-weight: 300; }
        .trust-copy strong { color: #fff; font-weight: 600; }

        /* ════════════════════════
           RIGHT PANEL
        ════════════════════════ */
        .right-panel {
          display: flex; align-items: center; justify-content: center;
          padding: 52px 60px;
          background: var(--blue-pale);
        }

        .form-card { width: 100%; max-width: 400px; }

        /* Icon header */
        .form-icon {
          width: 60px; height: 60px;
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          border: 2px solid var(--blue-tint);
          border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 22px;
          box-shadow: 0 4px 14px rgba(44,82,130,0.12);
        }
        .form-icon svg { width: 28px; height: 28px; }

        .form-eyebrow {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--blue-soft); margin-bottom: 8px;
        }
        .form-title {
          font-family: 'Lora', serif;
          font-size: 32px; font-weight: 600;
          color: var(--ink); margin-bottom: 6px; line-height: 1.18;
        }
        .form-sub {
          font-size: 14px; font-weight: 300;
          color: var(--ink-muted); margin-bottom: 30px;
        }
        .form-sub a { color: var(--blue-focus); text-decoration: none; font-weight: 600; }
        .form-sub a:hover { text-decoration: underline; }

        /* Google button */
        .google-btn {
          width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 13px 16px;
          background: var(--white);
          border: 2px solid var(--border-idle);
          border-radius: var(--radius-sm);
          color: var(--ink);
          font-family: 'Nunito', sans-serif;
          font-size: 14px; font-weight: 600;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
          margin-bottom: 22px;
          box-shadow: var(--shadow-card);
          letter-spacing: 0.01em;
        }
        .google-btn:hover {
          border-color: var(--blue-focus);
          box-shadow: 0 0 0 4px rgba(58,111,168,0.12);
          transform: translateY(-1px);
        }
        .google-btn:active { transform: translateY(0); }
        .g-icon { width: 18px; height: 18px; flex-shrink: 0; }

        /* Divider */
        .divider {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 22px;
        }
        .div-line { flex: 1; height: 1.5px; background: var(--blue-tint); }
        .div-text  { font-size: 12px; color: var(--ink-hint); letter-spacing: 0.06em; font-weight: 500; }

        /* Fields */
        .field { margin-bottom: 18px; }
        .field-label-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 8px;
        }
        .field-label-row span {
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.04em; color: var(--ink);
        }
        .forgot-link {
          font-size: 12px; font-weight: 600;
          color: var(--blue-soft); text-decoration: none;
          transition: color 0.2s;
        }
        .forgot-link:hover { color: var(--blue-deep); text-decoration: underline; }

        .input-wrap { position: relative; display: flex; align-items: center; }
        .input-icon {
          position: absolute; left: 14px;
          width: 18px; height: 18px;
          color: var(--ink-hint);
          pointer-events: none;
          transition: color 0.2s;
          flex-shrink: 0;
        }
        .input-wrap.focused .input-icon { color: var(--blue-focus); }

        .field input {
          width: 100%;
          padding: 14px 16px 14px 42px;
          background: var(--white);
          border: 2px solid var(--border-idle);
          border-radius: var(--radius-sm);
          color: var(--ink);
          font-family: 'Nunito', sans-serif;
          font-size: 15px; font-weight: 400;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-shadow: 0 1px 4px rgba(44,82,130,0.07);
        }
        .field input::placeholder { color: var(--ink-hint); font-weight: 300; }
        .field input:focus {
          border-color: var(--blue-focus);
          box-shadow: 0 0 0 4px rgba(58,111,168,0.16);
          background: #fff;
        }
        .field input:not(:placeholder-shown) {
          border-color: #8ab4d8;
          background: #f5faff;
        }

        /* Submit */
        .submit-btn {
          width: 100%;
          padding: 15px;
          background: var(--blue-btn);
          border: none;
          border-radius: var(--radius-sm);
          color: #fff;
          font-family: 'Nunito', sans-serif;
          font-size: 15px; font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0.03em;
          box-shadow: var(--shadow-btn);
          margin-top: 4px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .submit-btn:hover:not(:disabled) {
          background: var(--blue-btn-h);
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(44,82,130,0.34);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.52; cursor: not-allowed; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* Divider between primary + secondary actions */
        .or-divider {
          display: flex; align-items: center; gap: 14px;
          margin: 20px 0;
        }
        .or-line { flex: 1; height: 1.5px; background: var(--blue-tint); }
        .or-text  { font-size: 12px; color: var(--ink-hint); letter-spacing: 0.06em; font-weight: 500; }

        /* Secondary outlined button */
        .secondary-btn {
          width: 100%;
          padding: 13px;
          background: transparent;
          border: 2px solid var(--border-idle);
          border-radius: var(--radius-sm);
          color: var(--ink-muted);
          font-family: 'Nunito', sans-serif;
          font-size: 14px; font-weight: 600;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, box-shadow 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          text-decoration: none;
        }
        .secondary-btn:hover {
          border-color: var(--blue-focus);
          color: var(--blue-focus);
          box-shadow: 0 0 0 3px rgba(58,111,168,0.10);
        }
        .secondary-btn svg { width: 16px; height: 16px; }

        /* Terms */
        .terms {
          margin-top: 16px; text-align: center;
          font-size: 12px; color: var(--ink-hint);
          font-weight: 300; line-height: 1.65;
        }
        .terms a { color: var(--blue-focus); text-decoration: none; font-weight: 500; }
        .terms a:hover { text-decoration: underline; }

        /* Message */
        .message {
          margin-top: 18px; padding: 13px 16px;
          border-radius: var(--radius-sm);
          font-size: 14px; text-align: center; font-weight: 500;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .message.error { background: #fff5f5; border: 1.5px solid #fca5a5; color: #b91c1c; }

        @media (max-width: 800px) {
          .page-root   { grid-template-columns: 1fr; }
          .left-panel  { display: none; }
          .right-panel { padding: 40px 24px; }
        }
      `}</style>

      <div className="page-root">

        {/* ══ LEFT PANEL ══ */}
        <div className="left-panel">
          <div className="l-dots" />

          <div className="brand">
            <div className="brand-mark">
              <svg viewBox="0 0 19 19" fill="none">
                <path d="M9.5 2L16.5 6.25V13.75L9.5 18L2.5 13.75V6.25L9.5 2Z"
                  stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <circle cx="9.5" cy="9.5" r="2.2" fill="white"/>
              </svg>
            </div>
            <span className="brand-name">AuthApp</span>
          </div>

          <div className="left-body">
            <span className="l-badge"><span className="l-badge-dot"/>Welcome back</span>

            {/* Wave / welcome illustration */}
            <div className="wave-illustration">
              <svg viewBox="0 0 44 44" fill="none">
                <circle cx="22" cy="16" r="7"
                  fill="rgba(255,255,255,0.25)" stroke="white" strokeWidth="1.8"/>
                <path d="M8 38c0-7.732 6.268-14 14-14s14 6.268 14 14"
                  stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M32 10l2 2-2 2M36 12h-4"
                  stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h1 className="l-heading">Good to see<br /><em>you again.</em></h1>
            <p className="l-sub">
              Sign in with your email or Google account. Either way, you land on the same dashboard.
            </p>

            {/* Testimonial card */}
            <div className="quote-card">
              <span className="quote-mark">"</span>
              <p className="quote-text">
                Setting this up took less than a day. The Google login and email login both route to the same place — exactly what I needed.
              </p>
              <div className="quote-author">
                <div className="q-avatar">S</div>
                <div>
                  <p className="q-name">Sarah K.</p>
                  <p className="q-role">Product Designer</p>
                </div>
              </div>
            </div>
          </div>

          <div className="l-footer">
            <div className="trust-card">
              <div className="av-stack">
                {['M','K','T','A'].map((l, i) => (
                  <div className="av" key={i}>{l}</div>
                ))}
              </div>
              <p className="trust-copy"><strong>2,400+ users</strong> already on board</p>
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="right-panel">
          <div className="form-card">

            {/* Icon */}
            <div className="form-icon">
              <svg viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="10" r="5"
                  stroke="#2c5282" strokeWidth="1.8"/>
                <path d="M5 26c0-4.97 4.03-9 9-9s9 4.03 9 9"
                  stroke="#2c5282" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>

            <p className="form-eyebrow">Welcome back</p>
            <h2 className="form-title">Sign in to your account</h2>
            <p className="form-sub">
              New here? <a href="/signup">Create a free account</a>
            </p>

            {/* Google */}
            <button className="google-btn" onClick={handleGoogleLogin} type="button">
              <svg className="g-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="divider">
              <div className="div-line"/>
              <span className="div-text">or sign in with email</span>
              <div className="div-line"/>
            </div>

            {/* Email */}
            <div className="field">
              <div className="field-label-row">
                <span>Email address</span>
              </div>
              <div className={`input-wrap${focusedField === 'email' ? ' focused' : ''}`}>
                <svg className="input-icon" viewBox="0 0 20 20" fill="none"
                  stroke="currentColor" strokeWidth="1.6">
                  <path d="M2.5 5.5h15l-7.5 7-7.5-7z" strokeLinejoin="round"/>
                  <path d="M2.5 5.5v9h15v-9" strokeLinejoin="round"/>
                </svg>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="field">
              <div className="field-label-row">
                <span>Password</span>
                <a href="/forgot-password" className="forgot-link">Forgot password?</a>
              </div>
              <div className={`input-wrap${focusedField === 'password' ? ' focused' : ''}`}>
                <svg className="input-icon" viewBox="0 0 20 20" fill="none"
                  stroke="currentColor" strokeWidth="1.6">
                  <rect x="4" y="9" width="12" height="9" rx="2" strokeLinejoin="round"/>
                  <path d="M7 9V6.5a3 3 0 0 1 6 0V9" strokeLinecap="round"/>
                </svg>
                <input
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              className="submit-btn"
              onClick={handleLogin}
              disabled={isLoading}
              type="button"
            >
              {isLoading
                ? <><div className="spinner"/> Signing in…</>
                : <>Sign in →</>
              }
            </button>

            <div className="or-divider">
              <div className="or-line"/>
              <span className="or-text">new to AuthApp?</span>
              <div className="or-line"/>
            </div>

            <a href="/signup" className="secondary-btn">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M8 3v10M3 8h10" strokeLinecap="round"/>
              </svg>
              Create a free account
            </a>

            <p className="terms">
              By signing in you agree to our{' '}
              <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </p>

            {message && (
              <div className="message error">! {message}</div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}