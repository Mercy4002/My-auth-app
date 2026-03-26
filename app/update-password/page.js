'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function UpdatePasswordPage() {
  const [password, setPassword]         = useState('')
  const [confirm, setConfirm]           = useState('')
  const [message, setMessage]           = useState('')
  const [isLoading, setIsLoading]       = useState(false)
  const [isSuccess, setIsSuccess]       = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [strength, setStrength]         = useState(0)
  const router   = useRouter()
  const supabase = createClient()

  // Check password strength
  useEffect(() => {
    let score = 0
    if (password.length >= 8)                     score++
    if (/[A-Z]/.test(password))                   score++
    if (/[0-9]/.test(password))                   score++
    if (/[^A-Za-z0-9]/.test(password))            score++
    setStrength(score)
  }, [password])

  async function handleUpdate() {
    if (!password || !confirm) {
      setMessage('Please fill in both fields.')
      setIsSuccess(false)
      return
    }
    if (password !== confirm) {
      setMessage('Passwords do not match. Please try again.')
      setIsSuccess(false)
      return
    }
    if (password.length < 8) {
      setMessage('Password must be at least 8 characters.')
      setIsSuccess(false)
      return
    }
    setIsLoading(true)
    setMessage('')
    const { error } = await supabase.auth.updateUser({ password })
    setIsLoading(false)
    if (error) {
      setMessage(error.message)
      setIsSuccess(false)
    } else {
      setIsSuccess(true)
      setMessage('Password updated successfully! Redirecting you...')
      setTimeout(() => router.push('/dashboard'), 2000)
    }
  }

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['', '#ef4444', '#f97316', '#eab308', '#16a34a']

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
          position: absolute; top: -100px; left: -100px;
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(255,255,255,0.13) 0%, transparent 65%);
          pointer-events: none;
        }
        .left-panel::after {
          content: '';
          position: absolute; bottom: -80px; right: -80px;
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

        /* Shield illustration */
        .shield-illustration {
          width: 88px; height: 88px;
          background: rgba(255,255,255,0.14);
          border: 1.5px solid rgba(255,255,255,0.24);
          border-radius: 24px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 28px;
        }
        .shield-illustration svg { width: 46px; height: 46px; }

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

        /* Tips card */
        .tips-card {
          background: rgba(255,255,255,0.11);
          border: 1px solid rgba(255,255,255,0.20);
          border-radius: var(--radius);
          padding: 22px 24px;
        }
        .tips-title {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(255,255,255,0.60);
          margin-bottom: 16px;
        }
        .tips-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .tip-item { display: flex; align-items: flex-start; gap: 12px; }
        .tip-icon {
          width: 22px; height: 22px; flex-shrink: 0;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin-top: 1px;
        }
        .tip-icon svg { width: 11px; height: 11px; }
        .tip-text {
          font-size: 13px; font-weight: 300;
          color: rgba(255,255,255,0.78); line-height: 1.55;
        }

        /* Footer */
        .l-footer { position: relative; z-index: 2; }
        .back-link {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 13px; font-weight: 600;
          color: rgba(255,255,255,0.70); text-decoration: none;
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
          color: var(--ink-muted); margin-bottom: 30px; line-height: 1.65;
        }

        /* Fields */
        .field { margin-bottom: 18px; }
        .field-label {
          display: block;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.04em; color: var(--ink);
          margin-bottom: 8px;
        }
        .input-wrap { position: relative; display: flex; align-items: center; }
        .input-icon {
          position: absolute; left: 14px;
          width: 18px; height: 18px;
          color: var(--ink-hint);
          pointer-events: none;
          transition: color 0.2s; flex-shrink: 0;
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

        /* Password strength meter */
        .strength-row {
          display: flex; align-items: center; gap: 10px;
          margin-top: 10px;
        }
        .strength-bars {
          display: flex; gap: 4px; flex: 1;
        }
        .strength-bar {
          flex: 1; height: 4px; border-radius: 2px;
          background: var(--blue-tint);
          transition: background 0.3s;
        }
        .strength-label {
          font-size: 12px; font-weight: 600;
          min-width: 40px; text-align: right;
          transition: color 0.3s;
        }

        /* Match indicator */
        .match-hint {
          margin-top: 8px;
          font-size: 12px; font-weight: 500;
          display: flex; align-items: center; gap: 6px;
        }
        .match-hint svg { width: 13px; height: 13px; flex-shrink: 0; }
        .match-ok    { color: #16a34a; }
        .match-error { color: #dc2626; }

        /* Submit */
        .submit-btn {
          width: 100%; padding: 15px;
          background: var(--blue-btn);
          border: none; border-radius: var(--radius-sm);
          color: #fff;
          font-family: 'Nunito', sans-serif;
          font-size: 15px; font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0.03em;
          box-shadow: var(--shadow-btn);
          margin-top: 6px;
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

        /* Success state */
        .success-state { text-align: center; padding: 8px 0; }
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

        /* Message */
        .message {
          margin-top: 18px; padding: 13px 16px;
          border-radius: var(--radius-sm);
          font-size: 14px; text-align: center; font-weight: 500;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .message.error   { background: #fff5f5; border: 1.5px solid #fca5a5; color: #b91c1c; }
        .message.success { background: #f0fdf4; border: 1.5px solid #86efac; color: #15803d; }

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
            <span className="l-badge"><span className="l-badge-dot"/>Almost there</span>

            {/* Shield illustration */}
            <div className="shield-illustration">
              <svg viewBox="0 0 46 46" fill="none">
                <path
                  d="M23 4L8 10V22C8 30.284 14.716 37.716 23 40C31.284 37.716 38 30.284 38 22V10L23 4Z"
                  fill="rgba(255,255,255,0.20)"
                  stroke="white" strokeWidth="1.8" strokeLinejoin="round"
                />
                <path d="M16 23l5 5 9-9"
                  stroke="white" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </div>

            <h1 className="l-heading">Almost<br /><em>there.</em></h1>
            <p className="l-sub">
              Choose a strong new password. Once saved, you'll be taken straight to your dashboard.
            </p>

            {/* Password tips */}
            <div className="tips-card">
              <p className="tips-title">Tips for a strong password</p>
              <ul className="tips-list">
                {[
                  'Use at least 8 characters',
                  'Mix uppercase and lowercase letters',
                  'Add numbers and special characters (!@#$)',
                  'Avoid using your name or email',
                ].map((tip, i) => (
                  <li className="tip-item" key={i}>
                    <span className="tip-icon">
                      <svg viewBox="0 0 11 11" fill="none">
                        <path d="M2 5.5l2.5 2.5 4.5-4.5"
                          stroke="white" strokeWidth="1.5"
                          strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className="tip-text">{tip}</span>
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
                <h2 className="success-title">Password updated!</h2>
                <p className="success-msg">
                  Your new password has been saved.<br />
                  Redirecting you to your dashboard…
                </p>
              </div>
            ) : (
              /* ── Form state ── */
              <>
                <div className="form-icon">
                  <svg viewBox="0 0 28 28" fill="none">
                    <path
                      d="M14 3L5 7V15C5 20.523 8.977 25.597 14 27C19.023 25.597 23 20.523 23 15V7L14 3Z"
                      stroke="#2c5282" strokeWidth="1.8" strokeLinejoin="round"
                    />
                    <path d="M10 14.5l3 3 5.5-5.5"
                      stroke="#2c5282" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <p className="form-eyebrow">Almost there</p>
                <h2 className="form-title">Set a new password</h2>
                <p className="form-sub">
                  Choose something secure that you haven't used before.
                </p>

                {/* New password */}
                <div className="field">
                  <label className="field-label" htmlFor="password-input">
                    New password
                  </label>
                  <div className={`input-wrap${focusedField === 'password' ? ' focused' : ''}`}>
                    <svg className="input-icon" viewBox="0 0 20 20" fill="none"
                      stroke="currentColor" strokeWidth="1.6">
                      <rect x="4" y="9" width="12" height="9" rx="2" strokeLinejoin="round"/>
                      <path d="M7 9V6.5a3 3 0 0 1 6 0V9" strokeLinecap="round"/>
                    </svg>
                    <input
                      id="password-input"
                      type="password"
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      autoComplete="new-password"
                      autoFocus
                    />
                  </div>

                  {/* Strength meter */}
                  {password.length > 0 && (
                    <div className="strength-row">
                      <div className="strength-bars">
                        {[1,2,3,4].map(i => (
                          <div
                            key={i}
                            className="strength-bar"
                            style={{ background: i <= strength ? strengthColors[strength] : undefined }}
                          />
                        ))}
                      </div>
                      <span
                        className="strength-label"
                        style={{ color: strengthColors[strength] }}
                      >
                        {strengthLabels[strength]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="field">
                  <label className="field-label" htmlFor="confirm-input">
                    Confirm password
                  </label>
                  <div className={`input-wrap${focusedField === 'confirm' ? ' focused' : ''}`}>
                    <svg className="input-icon" viewBox="0 0 20 20" fill="none"
                      stroke="currentColor" strokeWidth="1.6">
                      <rect x="4" y="9" width="12" height="9" rx="2" strokeLinejoin="round"/>
                      <path d="M7 9V6.5a3 3 0 0 1 6 0V9" strokeLinecap="round"/>
                    </svg>
                    <input
                      id="confirm-input"
                      type="password"
                      placeholder="Repeat your new password"
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      onFocus={() => setFocusedField('confirm')}
                      onBlur={() => setFocusedField(null)}
                      onKeyDown={e => e.key === 'Enter' && handleUpdate()}
                      autoComplete="new-password"
                    />
                  </div>

                  {/* Match indicator */}
                  {confirm.length > 0 && (
                    password === confirm ? (
                      <p className="match-hint match-ok">
                        <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M2 6.5l3.5 3.5 5.5-6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Passwords match
                      </p>
                    ) : (
                      <p className="match-hint match-error">
                        <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M2 2l9 9M11 2l-9 9" strokeLinecap="round"/>
                        </svg>
                        Passwords do not match
                      </p>
                    )
                  )}
                </div>

                <button
                  className="submit-btn"
                  onClick={handleUpdate}
                  disabled={isLoading}
                  type="button"
                >
                  {isLoading
                    ? <><div className="spinner"/> Saving password…</>
                    : <>Save new password →</>
                  }
                </button>

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