import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * OAuth & Email Confirmation Callback — PKCE Flow
 *
 * Handles:
 * 1. Google OAuth authorization code exchange
 * 2. Email verification token exchange (type=signup, type=email)
 * 3. Password recovery token exchange (type=recovery)
 *
 * Security:
 * - Validates redirect destinations against an allowlist
 * - Clears demo bypass cookies on successful authentication
 * - Uses generic error messages to prevent information leakage
 */

/** Only allow redirects to these origins / paths */
const ALLOWED_REDIRECT_PATHS = ["/dashboard", "/login", "/login/reset-password"];

function isAllowedRedirect(path: string): boolean {
  // Only allow relative paths from the allowlist
  return ALLOWED_REDIRECT_PATHS.some((allowed) => path.startsWith(allowed));
}

export async function GET(request: Request) {
  const { searchParams, protocol } = new URL(request.url);
  const host =
    request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto =
    request.headers.get("x-forwarded-proto") || protocol.replace(":", "");
  const origin = host ? `${proto}://${host}` : new URL(request.url).origin;
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const errorParam = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const next = searchParams.get("next") ?? "/dashboard";

  // Validate the redirect destination
  const redirectTo = isAllowedRedirect(next) ? next : "/dashboard";

  // Handle OAuth / PKCE errors (e.g., user canceled Google login)
  if (errorParam) {
    const message =
      errorParam === "access_denied"
        ? "Login was cancelled. Please try again."
        : errorDescription || "Authentication failed. Please try again.";
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(message)}`, origin)
    );
  }

  // Handle password recovery type — redirect to reset password page
  if (type === "recovery" && code) {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.redirect(
        new URL("/login?error=Authentication+service+not+configured", origin)
      );
    }

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        new URL(
          "/login?error=Password+reset+link+expired.+Please+request+a+new+one.",
          origin
        )
      );
    }

    return NextResponse.redirect(
      new URL("/login/reset-password", origin)
    );
  }

  // Handle authorization code exchange (OAuth or email confirmation)
  if (code) {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.redirect(
        new URL("/login?error=Authentication+service+not+configured", origin)
      );
    }

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      const message =
        type === "signup"
          ? "Email verification link expired or already used. Please sign in or request a new link."
          : "Authentication failed. Please try again.";
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(message)}`, origin)
      );
    }

    // Clear demo bypass cookie on successful real authentication
    const response = NextResponse.redirect(new URL(redirectTo, origin));
    response.cookies.set("csc-demo-bypass", "", {
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });
    return response;
  }

  // No code and no error — invalid callback, redirect to login
  return NextResponse.redirect(
    new URL("/login?error=Invalid+authentication+callback", origin)
  );
}
