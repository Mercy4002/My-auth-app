'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail]         = useState('')
  const [message, setMessage]     = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [focused, setFocused]     = useState(false)
  const supabase = createClient()

  async function handleReset() {
    if (!email) { setMessage('Please enter your email address.'); setIsSuccess(false); return }
    setIsLoading(true); setMessage('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`
    })
    setIsLoading(false)
    if (error) { setMessage(error.message); setIsSuccess(false) }
    else        { setMessage('Reset link sent! Check your inbox and spam folder.'); setIsSuccess(true) }
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

        /* Centre illustration area */
        .left-body {
          position: relative; z-index: 2;
          display: flex; flex-direction: column; align-items: flex-start;
        }

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

        /* Lock illustration */
        .lock-illustration {
          width: 88px; height: 88px;
          background: rgba(255,255,255,0.14);
          border: 1.5px solid rgba(255,255,255,0.24);
          border-radius: 24px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 28px;
        }
        .lock-illustration svg { width: 42px; height: 42px; }

        .l-heading {
          font-family: 'Lora', serif;
          font-size: 46px; font-weight: 400; line-height: 1.14;
          color: #fff; margin-bottom: 18px;
        }
        .l-heading em { font-style: italic; color: #c9e4ff; }

        .l-sub {
          font-size: 15px; font-weight: 300;
          color: rgba(255,255,255,0.70); line-height: 1.78;
          max-width: 310px; margin-bottom: 36px;
        }

        /* Steps card */
        .steps-card {
          background: rgba(255,255,255,0.11);
          border: 1px solid rgba(255,255,255,0.20);
          border-radius: var(--radius);
          padding: 22px 24px;
          width: 100%;
        }
        .steps-title {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(255,255,255,0.60);
          margin-bottom: 16px;
        }
        .steps-list { list-style: none; display: flex; flex-direction: column; gap: 14px; }
        .step-item { display: flex; align-items: flex-start; gap: 14px; }
        .step-num {
          width: 24px; height: 24px; flex-shrink: 0;
          background: rgba(255,255,255,0.18);
          border: 1px solid rgba(255,255,255,0.28);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: #fff;
          margin-top: 1px;
        }
        .step-copy {}
        .step-copy strong {
          display: block;
          font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.90);
          margin-bottom: 2px;
        }
        .step-copy span {
          font-size: 12px; font-weight: 300; color: rgba(255,255,255,0.58);
          line-height: 1.5;
        }

        /* Footer */
        .l-footer { position: relative; z-index: 2; }
        .back-link {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 13px; font-weight: 600;
          color: rgba(255,255,255,0.70);
          text-decoration: none;
          transition: color 0.2s;
        }
        .back-link:hover { color: #fff; }
        .back-link svg { width: 16px; height: 16px; }

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
          color: var(--ink); margin-bottom: 10px; line-height: 1.18;
        }
        .form-sub {
          font-size: 14px; font-weight: 300;
          color: var(--ink-muted); margin-bottom: 30px;
          line-height: 1.65;
        }
        .form-sub a { color: var(--blue-focus); text-decoration: none; font-weight: 600; }
        .form-sub a:hover { text-decoration: underline; }

        /* Field */
        .field { margin-bottom: 22px; }
        .field-label {
          display: block;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--ink);
          margin-bottom: 8px;
        }
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

        /* Helper text */
        .field-hint {
          margin-top: 8px;
          font-size: 12px; font-weight: 300;
          color: var(--ink-hint); line-height: 1.5;
          display: flex; align-items: flex-start; gap: 6px;
        }
        .field-hint svg { width: 14px; height: 14px; flex-shrink: 0; margin-top: 1px; color: var(--blue-soft); }

        /* Submit button */
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

        /* Divider */
        .or-divider {
          display: flex; align-items: center; gap: 14px;
          margin: 22px 0;
        }
        .or-line { flex: 1; height: 1.5px; background: var(--blue-tint); }
        .or-text  { font-size: 12px; color: var(--ink-hint); letter-spacing: 0.06em; font-weight: 500; }

        /* Secondary back button */
        .back-btn {
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
        .back-btn:hover {
          border-color: var(--blue-focus);
          color: var(--blue-focus);
          box-shadow: 0 0 0 3px rgba(58,111,168,0.10);
        }
        .back-btn svg { width: 16px; height: 16px; }

        /* Success state */
        .success-state {
          text-align: center;
          padding: 8px 0;
        }
        .success-icon {
          width: 68px; height: 68px;
          background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
          border: 2px solid #86efac;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
          box-shadow: 0 4px 16px rgba(22,163,74,0.15);
        }
        .success-icon svg { width: 30px; height: 30px; }
        .success-title {
          font-family: 'Lora', serif;
          font-size: 26px; font-weight: 600;
          color: var(--ink); margin-bottom: 10px;
        }
        .success-msg {
          font-size: 14px; font-weight: 300;
          color: var(--ink-muted); line-height: 1.70;
          margin-bottom: 28px;
        }
        .success-msg strong { color: var(--ink); font-weight: 600; }

        /* Message */
        .message {
          margin-top: 18px; padding: 13px 16px;
          border-radius: var(--radius-sm);
          font-size: 14px; text-align: center; font-weight: 500;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .message.error   { background: #fff5f5; border: 1.5px solid #fca5a5; color: #b91c1c; }

        /* Terms */
        .terms {
          margin-top: 16px; text-align: center;
          font-size: 12px; color: var(--ink-hint);
          font-weight: 300; line-height: 1.65;
        }
        .terms a { color: var(--blue-focus); text-decoration: none; font-weight: 500; }
        .terms a:hover { text-decoration: underline; }

        @media (max-width: 800px) {
          .page-root    { grid-template-columns: 1fr; }
          .left-panel   { display: none; }
          .right-panel  { padding: 40px 24px; }
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
            <span className="l-badge"><span className="l-badge-dot"/>Account Recovery</span>

            {/* Lock icon */}
            <div className="lock-illustration">
              <svg viewBox="0 0 42 42" fill="none">
                <rect x="8" y="19" width="26" height="18" rx="4"
                  fill="rgba(255,255,255,0.25)" stroke="white" strokeWidth="1.8"/>
                <path d="M14 19V13.5a7 7 0 0 1 14 0V19"
                  stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="21" cy="28" r="2.5" fill="white"/>
                <line x1="21" y1="30.5" x2="21" y2="33.5"
                  stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>

            <h1 className="l-heading">Locked out?<br /><em>We've got you.</em></h1>
            <p className="l-sub">
              Happens to the best of us. Enter your email and we'll send a secure reset link straight to your inbox.
            </p>

            {/* How it works steps */}
            <div className="steps-card">
              <p className="steps-title">How it works</p>
              <ul className="steps-list">
                {[
                  { title: 'Enter your email', desc: 'The address you signed up with' },
                  { title: 'Check your inbox', desc: 'A reset link arrives within seconds' },
                  { title: 'Set a new password', desc: 'Click the link and choose a new one' },
                  { title: 'You\'re back in', desc: 'Log in and reach your dashboard' },
                ].map((s, i) => (
                  <li className="step-item" key={i}>
                    <span className="step-num">{i + 1}</span>
                    <div className="step-copy">
                      <strong>{s.title}</strong>
                      <span>{s.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="l-footer">
            <a href="/login" className="back-link">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to sign in
            </a>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="right-panel">
          <div className="form-card">

            {isSuccess ? (
              /* ── Success state ── */
              <div className="success-state">
                <div className="success-icon">
                  <svg viewBox="0 0 30 30" fill="none">
                    <path d="M6 15l6 6 12-12"
                      stroke="#16a34a" strokeWidth="2.2"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="success-title">Check your inbox</h2>
                <p className="success-msg">
                  We sent a password reset link to{' '}
                  <strong>{email}</strong>.<br />
                  It expires in 60 minutes — check your spam folder too.
                </p>
                <button
                  className="submit-btn"
                  style={{ marginBottom: 12 }}
                  onClick={() => { setIsSuccess(false); setEmail(''); setMessage('') }}
                  type="button"
                >
                  Send another link
                </button>
                <a href="/login" className="back-btn">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Back to sign in
                </a>
              </div>
            ) : (
              /* ── Form state ── */
              <>
                <div className="form-icon">
                  <svg viewBox="0 0 28 28" fill="none">
                    <rect x="4" y="13" width="20" height="13" rx="3"
                      stroke="#2c5282" strokeWidth="1.8"/>
                    <path d="M9 13V9a5 5 0 0 1 10 0v4"
                      stroke="#2c5282" strokeWidth="1.8" strokeLinecap="round"/>
                    <circle cx="14" cy="19.5" r="1.8" fill="#2c5282"/>
                    <line x1="14" y1="21.3" x2="14" y2="23.5"
                      stroke="#2c5282" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </div>

                <p className="form-eyebrow">Account recovery</p>
                <h2 className="form-title">Reset your password</h2>
                <p className="form-sub">
                  Enter the email you signed up with and we'll send you a secure link to choose a new password.{' '}
                  <a href="/login">Back to sign in</a>
                </p>

                <div className="field">
                  <label className="field-label" htmlFor="email-input">Email address</label>
                  <div className={`input-wrap${focused ? ' focused' : ''}`}>
                    <svg className="input-icon" viewBox="0 0 20 20" fill="none"
                      stroke="currentColor" strokeWidth="1.6">
                      <path d="M2.5 5.5h15l-7.5 7-7.5-7z" strokeLinejoin="round"/>
                      <path d="M2.5 5.5v9h15v-9" strokeLinejoin="round"/>
                    </svg>
                    <input
                      id="email-input"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      onKeyDown={e => e.key === 'Enter' && handleReset()}
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                  <p className="field-hint">
                    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="7" cy="7" r="5.5"/>
                      <path d="M7 6.5v3M7 4.5v.5" strokeLinecap="round"/>
                    </svg>
                    Use the email address associated with your account.
                  </p>
                </div>

                <button
                  className="submit-btn"
                  onClick={handleReset}
                  disabled={isLoading}
                  type="button"
                >
                  {isLoading
                    ? <><div className="spinner"/> Sending reset link…</>
                    : <>Send reset link →</>
                  }
                </button>

                <div className="or-divider">
                  <div className="or-line"/><span className="or-text">or</span><div className="or-line"/>
                </div>

                <a href="/login" className="back-btn">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Back to sign in
                </a>

                <p className="terms">
                  Don't have an account?{' '}
                  <a href="/signup">Create one for free</a>
                </p>

                {message && !isSuccess && (
                  <div className="message error">! {message}</div>
                )}
              </>
            )}

          </div>
        </div>
      </div>
    </>
  )
}