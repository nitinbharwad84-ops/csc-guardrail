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

function LoginNotifications() {
  const searchParams = useSearchParams();
  const isLoggedOut = searchParams.get("logout") === "true";
  const isUnauthorized = searchParams.get("unauthorized") === "true";
  const isVerified = searchParams.get("verified") === "true";
  const errorParam = searchParams.get("error");

  const hasNotification =
    isLoggedOut || isUnauthorized || isVerified || Boolean(errorParam);
  if (!hasNotification) return null;

  return (
    <div className="space-y-3 mb-6">
      {isLoggedOut && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-900 flex items-start gap-2.5 shadow-2xs"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Successfully Signed Out</span>
            <p className="text-emerald-800">
              Your session cookies have been cleared. You are currently in public mode.
            </p>
          </div>
        </div>
      )}

      {isVerified && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-900 flex items-start gap-2.5 shadow-2xs"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Email Verified</span>
            <p className="text-emerald-800">
              Your email has been confirmed. Please sign in with your credentials to continue.
            </p>
          </div>
        </div>
      )}

      {isUnauthorized && (
        <div
          role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 flex items-start gap-2.5 shadow-2xs"
        >
          <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Authentication Required</span>
            <p className="text-amber-800">
              Access to workspace contracts requires valid credentials, or use the demo workspace below.
            </p>
          </div>
        </div>
      )}

      {errorParam && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-900 flex items-start gap-2.5 shadow-2xs"
        >
          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Authentication Error</span>
            <p className="text-rose-800">{errorParam}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function LoginClient() {
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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMessage(null);
    setValidationError(null);

    try {
      if (DEMO_MODE) {
        setErrorMessage(
          "Google sign-in requires Supabase credentials in .env.local. Use 'Explore Demo Workspace' below to evaluate offline."
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
          error.message ||
            "Unable to connect to Google provider. Please verify Supabase provider settings or use email sign-in."
        );
        setGoogleLoading(false);
      }
    } catch {
      setErrorMessage("Authentication connection failed. Please try again.");
      setGoogleLoading(false);
    }
  };

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
          "Supabase credentials are not configured in environment. Click 'Explore Demo Workspace' below to evaluate the offline VastraKart benchmark."
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
        setErrorMessage(
          "Invalid email or password. Please verify your credentials or reset your password."
        );
        setLoading(false);
        return;
      }

      if (data.session) {
        if (typeof document !== "undefined") {
          document.cookie =
            "csc-demo-bypass=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
        }
        router.push("/dashboard");
      }
    } catch {
      setErrorMessage("Authentication service unreachable. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-900">
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors rounded-lg px-2.5 py-1.5 hover:bg-slate-200/60"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Landing Page</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center text-center">
          <Link
            href="/"
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xs hover:bg-indigo-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            aria-label="CSC Guardrail Home"
          >
            <ShieldCheck className="h-7 w-7" aria-hidden="true" />
          </Link>
          <h1 className="mt-4 font-sans text-2xl font-bold tracking-tight text-slate-900">
            Sign In to CSC Guardrail
          </h1>
          <p className="mt-1.5 text-xs text-slate-500">
            Agency Workspace &middot; Fixed-Price Scope Protection
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-8 shadow-xs">
          <Suspense fallback={null}>
            <LoginNotifications />
          </Suspense>

          {validationError && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 flex items-start gap-2 shadow-2xs"
            >
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {errorMessage && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-900 flex items-start gap-2 shadow-2xs"
            >
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold">Notice:</span>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={anyLoading}
            className="inline-flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white py-2.5 px-4 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:opacity-50"
          >
            {googleLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <GoogleIcon className="h-4 w-4" />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 font-medium text-slate-400">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email / Password Form */}
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
                  className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
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
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus-visible:outline-none"
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
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-2.5 px-4 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:opacity-50"
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

          <p className="mt-4 text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/login/register"
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Create account
            </Link>
          </p>

          {/* Divider: Demo Workspace Below Form */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="bg-white px-3 font-semibold text-slate-400 text-[10px]">
                Or evaluate offline
              </span>
            </div>
          </div>

          {/* Demo Workspace Access Card — server-side POST form to /login/demo */}
          <div className="rounded-xl border border-indigo-200/90 bg-indigo-50/60 p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-xs font-bold text-slate-900 block">
                  Isolated Demo Workspace
                </span>
                <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                  Evaluate CSC Guardrail with the pre-loaded <strong>PixelCraft Studio</strong> &middot; VastraKart contract (₹1,50,000 cap &middot; 120 hrs).
                </p>
                <form
                  action="/login/demo"
                  method="POST"
                  onSubmit={() => setDemoLoading(true)}
                >
                  <button
                    type="submit"
                    disabled={anyLoading}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:opacity-60"
                  >
                    {demoLoading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Opening Demo...</span>
                      </>
                    ) : (
                      <>
                        <span>Explore Demo Workspace</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Need help? Review the{" "}
          <Link href="/" className="font-medium text-indigo-600 hover:underline">
            CSC Guardrail Architecture
          </Link>
        </p>
      </div>
    </div>
  );
}
