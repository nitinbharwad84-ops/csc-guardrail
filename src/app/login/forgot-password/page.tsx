import type { Metadata } from "next";
import ForgotPasswordClient from "./ForgotPasswordClient";

export const metadata: Metadata = {
  title: "Forgot Password | CSC Guardrail",
  description: "Reset your CSC Guardrail account password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
