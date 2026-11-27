/**
 * CSC Guardrail — Supabase Server Client
 *
 * Creates a typed Supabase client for use in Server Components, Route Handlers,
 * and Server Actions. Each call creates a fresh client per request (never shared).
 *
 * Gracefully handles missing environment variables in local/offline demo mode
 * by returning a stub client instead of crashing, so the app renders with
 * the VastraKart seed data from `@/lib/fallbacks/demo-data`.
 *
 * Usage (Server Component or Route Handler):
 *   import { createServerSupabaseClient } from "@/lib/supabase/server";
 *   const supabase = await createServerSupabaseClient();
 *
 * Usage (Service-role, e.g. write-back in Route Handlers):
 *   import { createServiceRoleClient } from "@/lib/supabase/server";
 *   const supabase = createServiceRoleClient();
 *
 * @module lib/supabase/server
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Sentinel values used in offline / demo mode. */
const DEMO_SENTINEL_URL = "https://demo.supabase.co";
const DEMO_SENTINEL_ANON_KEY = "demo-anon-key-offline";
const DEMO_SENTINEL_SERVICE_KEY = "demo-service-key-offline";

function getEnv(key: string, sentinel: string): string {
  const val = process.env[key];
  if (!val || val.trim() === "" || val.startsWith("your-")) {
    console.warn(
      `[CSC] Missing env var "${key}" — running in offline demo mode. ` +
        `Set ${key} in .env.local to connect to Supabase.`
    );
    return sentinel;
  }
  return val;
}

/**
 * Creates a Supabase server client for Server Components, Route Handlers,
 * and Server Actions. Integrates with Next.js cookie handling for auth.
 *
 * Always create a fresh client per request — never assign to a module-level
 * variable or share across requests.
 *
 * In offline demo mode (missing env vars), the client uses the sentinel URL
 * and all DB calls will fail silently — callers should catch errors and fall
 * back to `@/lib/fallbacks/demo-data`.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL", DEMO_SENTINEL_URL);
  const supabaseKey = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", DEMO_SENTINEL_ANON_KEY);

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // `setAll` is called from Server Components where cookies cannot be
          // set. This is safe to ignore if a middleware handles session refresh.
        }
      },
    },
  });
}

/**
 * Creates a Supabase client using the service-role key (bypasses RLS).
 *
 * ⚠️  NEVER expose this client to the browser or return its data directly
 * to untrusted callers. Use only in trusted Route Handlers and background jobs.
 */
export function createServiceRoleClient() {
  const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL", DEMO_SENTINEL_URL);
  const serviceKey = getEnv("SUPABASE_SERVICE_ROLE_KEY", DEMO_SENTINEL_SERVICE_KEY);

  // Service-role clients don't need cookie handling — they always bypass auth.
  return createServerClient(supabaseUrl, serviceKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        // No-op: service-role clients don't use session cookies.
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * `true` when the app is running in offline / local demo mode.
 * Server-side equivalent of the browser `DEMO_MODE` export.
 */
export const SERVER_DEMO_MODE =
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");
