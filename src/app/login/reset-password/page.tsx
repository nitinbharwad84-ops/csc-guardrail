import type { Metadata } from "next";
import ResetPasswordClient from "./ResetPasswordClient";

export const metadata: Metadata = {
  title: "Set New Password | CSC Guardrail",
  description: "Set a new password for your CSC Guardrail account.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordClient />;
}
