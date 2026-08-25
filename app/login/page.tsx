"use client";

import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "../../lib/supabase/client";

// You may want to move these styles to a CSS/SCSS file.
const pageStyles = `
.tg-login-root {
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  background: #f8f9fa;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
}
.tg-login-left {
  background: linear-gradient(135deg, #28b463 0%, #1e8449 100%);
  color: #fff;
  flex: 1.1 1 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 3rem;
  min-width: 0;
}
.tg-login-logo {
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  background: linear-gradient(90deg, #fff 60%, #a3fa8c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}
.tg-login-brand {
  font-size: 1.15rem;
  font-weight: 400;
  opacity: 0.85;
  margin-bottom: 2rem;
  letter-spacing: 0.04em;
  text-shadow: 0 2px 12px rgba(0,0,0,0.08);
}
.tg-login-pitch {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 0.7rem;
}
.tg-login-desc {
  font-size: 1.1rem;
  opacity: 0.86;
  font-weight: 400;
  margin-bottom: 2rem;
  max-width: 350px;
}
.tg-login-card {
  background: #fff;
  border-radius: 1.25rem;
  box-shadow: 0 8px 32px rgba(40, 180, 99, 0.10), 0 1.5px 4px rgba(44, 62, 80, 0.08);
  padding: 2.5rem 2.1rem 2.3rem;
  max-width: 370px;
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.tg-login-card h1 {
  font-size: 1.35rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  color: #1e8449;
  letter-spacing: 0.01em;
}
.tg-input-group {
  margin-bottom: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.tg-input-label {
  font-size: 1rem;
  font-weight: 500;
  color: #183c22;
  margin-bottom: 0.18rem;
  letter-spacing: 0.02em;
}
.tg-input-row {
  position: relative;
  display: flex;
  align-items: center;
}
.tg-input {
  width: 100%;
  font-size: 1rem;
  padding: 0.68rem 0.9rem;
  border-radius: 0.6rem;
  border: 1.3px solid #e2e3e4;
  background: #f8faf9;
  font-weight: 450;
  outline: none;
  transition: border-color .18s;
}
.tg-input:focus {
  border-color: #73ecac;
  background: #fff;
}
.tg-show-hide-btn {
  background: none;
  border: none;
  position: absolute;
  right: 0.7rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.99rem;
  color: #1e8449;
  opacity: 0.73;
  cursor: pointer;
  padding: 0 0.36em;
  font-weight: 600;
}
.tg-signin-btn {
  width: 100%;
  margin-top: 0.7rem;
  background: linear-gradient(96deg, #28b463 80%, #73ecac 120%);
  color: #fff;
  font-weight: 700;
  font-size: 1.09rem;
  border: none;
  border-radius: 0.6rem;
  padding: 0.85rem 0;
  letter-spacing: 0.01em;
  box-shadow: 0 2px 12px rgba(40, 180, 99, 0.11);
  cursor: pointer;
  outline: none;
  transition: background 0.14s, filter 0.12s;
  filter: saturate(1.14);
}
.tg-signin-btn:disabled {
  opacity: 0.58;
  cursor: not-allowed;
}
.tg-magic-link-btn {
  background: none;
  color: #1e8449;
  font-weight: 600;
  border: none;
  margin: 0.5rem 0 0 0;
  padding: 0;
  cursor: pointer;
  font-size: 0.99rem;
  letter-spacing: 0.01em;
  text-decoration: underline;
  opacity: 0.98;
  transition: color 0.1s;
}
.tg-magic-link-btn:disabled {
  color: #b1cbb4;
  opacity: 0.72;
}
.tg-login-message {
  margin-top: 0.9rem;
  color: #d35400;
  font-weight: 500;
  font-size: 1rem;
  background: #f3efe1;
  border-radius: 0.4rem;
  padding: 0.5rem 0.95rem;
  max-width: 100%;
  line-height: 1.45;
}
@media (max-width: 900px) {
  .tg-login-root { flex-direction: column; }
  .tg-login-left { min-height: 180px; padding: 2.5rem 1.1rem; }
  .tg-login-card { max-width: 99vw; margin: 2rem auto; padding: 2rem 0.8rem; }
}
@media (max-width: 600px) {
  .tg-login-left {
    font-size: 90%;
    padding: 1.2rem 0.5rem 0.7rem;
    min-height: 110px;
  }
  .tg-login-card {
    padding: 1.2rem 0.2rem 1.2rem;
    border-radius: 1rem;
  }
}
`;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const { error } = await createSupabaseBrowserClient().auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      setBusy(false);
      return;
    }
    window.location.assign("/");
  }

  async function sendMagicLink() {
    if (!email) {
      setMessage("Enter your email address first.");
      return;
    }
    setBusy(true);
    setMessage("");
    const { error } = await createSupabaseBrowserClient().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
    });
    setMessage(error ? error.message : "Check your email for your secure sign-in link.");
    setBusy(false);
  }

  return (
    <>
      <style>{pageStyles}</style>
      <div className="tg-login-root">
        <section className="tg-login-left">
          <span className="tg-login-logo">TG</span>
          <div className="tg-login-brand">Tennis Growth Admin</div>
          <div className="tg-login-pitch">
            Welcome Back
          </div>
          <div className="tg-login-desc">
            Sign in to manage your tennis business with confidence. Simple, secure, and designed for ambitious club admins and coaches.
          </div>
        </section>
        <section className="tg-login-card" aria-label="Sign in form">
          <h1>Sign in to your business</h1>
          <form onSubmit={signIn} autoComplete="on">
            <div className="tg-input-group">
              <label className="tg-input-label" htmlFor="tg-login-email">Email address</label>
              <div className="tg-input-row">
                <input
                  id="tg-login-email"
                  className="tg-input"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={busy}
                />
              </div>
            </div>
            <div className="tg-input-group">
              <label className="tg-input-label" htmlFor="tg-login-password">Password</label>
              <div className="tg-input-row">
                <input
                  id="tg-login-password"
                  className="tg-input"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={busy}
                />
                <button
                  type="button"
                  className="tg-show-hide-btn"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={0}
                  disabled={busy}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <button
              className="tg-signin-btn"
              type="submit"
              disabled={busy}
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <button
            className="tg-magic-link-btn"
            disabled={busy}
            onClick={sendMagicLink}
            tabIndex={0}
            type="button"
            style={{ marginTop: "0.4rem" }}
          >
            Email me a secure sign-in link
          </button>
          {message && (
            <p role="status" className="tg-login-message">
              {message}
            </p>
          )}
        </section>
      </div>
    </>
  );
}
