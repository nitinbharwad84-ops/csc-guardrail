import type { Metadata } from "next";
import RegisterClient from "./RegisterClient";

export const metadata: Metadata = {
  title: "Create Account | CSC Guardrail",
  description: "Create your CSC Guardrail agency account.",
};

export default function RegisterPage() {
  return <RegisterClient />;
}
