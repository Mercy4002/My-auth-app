import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) =>
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          ),
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const displayName = user.email?.split('@')[0] ?? 'there'
  const initial     = displayName.charAt(0).toUpperCase()
  const provider    = user.app_metadata?.provider ?? 'email'
  const joinedDate  = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Nunito:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --blue-deep:  #2c5282;
          --blue-mid:   #3a6fa8;
          --blue-soft:  #4a85c0;
          --blue-pale:  #ebf4ff;
          --blue-tint:  #d6e8f8;
          --white:      #ffffff;
          --ink:        #1a2e44;
          --ink-muted:  #4a6580;
          --ink-hint:   #7a96b0;
          --border:     #b8d0e8;
          --radius:     14px;
          --radius-sm:  10px;
        }

        body {
          font-family: 'Nunito', sans-serif;
          background: var(--blue-pale);
          min-height: 100vh;
          color: var(--ink);
        }

        /* ── Navbar ── */
        .navbar {
          background: var(--white);
          border-bottom: 1.5px solid var(--blue-tint);
          padding: 0 40px;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 10;
          box-shadow: 0 2px 12px rgba(44,82,130,0.07);
        }
        .nav-brand {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
        }
        .nav-mark {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, var(--blue-deep), var(--blue-mid));
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
        }
        .nav-mark svg { width: 17px; height: 17px; }
        .nav-name {
          font-family: 'Lora', serif;
          font-size: 18px; font-weight: 600;
          color: var(--ink); letter-spacing: 0.03em;
        }
        .nav-right { display: flex; align-items: center; gap: 16px; }
        .nav-badge {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.10em; text-transform: uppercase;
          color: var(--blue-soft);
          background: var(--blue-pale);
          border: 1.5px solid var(--blue-tint);
          padding: 4px 12px; border-radius: 100px;
        }
        .nav-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, var(--blue-deep), var(--blue-soft));
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700; color: white;
          border: 2px solid var(--blue-tint);
          flex-shrink: 0;
        }

        /* ── Page ── */
        .page {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 24px 60px;
        }

        /* ── Welcome banner ── */
        .welcome-banner {
          background: linear-gradient(145deg, var(--blue-deep) 0%, var(--blue-mid) 55%, #5592cc 100%);
          border-radius: var(--radius);
          padding: 36px 40px;
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 28px;
          position: relative; overflow: hidden;
        }
        .welcome-banner::before {
          content: '';
          position: absolute; top: -60px; right: -60px;
          width: 260px; height: 260px;
          background: radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 65%);
          pointer-events: none;
        }
        .welcome-dots {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none;
        }
        .welcome-left { position: relative; z-index: 1; }
        .welcome-tag {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.22);
          padding: 5px 13px; border-radius: 100px;
          margin-bottom: 14px;
        }
        .tag-dot { width: 6px; height: 6px; background: #a8d8ff; border-radius: 50%; }
        .welcome-heading {
          font-family: 'Lora', serif;
          font-size: 28px; font-weight: 400; color: #fff;
          margin-bottom: 6px; line-height: 1.25;
        }
        .welcome-heading em { font-style: italic; color: #c9e4ff; }
        .welcome-sub {
          font-size: 14px; font-weight: 300;
          color: rgba(255,255,255,0.68); line-height: 1.6;
        }
        .welcome-right { position: relative; z-index: 1; }
        .big-avatar {
          width: 72px; height: 72px; border-radius: 50%;
          background: rgba(255,255,255,0.18);
          border: 2.5px solid rgba(255,255,255,0.32);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Lora', serif;
          font-size: 28px; font-weight: 600; color: #fff;
        }

        /* ── Stat cards ── */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        .stat-card {
          background: var(--white);
          border: 1.5px solid var(--blue-tint);
          border-radius: var(--radius);
          padding: 22px 24px;
          box-shadow: 0 2px 10px rgba(44,82,130,0.07);
        }
        .stat-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 14px;
        }
        .stat-icon svg { width: 20px; height: 20px; }
        .stat-icon.blue  { background: #dbeafe; }
        .stat-icon.green { background: #dcfce7; }
        .stat-icon.amber { background: #fef9c3; }
        .stat-label {
          font-size: 11px; font-weight: 700; letter-spacing: 0.10em;
          text-transform: uppercase; color: var(--ink-hint); margin-bottom: 6px;
        }
        .stat-value {
          font-family: 'Lora', serif;
          font-size: 24px; font-weight: 600; color: var(--ink); margin-bottom: 4px;
        }
        .stat-sub { font-size: 12px; font-weight: 300; color: var(--ink-hint); }

        /* ── Two column ── */
        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        /* ── Info card ── */
        .info-card {
          background: var(--white);
          border: 1.5px solid var(--blue-tint);
          border-radius: var(--radius);
          padding: 24px;
          box-shadow: 0 2px 10px rgba(44,82,130,0.07);
        }
        .card-heading {
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--ink-hint); margin-bottom: 18px;
          display: flex; align-items: center; gap: 8px;
        }
        .card-heading svg { width: 15px; height: 15px; color: var(--blue-soft); }
        .info-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 11px 0;
          border-bottom: 1px solid var(--blue-tint);
          gap: 12px;
        }
        .info-row:last-child { border-bottom: none; padding-bottom: 0; }
        .info-key { font-size: 13px; font-weight: 600; color: var(--ink-muted); flex-shrink: 0; }
        .info-val { font-size: 13px; font-weight: 400; color: var(--ink); text-align: right; word-break: break-all; }
        .info-pill {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 3px 10px; border-radius: 100px;
        }
        .pill-green { background: #dcfce7; color: #15803d; }
        .pill-blue  { background: #dbeafe; color: #1d4ed8; }
        .pill-dot2  { width: 5px; height: 5px; border-radius: 50%; }
        .pill-green .pill-dot2 { background: #16a34a; }
        .pill-blue  .pill-dot2 { background: #2563eb; }

        /* ── Auth methods ── */
        .method-item {
          display: flex; align-items: center; gap: 14px;
          padding: 13px 0;
          border-bottom: 1px solid var(--blue-tint);
        }
        .method-item:last-child { border-bottom: none; padding-bottom: 0; }
        .method-icon {
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .method-icon svg { width: 20px; height: 20px; }
        .mi-blue  { background: #dbeafe; }
        .mi-white { background: #f1f5f9; border: 1.5px solid #e2e8f0; }
        .method-copy { flex: 1; }
        .method-name { font-size: 14px; font-weight: 600; color: var(--ink); }
        .method-desc { font-size: 12px; font-weight: 300; color: var(--ink-hint); margin-top: 2px; }
        .method-badge {
          font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 3px 8px; border-radius: 100px;
        }
        .mb-active   { background: #dcfce7; color: #15803d; }
        .mb-inactive { background: #f1f5f9; color: #94a3b8; }

        /* ── Sign out ── */
        .signout-card {
          background: var(--white);
          border: 1.5px solid var(--blue-tint);
          border-radius: var(--radius);
          padding: 22px 24px;
          display: flex; align-items: center; justify-content: space-between;
          box-shadow: 0 2px 10px rgba(44,82,130,0.07);
        }
        .signout-title { font-size: 15px; font-weight: 600; color: var(--ink); margin-bottom: 3px; }
        .signout-sub   { font-size: 13px; font-weight: 300; color: var(--ink-hint); }
        .signout-btn {
          padding: 11px 22px;
          background: transparent;
          border: 2px solid #fca5a5;
          border-radius: var(--radius-sm);
          color: #dc2626;
          font-family: 'Nunito', sans-serif;
          font-size: 13px; font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
          display: flex; align-items: center; gap: 7px;
          flex-shrink: 0; text-decoration: none;
        }
        .signout-btn:hover {
          background: #fef2f2;
          box-shadow: 0 0 0 3px rgba(220,38,38,0.10);
        }
        .signout-btn svg { width: 15px; height: 15px; }

        @media (max-width: 700px) {
          .navbar         { padding: 0 20px; }
          .page           { padding: 24px 16px 48px; }
          .welcome-banner { flex-direction: column; gap: 20px; padding: 28px 24px; }
          .stats-row      { grid-template-columns: 1fr; }
          .two-col        { grid-template-columns: 1fr; }
          .signout-card   { flex-direction: column; align-items: flex-start; gap: 16px; }
          .signout-btn    { width: 100%; justify-content: center; }
        }
      `}</style>

      {/* Navbar */}
      <nav className="navbar">
        <a href="/dashboard" className="nav-brand">
          <div className="nav-mark">
            <svg viewBox="0 0 19 19" fill="none">
              <path d="M9.5 2L16.5 6.25V13.75L9.5 18L2.5 13.75V6.25L9.5 2Z"
                stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <circle cx="9.5" cy="9.5" r="2.2" fill="white"/>
            </svg>
          </div>
          <span className="nav-name">AuthApp</span>
        </a>
        <div className="nav-right">
          <span className="nav-badge">Test dashboard</span>
          <div className="nav-avatar">{initial}</div>
        </div>
      </nav>

      <main className="page">

        {/* Welcome banner */}
        <div className="welcome-banner">
          <div className="welcome-dots" />
          <div className="welcome-left">
            <span className="welcome-tag"><span className="tag-dot"/>You're in</span>
            <h1 className="welcome-heading">Hello, <em>{displayName}</em> 👋</h1>
            <p className="welcome-sub">
              You're successfully authenticated. Your session is active and secure.
            </p>
          </div>
          <div className="welcome-right">
            <div className="big-avatar">{initial}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon blue">
              <svg viewBox="0 0 20 20" fill="none" stroke="#2c5282" strokeWidth="1.7">
                <circle cx="10" cy="7" r="3.5"/>
                <path d="M3 18c0-3.866 3.134-7 7-7s7 3.134 7 7" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="stat-label">Account status</p>
            <p className="stat-value">Active</p>
            <p className="stat-sub">Session is live</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <svg viewBox="0 0 20 20" fill="none" stroke="#16a34a" strokeWidth="1.7">
                <path d="M4 10.5l4 4 8-8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="stat-label">Auth method</p>
            <p className="stat-value" style={{ textTransform: 'capitalize' }}>{provider}</p>
            <p className="stat-sub">Login provider</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon amber">
              <svg viewBox="0 0 20 20" fill="none" stroke="#b45309" strokeWidth="1.7">
                <rect x="3" y="4" width="14" height="13" rx="2"/>
                <path d="M3 8h14M7 4V6M13 4V6" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="stat-label">Member since</p>
            <p className="stat-value" style={{ fontSize: 16 }}>{joinedDate}</p>
            <p className="stat-sub">Account created</p>
          </div>
        </div>

        {/* Two col */}
        <div className="two-col">
          {/* Account details */}
          <div className="info-card">
            <p className="card-heading">
              <svg viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="7.5" cy="5" r="2.8"/>
                <path d="M2 14c0-3.038 2.462-5.5 5.5-5.5S13 10.962 13 14" strokeLinecap="round"/>
              </svg>
              Account details
            </p>
            <div className="info-row">
              <span className="info-key">Email</span>
              <span className="info-val">{user.email}</span>
            </div>
            <div className="info-row">
              <span className="info-key">User ID</span>
              <span className="info-val" style={{ fontSize: 11, color: 'var(--ink-hint)', fontFamily: 'monospace' }}>
                {user.id.slice(0, 18)}…
              </span>
            </div>
            <div className="info-row">
              <span className="info-key">Status</span>
              <span className="info-val">
                <span className="info-pill pill-green">
                  <span className="pill-dot2"/>Verified
                </span>
              </span>
            </div>
            <div className="info-row">
              <span className="info-key">Provider</span>
              <span className="info-val">
                <span className="info-pill pill-blue" style={{ textTransform: 'capitalize' }}>
                  <span className="pill-dot2"/>{provider}
                </span>
              </span>
            </div>
          </div>

          {/* Login methods */}
          <div className="info-card">
            <p className="card-heading">
              <svg viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="2.5" y="6.5" width="10" height="7" rx="1.5"/>
                <path d="M5 6.5V4.5a2.5 2.5 0 0 1 5 0v2" strokeLinecap="round"/>
              </svg>
              Login methods
            </p>
            <div className="method-item">
              <div className="method-icon mi-blue">
                <svg viewBox="0 0 20 20" fill="none" stroke="#2c5282" strokeWidth="1.6">
                  <path d="M2.5 5.5h15l-7.5 7-7.5-7z" strokeLinejoin="round"/>
                  <path d="M2.5 5.5v9h15v-9" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="method-copy">
                <p className="method-name">Email &amp; password</p>
                <p className="method-desc">{user.email}</p>
              </div>
              <span className="method-badge mb-active">Active</span>
            </div>
            <div className="method-item">
              <div className="method-icon mi-white">
                <svg viewBox="0 0 20 20">
                  <path fill="#4285F4" d="M18.8 10.2c0-.65-.06-1.28-.17-1.88H10v3.55h4.93c-.21 1.14-.87 2.11-1.84 2.76v2.31h2.97c1.74-1.6 2.74-3.95 2.74-6.74z"/>
                  <path fill="#34A853" d="M10 19c2.48 0 4.55-.82 6.07-2.22l-2.97-2.31c-.82.55-1.86.88-3.1.88-2.38 0-4.4-1.61-5.12-3.77H1.83v2.37C3.32 17.1 6.44 19 10 19z"/>
                  <path fill="#FBBC05" d="M4.88 12.58A5.02 5.02 0 0 1 4.62 11c0-.55.1-1.08.26-1.58V7.05H1.83A8.99 8.99 0 0 0 1 11c0 1.45.35 2.82.96 4.03l2.92-2.45z"/>
                  <path fill="#EA4335" d="M10 4.65c1.35 0 2.55.46 3.5 1.37l2.63-2.63C14.55 1.74 12.48 1 10 1 6.44 1 3.32 2.9 1.83 5.95l2.92 2.37C5.6 6.26 7.62 4.65 10 4.65z"/>
                </svg>
              </div>
              <div className="method-copy">
                <p className="method-name">Google</p>
                <p className="method-desc">Sign in with your Google account</p>
              </div>
              <span className={`method-badge ${provider === 'google' ? 'mb-active' : 'mb-inactive'}`}>
                {provider === 'google' ? 'Active' : 'Available'}
              </span>
            </div>
          </div>
        </div>

        {/* Sign out */}
        <div className="signout-card">
          <div>
            <p className="signout-title">Sign out of your account</p>
            <p className="signout-sub">You'll be redirected to the login page.</p>
          </div>
          <a href="/api/signout" className="signout-btn">
            <svg viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M9 2H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h6" strokeLinecap="round"/>
              <path d="M11 10l3-2.5L11 5M14 7.5H6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sign out
          </a>
        </div>

      </main>
    </>
  )
}
