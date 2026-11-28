import type { Metadata } from "next";
import { LoginClient } from "./LoginClient";

export const metadata: Metadata = {
  title: "Sign In | CSC Guardrail",
  description:
    "Sign in to your CSC Guardrail agency workspace with Google, email/password, or explore the isolated VastraKart demo.",
};

export default function LoginPage() {
  return <LoginClient />;
}
