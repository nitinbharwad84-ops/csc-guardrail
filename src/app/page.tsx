import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { TwoLayerDefense } from "@/components/landing/TwoLayerDefense";
import { WorkflowGrid } from "@/components/landing/WorkflowGrid";
import { ScenarioCallout } from "@/components/landing/ScenarioCallout";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "CSC Guardrail — Client Scope & Change Protection",
  description:
    "Protect fixed-price agency contracts from scope creep with a continuous Two-Layer Defense: Day-0 SOW Ambiguity Scanner and Mid-Sprint Zero-Cost Scope Swaps.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Two-Layer Scope Defense Comparison */}
        <TwoLayerDefense />

        {/* 7-Screen Workflow Navigation */}
        <WorkflowGrid />

        {/* Golden Demo Scenario Callout */}
        <ScenarioCallout />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
