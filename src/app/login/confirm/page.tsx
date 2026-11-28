import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Confirmed — CSC Guardrail",
  description: "Your email has been verified. You can now sign in.",
};

function ConfirmContent() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs">
          <svg
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mt-4 font-sans text-2xl font-bold tracking-tight text-slate-900">
          Email Verified
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
          Your email address has been confirmed. You can now sign in to your CSC
          Guardrail workspace.
        </p>

        <div className="mt-8">
          <a
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors"
          >
            Continue to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="animate-pulse text-sm text-slate-400">
            Verifying email...
          </div>
        </div>
      }
    >
      <ConfirmContent />
    </Suspense>
  );
}
