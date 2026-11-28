import { NextResponse } from "next/server";

/**
 * Centralized Demo Session Route Handler (Member 2)
 *
 * Handles isolated demo workspace entry and exit using HTTP cookies
 * before redirecting, preserving the exact request Host header so
 * both localhost:3000 and LAN IP origins (e.g. 192.168.1.8:3000) keep
 * their cookie scope intact.
 *
 * - GET / POST /login/demo             -> sets csc-demo-bypass=true, redirects to /dashboard
 * - GET / POST /login/demo?action=exit -> clears csc-demo-bypass, redirects to /login?logout=true
 */

function getRequestOrigin(request: Request): string {
  const url = new URL(request.url);
  const host =
    request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto =
    request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");
  return host ? `${proto}://${host}` : url.origin;
}

function handleDemoAction(request: Request) {
  const url = new URL(request.url);
  const origin = getRequestOrigin(request);
  const action = url.searchParams.get("action");

  if (action === "exit") {
    const response = NextResponse.redirect(
      new URL("/login?logout=true", origin),
      { status: 303 }
    );
    response.cookies.set("csc-demo-bypass", "", {
      path: "/",
      maxAge: 0,
      expires: new Date(0),
      sameSite: "lax",
    });
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return response;
  }

  // Enter isolated demo workspace
  const response = NextResponse.redirect(new URL("/dashboard", origin), {
    status: 303,
  });
  response.cookies.set("csc-demo-bypass", "true", {
    path: "/",
    maxAge: 86400,
    sameSite: "lax",
  });
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return response;
}

export async function GET(request: Request) {
  return handleDemoAction(request);
}

export async function POST(request: Request) {
  return handleDemoAction(request);
}
