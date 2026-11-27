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
/* Notification banners — isolated in their own component so they can */
/* use useSearchParams() inside a Suspense boundary without blocking  */
/* the full page from prerendering.                                   */
/* ------------------------------------------------------------------ */
function LoginNotifications() {
  const searchParams = useSearchParams();
  const isLoggedOut = searchParams.get("logout") === "true";
  const isUnauthorized = searchParams.get("unauthorized") === "true";

  if (!isLoggedOut && !isUnauthorized) return null;

  return (
    <>
      {/* Sign-out confirmation message */}
      {isLoggedOut && (
        <div
          role="status"
          className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-900 flex items-start gap-2.5"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Successfully Signed Out</span>
            <p className="text-emerald-800">
              Demo session cookies have been cleared. You are in public mode.
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
              Access to live agency contracts requires valid credentials, or click below for the isolated demo workspace.
            </p>
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
  const [demoLoading, setDemoLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleDemoBypass = () => {
    setDemoLoading(true);
    setErrorMessage(null);
    setValidationError(null);

    // Set demo cookie strictly for isolated benchmark session tracking
    if (typeof document !== "undefined") {
      document.cookie =
        "csc-demo-bypass=true; path=/; max-age=86400; SameSite=Lax";
    }

    // Direct transition to dashboard demo workspace
    setTimeout(() => {
      router.push("/dashboard");
    }, 200);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setValidationError(null);

    // Basic client validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setValidationError("Please enter your agency email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setValidationError("Please enter a valid email address (e.g. lead@pixelcraft.studio).");
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
        // If Supabase environment credentials are not configured, guide to Demo Mode
        setErrorMessage(
          "Supabase credentials not configured in environment. Click 'Enter Demo Workspace' below to access the full offline VastraKart benchmark."
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
        setErrorMessage(error.message || "Invalid credentials. Please verify your email and password.");
        setLoading(false);
        return;
      }

      if (data.session) {
        // Clear any old demo bypass cookie when switching to authenticated mode
        if (typeof document !== "undefined") {
          document.cookie =
            "csc-demo-bypass=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
        }
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication connection failed.";
      setErrorMessage(msg);
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
                  Enter the isolated <strong>PixelCraft Studio</strong> workspace with pre-loaded
                  VastraKart fixed contract data (₹1,50,000 cap · 120 hrs).
                </p>
                <button
                  type="button"
                  onClick={handleDemoBypass}
                  disabled={demoLoading || loading}
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

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 font-semibold text-slate-400">
                Or sign in with agency credentials
              </span>
            </div>
          </div>

          {/* Alert: Validation Error */}
          {validationError && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 flex items-start gap-2"
            >
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Alert: Auth Error */}
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

          {/* Standard Login Form */}
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
                <span className="text-[11px] text-slate-400">
                  Supabase Auth
                </span>
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
              disabled={loading || demoLoading}
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

          {/* Security & Isolation Disclaimer */}
          <div className="mt-6 border-t border-slate-100 pt-4">
            <div className="flex items-start gap-2 text-[11px] text-slate-500">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Demo mode delivers isolated in-memory benchmark data. Demo bypass cookies
                never grant authorization to live production databases.
              </span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Need help? Review the{" "}
          <Link href="/" className="font-medium text-indigo-600 hover:underline">
            CSC Guardrail Playbook
          </Link>
        </p>
      </div>
    </div>
  );
}
