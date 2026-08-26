"use client";

import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "../../lib/supabase/client";

const styles = `
.tg-auth-page {
min-height: 100vh;
background: #f4f7f5;
display: flex;
align-items: center;
justify-content: center;
padding: 24px;
font-family: Inter, "Segoe UI", Arial, sans-serif;
}

.tg-auth-card {
width: 100%;
max-width: 440px;
background: #ffffff;
border-radius: 20px;
padding: 38px 36px;
box-shadow: 0 18px 50px rgba(20, 50, 30, 0.10);
}

.tg-brand {
color: #1e8449;
font-size: 20px;
font-weight: 800;
margin-bottom: 22px;
}

.tg-heading {
margin: 0 0 10px;
color: #173d26;
font-size: 30px;
line-height: 1.15;
}

.tg-copy {
margin: 0 0 28px;
color: #66736b;
line-height: 1.55;
}

.tg-field {
margin-bottom: 18px;
}

.tg-label {
display: block;
margin-bottom: 8px;
color: #243c2d;
font-weight: 600;
}

.tg-input-wrap {
position: relative;
}

.tg-input {
width: 100%;
box-sizing: border-box;
padding: 13px 14px;
border: 1px solid #d8e1db;
border-radius: 10px;
font-size: 16px;
background: #ffffff;
outline: none;
}

.tg-input:focus {
border-color: #1e8449;
box-shadow: 0 0 0 3px rgba(30, 132, 73, 0.08);
}

.tg-password-input {
padding-right: 68px;
}

.tg-show {
position: absolute;
right: 10px;
top: 50%;
transform: translateY(-50%);
border: 0;
background: transparent;
color: #1e8449;
font-weight: 700;
cursor: pointer;
}

.tg-forgot-row {
display: flex;
justify-content: flex-end;
margin-top: -6px;
margin-bottom: 20px;
}

.tg-link-button {
border: 0;
background: transparent;
color: #1e8449;
font-weight: 700;
padding: 0;
cursor: pointer;
font-size: 14px;
}

.tg-primary {
width: 100%;
border: 0;
border-radius: 10px;
padding: 14px;
background: #1e8449;
color: #ffffff;
font-size: 16px;
font-weight: 700;
cursor: pointer;
}

.tg-primary:disabled {
opacity: 0.6;
cursor: not-allowed;
}

.tg-message {
margin-top: 18px;
padding: 12px 14px;
border-radius: 10px;
background: #fff4ed;
color: #9b451c;
line-height: 1.45;
}

.tg-success {
margin-top: 18px;
padding: 14px;
border-radius: 10px;
background: #eef8f1;
color: #245c35;
line-height: 1.5;
}

.tg-back {
margin-top: 22px;
text-align: center;
}

@media (max-width: 520px) {
.tg-auth-page {
padding: 16px;
}

.tg-auth-card {
padding: 30px 22px;
}

.tg-heading {
font-size: 27px;
}
}
`;

export default function LoginPage() {
const [mode, setMode] = useState<"login" | "forgot">("login");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [message, setMessage] = useState("");
const [resetSent, setResetSent] = useState(false);
const [busy, setBusy] = useState(false);

async function signIn(event: FormEvent) {
event.preventDefault();
setMessage("");
setBusy(true);

const { error } = await createSupabaseBrowserClient().auth.signInWithPassword({
email,
password,
});

if (error) {
setMessage(error.message);
setBusy(false);
return;
}

window.location.assign("/");
}

async function sendReset(event: FormEvent) {
event.preventDefault();
setMessage("");

if (!email) {
setMessage("Enter your email address.");
return;
}

setBusy(true);

const { error } =
await createSupabaseBrowserClient().auth.resetPasswordForEmail(email, {
redirectTo: `${window.location.origin}/auth/reset-password`,
});

if (error) {
setMessage(error.message);
setBusy(false);
return;
}

setResetSent(true);
setBusy(false);
}

function showForgotPassword() {
setMode("forgot");
setMessage("");
setResetSent(false);
}

function showLogin() {
setMode("login");
setMessage("");
setResetSent(false);
}

return (
<>
<style>{styles}</style>

<main className="tg-auth-page">
<section className="tg-auth-card">
<div className="tg-brand">Tennis Growth</div>

{mode === "login" ? (
<>
<h1 className="tg-heading">Welcome back</h1>

<p className="tg-copy">
Log in to manage your business, players, programmes and payments.
</p>

<form onSubmit={signIn}>
<div className="tg-field">
<label className="tg-label" htmlFor="email">
Email address
</label>

<input
id="email"
className="tg-input"
type="email"
value={email}
onChange={(event) => setEmail(event.target.value)}
autoComplete="email"
required
disabled={busy}
/>
</div>

<div className="tg-field">
<label className="tg-label" htmlFor="password">
Password
</label>

<div className="tg-input-wrap">
<input
id="password"
className="tg-input tg-password-input"
type={showPassword ? "text" : "password"}
value={password}
onChange={(event) => setPassword(event.target.value)}
autoComplete="current-password"
required
disabled={busy}
/>

<button
className="tg-show"
type="button"
onClick={() =>
setShowPassword((current) => !current)
}
>
{showPassword ? "Hide" : "Show"}
</button>
</div>
</div>

<div className="tg-forgot-row">
<button
className="tg-link-button"
type="button"
onClick={showForgotPassword}
>
Forgot password?
</button>
</div>

<button
className="tg-primary"
type="submit"
disabled={busy}
>
{busy ? "Logging in..." : "Log in"}
</button>
</form>
</>
) : (
<>
<h1 className="tg-heading">Reset your password</h1>

<p className="tg-copy">
Enter your email address and we’ll send you a link to reset your
password.
</p>

{!resetSent ? (
<form onSubmit={sendReset}>
<div className="tg-field">
<label className="tg-label" htmlFor="reset-email">
Email address
</label>

<input
id="reset-email"
className="tg-input"
type="email"
value={email}
onChange={(event) => setEmail(event.target.value)}
autoComplete="email"
required
disabled={busy}
/>
</div>

<button
className="tg-primary"
type="submit"
disabled={busy}
>
{busy ? "Sending..." : "Send reset link"}
</button>
</form>
) : (
<div className="tg-success" role="status">
<strong>Check your email.</strong>
<br />
If an account exists for that email address, we’ve sent a
password reset link.
</div>
)}

<div className="tg-back">
<button
className="tg-link-button"
type="button"
onClick={showLogin}
>
Back to login
</button>
</div>
</>
)}

{message && (
<div className="tg-message" role="status">
{message}
</div>
)}
</section>
</main>
</>
);
}
