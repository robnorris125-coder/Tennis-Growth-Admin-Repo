"use client";

import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "../../../lib/supabase/client";

export default function ResetPasswordPage() {
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [message, setMessage] = useState("");
const [success, setSuccess] = useState(false);
const [busy, setBusy] = useState(false);

async function updatePassword(event: FormEvent) {
event.preventDefault();
setMessage("");

if (password.length < 8) {
setMessage("Use at least 8 characters.");
return;
}

if (password !== confirmPassword) {
setMessage("Passwords do not match.");
return;
}

setBusy(true);

const { error } = await createSupabaseBrowserClient().auth.updateUser({
password,
});

if (error) {
setMessage(error.message);
setBusy(false);
return;
}

setSuccess(true);
setBusy(false);
}

if (success) {
return (
<main style={styles.page}>
<section style={styles.card}>
<div style={styles.brand}>Tennis Growth</div>
<h1 style={styles.heading}>Password updated</h1>
<p style={styles.copy}>
Your password has been changed successfully. You can now log in.
</p>
<a href="/login" style={styles.primaryLink}>
Go to login
</a>
</section>
</main>
);
}

return (
<main style={styles.page}>
<section style={styles.card}>
<div style={styles.brand}>Tennis Growth</div>
<h1 style={styles.heading}>Create a new password</h1>
<p style={styles.copy}>Choose a new password for your account.</p>

<form onSubmit={updatePassword}>
<label style={styles.label}>
New password
<div style={styles.passwordWrap}>
<input
style={styles.input}
type={showPassword ? "text" : "password"}
value={password}
onChange={(event) => setPassword(event.target.value)}
autoComplete="new-password"
required
disabled={busy}
/>
<button
type="button"
onClick={() => setShowPassword((value) => !value)}
style={styles.showButton}
>
{showPassword ? "Hide" : "Show"}
</button>
</div>
</label>

<label style={styles.label}>
Confirm new password
<input
style={styles.input}
type={showPassword ? "text" : "password"}
value={confirmPassword}
onChange={(event) => setConfirmPassword(event.target.value)}
autoComplete="new-password"
required
disabled={busy}
/>
</label>

<button type="submit" style={styles.primaryButton} disabled={busy}>
{busy ? "Updating..." : "Update password"}
</button>
</form>

{message && <p style={styles.message}>{message}</p>}

<a href="/login" style={styles.secondaryLink}>
Back to login
</a>
</section>
</main>
);
}

const styles: Record<string, React.CSSProperties> = {
page: {
minHeight: "100vh",
background: "#f4f7f5",
display: "flex",
alignItems: "center",
justifyContent: "center",
padding: "24px",
fontFamily: "Inter, Segoe UI, Arial, sans-serif",
},
card: {
width: "100%",
maxWidth: "440px",
background: "#ffffff",
borderRadius: "20px",
padding: "36px",
boxShadow: "0 18px 50px rgba(20, 50, 30, 0.10)",
},
brand: {
color: "#1e8449",
fontWeight: 800,
fontSize: "18px",
marginBottom: "18px",
},
heading: {
margin: "0 0 10px",
fontSize: "30px",
color: "#173d26",
},
copy: {
margin: "0 0 26px",
color: "#66736b",
lineHeight: 1.5,
},
label: {
display: "block",
marginBottom: "18px",
fontWeight: 600,
color: "#243c2d",
},
passwordWrap: {
position: "relative",
},
input: {
width: "100%",
boxSizing: "border-box",
marginTop: "8px",
padding: "13px 14px",
border: "1px solid #d8e1db",
borderRadius: "10px",
fontSize: "16px",
outline: "none",
},
showButton: {
position: "absolute",
right: "10px",
top: "50%",
transform: "translateY(-25%)",
border: "none",
background: "transparent",
color: "#1e8449",
fontWeight: 700,
cursor: "pointer",
},
primaryButton: {
width: "100%",
border: "none",
borderRadius: "10px",
padding: "14px",
background: "#1e8449",
color: "#fff",
fontWeight: 700,
fontSize: "16px",
cursor: "pointer",
},
primaryLink: {
display: "block",
textAlign: "center",
textDecoration: "none",
borderRadius: "10px",
padding: "14px",
background: "#1e8449",
color: "#fff",
fontWeight: 700,
},
secondaryLink: {
display: "block",
textAlign: "center",
marginTop: "18px",
color: "#1e8449",
textDecoration: "none",
fontWeight: 700,
},
message: {
marginTop: "16px",
color: "#b04a1b",
background: "#fff4ed",
padding: "10px 12px",
borderRadius: "8px",
},
};
