"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  AlertTriangle,
  Loader2,
  Sparkles,
  Lock,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Info,
} from "lucide-react";
import { createClient, DEMO_MODE } from "@/lib/supabase/client";

/* ------------------------------------------------------------------ */
/* Google brand icon (official SVG, no external dependency)            */
/* ------------------------------------------------------------------ */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
        fill="#EA4335"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Notification banners — isolated in their own component so they can */
/* use useSearchParams() inside a Suspense boundary without blocking  */
/* the full page from prerendering.                                   */
/* ------------------------------------------------------------------ */
function LoginNotifications() {
  const searchParams = useSearchParams();
  const isLoggedOut = searchParams.get("logout") === "true";
  const isUnauthorized = searchParams.get("unauthorized") === "true";
  const isVerified = searchParams.get("verified") === "true";
  const errorParam = searchParams.get("error");

  const hasNotification = isLoggedOut || isUnauthorized || isVerified || errorParam;
  if (!hasNotification) return null;

  return (
    <>
      {/* Sign-out confirmation */}
      {isLoggedOut && (
        <div
          role="status"
          className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-900 flex items-start gap-2.5"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Successfully Signed Out</span>
            <p className="text-emerald-800">
              Session cookies have been cleared. You are in public mode.
            </p>
          </div>
        </div>
      )}

      {/* Email verified confirmation */}
      {isVerified && (
        <div
          role="status"
          className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-900 flex items-start gap-2.5"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Email Verified</span>
            <p className="text-emerald-800">
              Your email has been confirmed. Please sign in to continue.
            </p>
          </div>
        </div>
      )}

      {/* Unauthorized access notice */}
      {isUnauthorized && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 flex items-start gap-2.5"
        >
          <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Authentication Required</span>
            <p className="text-amber-800">
              Access to live agency contracts requires valid credentials, or
              click below for the isolated demo workspace.
            </p>
          </div>
        </div>
      )}

      {/* OAuth / callback error */}
      {errorParam && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-900 flex items-start gap-2.5"
        >
          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Authentication Error</span>
            <p className="text-red-800">{errorParam}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const anyLoading = loading || googleLoading || demoLoading;

  /* ---- Demo Bypass ---- */
  const handleDemoBypass = () => {
    setDemoLoading(true);
    setErrorMessage(null);
    setValidationError(null);

    if (typeof document !== "undefined") {
      document.cookie =
        "csc-demo-bypass=true; path=/; max-age=86400; SameSite=Lax";
    }

    setTimeout(() => {
      router.push("/dashboard");
    }, 200);
  };

  /* ---- Google OAuth ---- */
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMessage(null);
    setValidationError(null);

    try {
      if (DEMO_MODE) {
        setErrorMessage(
          "Google sign-in requires Supabase credentials. Use the demo workspace below."
        );
        setGoogleLoading(false);
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/login/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        setErrorMessage(
          "Unable to start Google sign-in. Please try again or use email."
        );
        setGoogleLoading(false);
      }
      // On success, the browser is redirected to Google — no further action needed
    } catch {
      setErrorMessage("Connection error. Please try again.");
      setGoogleLoading(false);
    }
  };

  /* ---- Email/Password Sign In ---- */
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setValidationError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setValidationError("Please enter your agency email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setValidationError(
        "Please enter a valid email address (e.g. lead@pixelcraft.studio)."
      );
      return;
    }

    if (!password) {
      setValidationError("Please enter your account password.");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (DEMO_MODE) {
        setErrorMessage(
          "Supabase credentials not configured. Click 'Enter Demo Workspace' above to access the VastraKart benchmark."
        );
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        // Generic message to prevent account enumeration
        setErrorMessage(
          "Invalid email or password. Please check your credentials."
        );
        setLoading(false);
        return;
      }

      if (data.session) {
        // Clear demo bypass cookie when switching to authenticated mode
        if (typeof document !== "undefined") {
          document.cookie =
            "csc-demo-bypass=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
        }
        router.push("/dashboard");
      }
    } catch {
      setErrorMessage("Authentication connection failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      {/* Top back navigation */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors rounded-lg px-2.5 py-1.5 hover:bg-slate-200/50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Landing Page</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <Link
            href="/"
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xs hover:bg-indigo-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            <ShieldCheck className="h-7 w-7" aria-hidden="true" />
          </Link>
          <h1 className="mt-4 font-sans text-2xl font-bold tracking-tight text-slate-900">
            Agency Workspace Sign In
          </h1>
          <p className="mt-1.5 text-xs text-slate-500">
            Access CSC Guardrail for <strong>PixelCraft Studio</strong>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs">
          {/* Notification banners — Suspense boundary for useSearchParams */}
          <Suspense fallback={null}>
            <LoginNotifications />
          </Suspense>

          {/* Quick Demo Workspace Access */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-4 mb-6">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-xs font-bold text-indigo-950">
                  Hackathon / Evaluation Demo Access
                </span>
                <p className="mt-0.5 text-xs text-indigo-800 leading-relaxed">
                  Enter the isolated <strong>PixelCraft Studio</strong>{" "}
                  workspace with pre-loaded VastraKart fixed contract data
                  (₹1,50,000 cap · 120 hrs).
                </p>
                <button
                  type="button"
                  onClick={handleDemoBypass}
                  disabled={anyLoading}
                  className="mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:opacity-60"
                >
                  {demoLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Entering Demo Workspace...</span>
                    </>
                  ) : (
                    <>
                      <span>Enter Demo Workspace (PixelCraft Studio)</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 font-semibold text-slate-400">
                Or sign in with your account
              </span>
            </div>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={anyLoading}
            className="mb-4 inline-flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white py-2.5 px-4 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:opacity-50"
          >
            {googleLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <GoogleIcon className="h-4 w-4" />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Email divider */}
          <div className="relative mb-4">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-400">
                or use email
              </span>
            </div>
          </div>

          {/* Validation Error */}
          {validationError && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 flex items-start gap-2"
            >
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Auth Error */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800 flex items-start gap-2"
            >
              <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold">Authentication Notice:</span>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleSignIn} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700"
              >
                Agency Email Address
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="lead@pixelcraft.studio"
                  required
                  className="block w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Password
                </label>
                <Link
                  href="/login/forgot-password"
                  className="text-[11px] font-medium text-indigo-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="block w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={anyLoading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-slate-900 py-2.5 px-4 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <span>Sign In with Email</span>
              )}
            </button>
          </form>

          {/* Create account link */}
          <p className="mt-5 text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/login/register"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Create account
            </Link>
          </p>

          {/* Security & Isolation Disclaimer */}
          <div className="mt-6 border-t border-slate-100 pt-4">
            <div className="flex items-start gap-2 text-[11px] text-slate-500">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Demo mode delivers isolated in-memory benchmark data. Demo
                bypass cookies never grant authorization to live production
                databases.
              </span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Need help? Review the{" "}
          <Link
            href="/"
            className="font-medium text-indigo-600 hover:underline"
          >
            CSC Guardrail Playbook
          </Link>
        </p>
      </div>
    </div>
  );
}
