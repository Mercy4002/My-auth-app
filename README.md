# 🔐 AuthApp — Authentication System (Next.js + Supabase)

A full-stack authentication system built with Next.js and Supabase. Users can sign up and log in using their email or Google account, reset their password, and access a protected personal dashboard.

---

## 🚀 Features

- 🔑 Google OAuth sign-in
- 📧 Email and password signup and login
- 🔁 Forgot password and reset flow
- 🏠 Protected dashboard — only accessible when logged in
- 🔗 Account linking — Google and email login connect to the same account
- 🎨 Clean, responsive UI across all pages
- 🛡️ Environment variable protection via `.env.local`

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router)
- **Backend / Auth:** Supabase
- **Database:** Supabase PostgreSQL
- **Google Login:** Google Cloud OAuth 2.0
- **Deployment:** Vercel

---

## 📂 Project Structure

```
/app
  /signup           → Create a new account
  /login            → Sign in page
  /forgot-password  → Request a password reset
  /update-password  → Set a new password
  /dashboard        → Protected user dashboard
  /auth/callback    → Handles OAuth redirects
  /api/signout      → Signs the user out
/lib
  supabase.js       → Supabase browser client
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Mercy4002/My-auth-app.git
cd My-auth-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root folder and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

You can find both values in your Supabase project under **Settings → API**.

### 4. Run the development server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 🔐 Authentication Methods

- **Google Sign-In** — one click login via Google OAuth
- **Email and Password** — traditional signup and login with confirmation
- **Password Reset** — secure reset link sent to your email

---

## 📌 Notes

- `.env.local` is gitignored and never committed
- Google OAuth requires the correct redirect URLs set in Google Cloud Console
- Supabase handles all session management and token storage

---

## 🌟 Future Improvements

- Add username-based login
- Implement role-based access control
- Build out a full user profile page
- Add two-factor authentication (2FA)

---

## 👩‍💻 Author

Mercy Sharon
