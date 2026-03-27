'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [user, setUser]             = useState(null)
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)
  const [uploading, setUploading]   = useState(false)
  const [message, setMessage]       = useState('')
  const [isSuccess, setIsSuccess]   = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [avatarUrl, setAvatarUrl]   = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    full_name: '',
    username:  '',
    bio:       '',
    phone:     '',
    location:  '',
  })

  const router   = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) { router.push('/login'); return }
      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setForm({
          full_name: profile.full_name || '',
          username:  profile.username  || '',
          bio:       profile.bio       || '',
          phone:     profile.phone     || '',
          location:  profile.location  || '',
        })
        if (profile.avatar_url) setAvatarUrl(profile.avatar_url)
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setMessage('')
  }

  // Handle photo file selection — show a preview instantly
  function handlePhotoSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage('Please select an image file (JPG, PNG, etc.)')
      setIsSuccess(false)
      return
    }
    // Validate file size — max 2MB
    if (file.size > 2 * 1024 * 1024) {
      setMessage('Image must be smaller than 2MB.')
      setIsSuccess(false)
      return
    }

    // Show instant preview using a local object URL
    const previewUrl = URL.createObjectURL(file)
    setAvatarPreview(previewUrl)
    setMessage('')
  }

  // Upload photo to Supabase Storage
  async function uploadPhoto(userId) {
    const file = fileInputRef.current?.files?.[0]
    if (!file) return avatarUrl // no new file selected, keep existing

    setUploading(true)
    const fileExt  = file.name.split('.').pop()
    const filePath = `${userId}/avatar.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      setMessage('Photo upload failed: ' + uploadError.message)
      setIsSuccess(false)
      setUploading(false)
      return null
    }

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    setUploading(false)
    return data.publicUrl
  }

  async function handleSave() {
    if (!form.full_name.trim()) {
      setMessage('Full name is required.')
      setIsSuccess(false)
      return
    }

    setSaving(true)
    setMessage('')

    // Upload photo first if a new one was selected
    const newAvatarUrl = await uploadPhoto(user.id)
    if (newAvatarUrl === null && fileInputRef.current?.files?.[0]) {
      setSaving(false)
      return // upload failed, stop here
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id:         user.id,
        full_name:  form.full_name.trim(),
        username:   form.username.trim()  || null,
        bio:        form.bio.trim()       || null,
        phone:      form.phone.trim()     || null,
        location:   form.location.trim()  || null,
        avatar_url: newAvatarUrl || avatarUrl || null,
      })

    setSaving(false)

    if (error) {
      setMessage(error.message)
      setIsSuccess(false)
    } else {
      if (newAvatarUrl) setAvatarUrl(newAvatarUrl)
      setMessage('Profile updated successfully!')
      setIsSuccess(true)
    }
  }

  const initial    = user?.email?.charAt(0).toUpperCase() ?? '?'
  const photoSrc   = avatarPreview || avatarUrl

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: '#ebf4ff', fontFamily: 'Nunito, sans-serif',
        fontSize: 15, color: '#4a6580'
      }}>
        Loading your profile…
      </div>
    )
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
          --radius:      14px;
          --radius-sm:   10px;
        }

        body { background: var(--blue-pale); }

        /* ── Navbar ── */
        .navbar {
          background: var(--white);
          border-bottom: 1.5px solid var(--blue-tint);
          padding: 0 40px; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 10;
          box-shadow: 0 2px 12px rgba(44,82,130,0.07);
          font-family: 'Nunito', sans-serif;
        }
        .nav-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-mark {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, var(--blue-deep), var(--blue-mid));
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
        }
        .nav-mark svg { width: 17px; height: 17px; }
        .nav-name {
          font-family: 'Lora', serif; font-size: 18px; font-weight: 600;
          color: var(--ink); letter-spacing: 0.03em;
        }
        .nav-right { display: flex; align-items: center; gap: 12px; }
        .nav-back {
          font-size: 13px; font-weight: 600; color: var(--ink-muted);
          text-decoration: none; display: flex; align-items: center; gap: 6px;
          padding: 7px 14px; border: 1.5px solid var(--border-idle);
          border-radius: var(--radius-sm);
          transition: border-color 0.2s, color 0.2s;
        }
        .nav-back:hover { border-color: var(--blue-focus); color: var(--blue-focus); }
        .nav-back svg { width: 14px; height: 14px; }
        .nav-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, var(--blue-deep), var(--blue-soft));
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700; color: white;
          border: 2px solid var(--blue-tint); flex-shrink: 0;
          overflow: hidden;
        }
        .nav-avatar img { width: 100%; height: 100%; object-fit: cover; }

        /* ── Page ── */
        .page {
          max-width: 720px; margin: 0 auto;
          padding: 40px 24px 60px;
          font-family: 'Nunito', sans-serif;
        }

        /* ── Profile banner ── */
        .profile-banner {
          background: linear-gradient(145deg, var(--blue-deep) 0%, var(--blue-mid) 55%, #5592cc 100%);
          border-radius: var(--radius);
          padding: 32px 40px;
          display: flex; align-items: center; gap: 24px;
          margin-bottom: 28px;
          position: relative; overflow: hidden;
        }
        .profile-banner::before {
          content: '';
          position: absolute; top: -60px; right: -60px;
          width: 220px; height: 220px;
          background: radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 65%);
          pointer-events: none;
        }
        .banner-dots {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px);
          background-size: 24px 24px; pointer-events: none;
        }
        .banner-avatar {
          width: 72px; height: 72px; border-radius: 50%; flex-shrink: 0;
          background: rgba(255,255,255,0.18);
          border: 2.5px solid rgba(255,255,255,0.32);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Lora', serif; font-size: 28px; font-weight: 600; color: #fff;
          position: relative; z-index: 1; overflow: hidden;
        }
        .banner-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .banner-info { position: relative; z-index: 1; }
        .banner-name {
          font-family: 'Lora', serif; font-size: 22px; font-weight: 400; color: #fff;
          margin-bottom: 4px;
        }
        .banner-name em { font-style: italic; color: #c9e4ff; }
        .banner-email { font-size: 13px; font-weight: 300; color: rgba(255,255,255,0.65); }
        .banner-tag {
          margin-left: auto; position: relative; z-index: 1;
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(255,255,255,0.88);
          background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.22);
          padding: 6px 14px; border-radius: 100px;
        }
        .tag-dot { width: 6px; height: 6px; background: #a8d8ff; border-radius: 50%; }

        /* ── Form card ── */
        .form-card {
          background: var(--white); border: 1.5px solid var(--blue-tint);
          border-radius: var(--radius); padding: 32px 36px;
          box-shadow: 0 2px 10px rgba(44,82,130,0.07);
        }
        .card-heading {
          font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--ink-hint); margin-bottom: 24px;
          display: flex; align-items: center; gap: 8px;
          padding-bottom: 14px; border-bottom: 1.5px solid var(--blue-tint);
        }
        .card-heading svg { width: 15px; height: 15px; color: var(--blue-soft); }

        /* ── Photo upload section ── */
        .photo-section {
          display: flex; align-items: center; gap: 20px;
          padding: 20px; background: var(--blue-pale);
          border: 1.5px solid var(--blue-tint);
          border-radius: var(--radius-sm); margin-bottom: 24px;
        }
        .photo-preview {
          width: 72px; height: 72px; border-radius: 50%; flex-shrink: 0;
          background: var(--blue-tint);
          border: 2px solid var(--border-idle);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Lora', serif; font-size: 24px; font-weight: 600;
          color: var(--blue-mid); overflow: hidden;
        }
        .photo-preview img { width: 100%; height: 100%; object-fit: cover; }
        .photo-info { flex: 1; }
        .photo-label {
          font-size: 14px; font-weight: 600; color: var(--ink); margin-bottom: 4px;
        }
        .photo-hint {
          font-size: 12px; font-weight: 300; color: var(--ink-hint); line-height: 1.5;
        }
        .photo-btn {
          padding: 9px 18px;
          background: var(--white); border: 1.5px solid var(--border-idle);
          border-radius: var(--radius-sm); color: var(--ink-muted);
          font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: border-color 0.2s, color 0.2s;
          display: flex; align-items: center; gap: 7px; flex-shrink: 0;
        }
        .photo-btn:hover { border-color: var(--blue-focus); color: var(--blue-focus); }
        .photo-btn svg { width: 14px; height: 14px; }
        input[type="file"] { display: none; }

        /* ── Fields grid ── */
        .fields-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 18px; margin-bottom: 18px;
        }
        .field-full { grid-column: 1 / -1; }

        .field {}
        .field-label {
          display: block; font-size: 13px; font-weight: 700;
          letter-spacing: 0.04em; color: var(--ink); margin-bottom: 8px;
        }
        .field-label span {
          font-size: 11px; font-weight: 400; color: var(--ink-hint);
          margin-left: 4px; text-transform: none; letter-spacing: 0;
        }
        .input-wrap { position: relative; display: flex; align-items: center; }
        .input-icon {
          position: absolute; left: 14px; width: 16px; height: 16px;
          color: var(--ink-hint); pointer-events: none;
          transition: color 0.2s; flex-shrink: 0;
        }
        .input-wrap.focused .input-icon { color: var(--blue-focus); }

        .field input, .field textarea {
          width: 100%; padding: 13px 14px 13px 40px;
          background: var(--white); border: 2px solid var(--border-idle);
          border-radius: var(--radius-sm); color: var(--ink);
          font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 400;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-shadow: 0 1px 4px rgba(44,82,130,0.06);
        }
        .field textarea { resize: vertical; min-height: 90px; line-height: 1.6; }
        .field input::placeholder,
        .field textarea::placeholder { color: var(--ink-hint); font-weight: 300; }
        .field input:focus, .field textarea:focus {
          border-color: var(--blue-focus);
          box-shadow: 0 0 0 4px rgba(58,111,168,0.14); background: #fff;
        }
        .field input:not(:placeholder-shown),
        .field textarea:not(:placeholder-shown) {
          border-color: #8ab4d8; background: #f5faff;
        }

        .field-readonly input {
          background: #f0f6ff; color: var(--ink-hint);
          cursor: not-allowed; border-color: var(--blue-tint);
        }
        .readonly-note {
          margin-top: 6px; font-size: 11px; font-weight: 400; color: var(--ink-hint);
          display: flex; align-items: center; gap: 4px;
        }
        .readonly-note svg { width: 11px; height: 11px; flex-shrink: 0; }

        /* ── Actions ── */
        .actions-row {
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; margin-top: 28px; padding-top: 22px;
          border-top: 1.5px solid var(--blue-tint); flex-wrap: wrap;
        }
        .save-btn {
          padding: 13px 32px; background: var(--blue-btn); border: none;
          border-radius: var(--radius-sm); color: #fff;
          font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700;
          cursor: pointer; letter-spacing: 0.02em;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: var(--shadow-btn);
          display: flex; align-items: center; gap: 8px;
        }
        .save-btn:hover:not(:disabled) {
          background: var(--blue-btn-h); transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(44,82,130,0.32);
        }
        .save-btn:active:not(:disabled) { transform: translateY(0); }
        .save-btn:disabled { opacity: 0.52; cursor: not-allowed; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.7s linear infinite;
        }

        .cancel-btn {
          padding: 13px 24px; background: transparent;
          border: 2px solid var(--border-idle); border-radius: var(--radius-sm);
          color: var(--ink-muted); font-family: 'Nunito', sans-serif;
          font-size: 14px; font-weight: 600; cursor: pointer;
          transition: border-color 0.2s, color 0.2s; text-decoration: none;
          display: inline-flex; align-items: center; gap: 7px;
        }
        .cancel-btn:hover { border-color: var(--blue-focus); color: var(--blue-focus); }

        .message {
          margin-top: 18px; padding: 13px 16px; border-radius: var(--radius-sm);
          font-size: 14px; text-align: center; font-weight: 500;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .message.error   { background: #fff5f5; border: 1.5px solid #fca5a5; color: #b91c1c; }
        .message.success { background: #f0fdf4; border: 1.5px solid #86efac; color: #15803d; }

        @media (max-width: 640px) {
          .navbar { padding: 0 20px; }
          .page   { padding: 24px 16px 48px; }
          .profile-banner { flex-direction: column; align-items: flex-start; padding: 24px; }
          .banner-tag { margin-left: 0; }
          .form-card  { padding: 24px 20px; }
          .fields-grid { grid-template-columns: 1fr; }
          .photo-section { flex-direction: column; align-items: flex-start; }
          .actions-row { flex-direction: column; }
          .save-btn, .cancel-btn { width: 100%; justify-content: center; }
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
          <a href="/dashboard" className="nav-back">
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 2L4 7l5 5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to dashboard
          </a>
          <div className="nav-avatar">
            {photoSrc
              ? <img src={photoSrc} alt="avatar"/>
              : initial
            }
          </div>
        </div>
      </nav>

      <main className="page">

        {/* Banner */}
        <div className="profile-banner">
          <div className="banner-dots" />
          <div className="banner-avatar">
            {photoSrc ? <img src={photoSrc} alt="profile"/> : initial}
          </div>
          <div className="banner-info">
            <h1 className="banner-name">
              <em>{form.full_name || user?.email?.split('@')[0]}</em>
            </h1>
            <p className="banner-email">{user?.email}</p>
          </div>
          <span className="banner-tag"><span className="tag-dot"/>Edit profile</span>
        </div>

        {/* Form */}
        <div className="form-card">
          <p className="card-heading">
            <svg viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="7.5" cy="5" r="2.8"/>
              <path d="M2 14c0-3.038 2.462-5.5 5.5-5.5S13 10.962 13 14" strokeLinecap="round"/>
            </svg>
            Personal information
          </p>

          {/* Photo upload */}
          <div className="photo-section">
            <div className="photo-preview">
              {photoSrc
                ? <img src={photoSrc} alt="Profile photo"/>
                : initial
              }
            </div>
            <div className="photo-info">
              <p className="photo-label">Profile photo</p>
              <p className="photo-hint">
                JPG or PNG · Max 2MB · Square photos work best
              </p>
            </div>
            <button
              className="photo-btn"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M7 1v8M4 4l3-3 3 3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 10v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1" strokeLinecap="round"/>
              </svg>
              {avatarPreview ? 'Change photo' : 'Upload photo'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
            />
          </div>

          <div className="fields-grid">

            {/* Full name */}
            <div className="field">
              <label className="field-label" htmlFor="full_name">
                Full name <span>*required</span>
              </label>
              <div className={`input-wrap${focusedField === 'full_name' ? ' focused' : ''}`}>
                <svg className="input-icon" viewBox="0 0 16 16" fill="none"
                  stroke="currentColor" strokeWidth="1.6">
                  <circle cx="8" cy="5" r="3"/>
                  <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" strokeLinecap="round"/>
                </svg>
                <input
                  id="full_name" name="full_name" type="text"
                  placeholder="Your full name"
                  value={form.full_name} onChange={handleChange}
                  onFocus={() => setFocusedField('full_name')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Username */}
            <div className="field">
              <label className="field-label" htmlFor="username">
                Username <span>optional</span>
              </label>
              <div className={`input-wrap${focusedField === 'username' ? ' focused' : ''}`}>
                <svg className="input-icon" viewBox="0 0 16 16" fill="none"
                  stroke="currentColor" strokeWidth="1.6">
                  <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1z"/>
                  <path d="M10.5 8c0 1.38-1.12 2.5-2.5 2.5S5.5 9.38 5.5 8 6.62 5.5 8 5.5 10.5 6.62 10.5 8z"/>
                </svg>
                <input
                  id="username" name="username" type="text"
                  placeholder="e.g. mercy_sharon"
                  value={form.username} onChange={handleChange}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Email read-only */}
            <div className="field field-readonly">
              <label className="field-label" htmlFor="email">
                Email address <span>cannot be changed here</span>
              </label>
              <div className="input-wrap">
                <svg className="input-icon" viewBox="0 0 16 16" fill="none"
                  stroke="currentColor" strokeWidth="1.6">
                  <path d="M2 4h12l-6 5.5L2 4z" strokeLinejoin="round"/>
                  <path d="M2 4v8h12V4" strokeLinejoin="round"/>
                </svg>
                <input id="email" type="email" value={user?.email || ''} readOnly/>
              </div>
              <p className="readonly-note">
                <svg viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <circle cx="5.5" cy="5.5" r="4.5"/>
                  <path d="M5.5 4.5v3M5.5 3.5v.5" strokeLinecap="round"/>
                </svg>
                Email is managed through your login settings
              </p>
            </div>

            {/* Phone */}
            <div className="field">
              <label className="field-label" htmlFor="phone">
                Phone <span>optional</span>
              </label>
              <div className={`input-wrap${focusedField === 'phone' ? ' focused' : ''}`}>
                <svg className="input-icon" viewBox="0 0 16 16" fill="none"
                  stroke="currentColor" strokeWidth="1.6">
                  <rect x="4" y="1" width="8" height="14" rx="2"/>
                  <circle cx="8" cy="12" r=".8" fill="currentColor" stroke="none"/>
                </svg>
                <input
                  id="phone" name="phone" type="tel"
                  placeholder="+254 700 000 000"
                  value={form.phone} onChange={handleChange}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Location */}
            <div className="field field-full">
              <label className="field-label" htmlFor="location">
                Location <span>optional</span>
              </label>
              <div className={`input-wrap${focusedField === 'location' ? ' focused' : ''}`}>
                <svg className="input-icon" viewBox="0 0 16 16" fill="none"
                  stroke="currentColor" strokeWidth="1.6">
                  <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.485-2.015-4.5-4.5-4.5z"/>
                  <circle cx="8" cy="6" r="1.5"/>
                </svg>
                <input
                  id="location" name="location" type="text"
                  placeholder="e.g. Nairobi, Kenya"
                  value={form.location} onChange={handleChange}
                  onFocus={() => setFocusedField('location')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="field field-full">
              <label className="field-label" htmlFor="bio">
                Bio <span>optional</span>
              </label>
              <div className={`input-wrap${focusedField === 'bio' ? ' focused' : ''}`}>
                <svg className="input-icon" style={{ top: 14, alignSelf: 'flex-start' }}
                  viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M2 4h12M2 8h8M2 12h6" strokeLinecap="round"/>
                </svg>
                <textarea
                  id="bio" name="bio"
                  placeholder="Tell us a little about yourself…"
                  value={form.bio} onChange={handleChange}
                  onFocus={() => setFocusedField('bio')}
                  onBlur={() => setFocusedField(null)}
                  maxLength={200}
                />
              </div>
              <p style={{ marginTop: 6, fontSize: 11, color: 'var(--ink-hint)', textAlign: 'right' }}>
                {form.bio.length}/200
              </p>
            </div>

          </div>

          {/* Actions */}
          <div className="actions-row">
            <a href="/dashboard" className="cancel-btn">Cancel</a>
            <button
              className="save-btn" onClick={handleSave}
              disabled={saving || uploading} type="button"
            >
              {saving || uploading
                ? <><div className="spinner"/>{uploading ? 'Uploading photo…' : 'Saving…'}</>
                : <>Save changes →</>
              }
            </button>
          </div>

          {message && (
            <div className={`message ${isSuccess ? 'success' : 'error'}`}>
              {isSuccess ? '✓' : '!'} {message}
            </div>
          )}

        </div>
      </main>
    </>
  )
}
