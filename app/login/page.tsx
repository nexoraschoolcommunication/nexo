"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Method = "google" | "email" | "phone";

export default function LoginPage() {
  const [method, setMethod] = useState<Method>("google");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const supabase = createClient();

  async function withGoogle() {
    setStatus(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard` },
    });
    if (error) setStatus(error.message);
  }

  async function withMagicLink() {
    setStatus(null);
    if (!email.includes("@")) { setStatus("Enter a valid email address."); return; }
    // NOTE: Supabase Auth also expects a Turnstile token here in production —
    // captured via the Turnstile widget and passed as `captchaToken` below —
    // once NEXT_PUBLIC_TURNSTILE_SITE_KEY is set and the widget is mounted.
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard` },
    });
    setStatus(error ? error.message : "Check your inbox for a sign-in link.");
  }

  async function withPhone() {
    setStatus(null);
    if (phone.trim().length < 8) { setStatus("Enter a valid phone number."); return; }
    const { error } = await supabase.auth.signInWithOtp({ phone });
    setStatus(error ? error.message : "Enter the code we texted you.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm border border-zinc bg-obsidian rounded-lg p-8 elev-2">
        <Link href="/" className="flex items-center gap-2.5 mb-8">
          <img src="/logo.png" alt="Nexo Logo" className="h-8 w-auto" />
          <span className="font-display font-semibold text-lg">Nexo</span>
        </Link>

        <h1 className="font-display font-semibold text-xl mb-1">Sign in to Nexo</h1>
        <p className="text-ink-500 text-sm mb-6">Choose how you'd like to continue.</p>

        <div className="flex border border-zinc rounded-md p-1 mb-6">
          {(["google", "email", "phone"] as Method[]).map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`flex-1 text-xs font-medium py-2 rounded-md transition-colors ${
                method === m ? "bg-slate text-ink-100" : "text-ink-500"
              }`}
            >
              {m === "google" ? "Google" : m === "email" ? "Email" : "Phone"}
            </button>
          ))}
        </div>

        {method === "google" && (
          <button
            onClick={withGoogle}
            className="w-full flex items-center justify-center gap-2.5 border border-zinc rounded-md py-2.5 text-sm font-medium hover:border-cyan/40 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.6 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 6 29.6 4 24 4c-7.6 0-14.1 4.3-17.7 10.7z"/><path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.4l-6.3-5.3C29.4 35 26.8 36 24 36c-5.4 0-9.9-3.4-11.5-8.1l-6.5 5C9.8 39.6 16.4 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.3 5.4-6.2 6.9l6.3 5.3C39.4 37.4 44 31.3 44 24c0-1.2-.1-2.4-.4-3.5z"/></svg>
            Continue with Google
          </button>
        )}

        {method === "email" && (
          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-slate border border-zinc rounded-md px-4 py-2.5 text-sm focus-ring"
            />
            {/* Mount your Turnstile widget here once NEXT_PUBLIC_TURNSTILE_SITE_KEY is set */}
            <button
              onClick={withMagicLink}
              className="w-full bg-blue text-white font-medium py-2.5 rounded-md hover:bg-blue/90 transition-colors"
            >
              Send magic link
            </button>
          </div>
        )}

        {method === "phone" && (
          <div className="space-y-3">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 000 0000"
              className="w-full bg-slate border border-zinc rounded-md px-4 py-2.5 text-sm focus-ring"
            />
            <button
              onClick={withPhone}
              className="w-full bg-blue text-white font-medium py-2.5 rounded-md hover:bg-blue/90 transition-colors"
            >
              Send verification code
            </button>
          </div>
        )}

        {status && <p className="text-xs text-cyan mt-4">{status}</p>}

        <p className="text-ink-500 text-xs mt-6 leading-relaxed">
          By continuing you agree to Nexo's{" "}
          <Link href="/terms" className="text-ink-400 underline hover:text-ink-100">Terms</Link> and{" "}
          <Link href="/privacy" className="text-ink-400 underline hover:text-ink-100">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
