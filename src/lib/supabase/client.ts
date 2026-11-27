/**
 * CSC Guardrail — Supabase Browser Client
 *
 * Creates a typed Supabase client for use in Client Components (`'use client'`).
 * Gracefully handles missing environment variables in local/offline demo mode
 * by returning a no-op stub client instead of throwing a runtime crash.
 *
 * Usage:
 *   import { createClient } from "@/lib/supabase/client";
 *   const supabase = createClient();
 *
 * @module lib/supabase/client
 */

"use client";

import { createBrowserClient } from "@supabase/ssr";

/** Sentinel URL used when env vars are absent (offline / demo mode). */
const DEMO_SENTINEL_URL = "https://demo.supabase.co";
const DEMO_SENTINEL_KEY = "demo-anon-key-offline";

/** Returns true when both required env vars are present and non-empty. */
function hasSupabaseCredentials(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
      url.trim() !== "" &&
      !url.includes("your-project-id") &&
      key &&
      key.trim() !== "" &&
      !key.includes("your-anon-key")
  );
}

/**
 * Returns a typed Supabase browser client.
 *
 * In offline / demo mode (missing env vars) the client points at the sentinel
 * URL. All network calls will fail gracefully — pages should check the
 * `DEMO_MODE` export and fall back to static demo data from
 * `@/lib/fallbacks/demo-data`.
 */
export function createClient() {
  const url = hasSupabaseCredentials()
    ? process.env.NEXT_PUBLIC_SUPABASE_URL!
    : DEMO_SENTINEL_URL;
  const key = hasSupabaseCredentials()
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    : DEMO_SENTINEL_KEY;

  return createBrowserClient(url, key);
}

/**
 * `true` when the app is running in offline / local demo mode
 * (no real Supabase credentials are configured).
 *
 * Pages and hooks can import this to skip real DB calls and use
 * the VastraKart seed data from `@/lib/fallbacks/demo-data` instead.
 */
export const DEMO_MODE = !hasSupabaseCredentials();
