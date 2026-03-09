import { useEffect } from "react";
import { Link } from "react-router-dom";
import AppLogo from "../components/AppLogo";
import TopNavbar from "../components/TopNavbar";

const features = [
  {
    icon: "🧠",
    title: "AI Brand Generator",
    description: "Generate creative brand names instantly using generative AI."
  },
  {
    icon: "🔍",
    title: "Brand Idea Analyzer",
    description: "Check uniqueness and similarity with existing brands."
  },
  {
    icon: "✨",
    title: "Smart Suggestions",
    description: "AI suggests alternative names and brand improvements."
  },
  {
    icon: "🚀",
    title: "Future Branding Tools",
    description: "Generate logos, brand stories, and complete brand identity."
  }
];

const steps = [
  "Enter your idea",
  "AI analyzes the concept",
  "Get brand names and insights instantly"
];

export default function LandingHomePage() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".reveal"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="page-atmosphere min-h-screen bg-white">
      <TopNavbar active="home" showActions />

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6">
        <section className="reveal relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-b from-white to-slate-50/70 p-8 shadow-soft sm:p-12">
          <div className="hero-blob hero-blob-a" />
          <div className="hero-blob hero-blob-b" />

          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-600">
                Next-Gen AI Branding Platform
              </p>

              <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
                Build the Perfect Brand with AI
              </h1>

              <p className="mt-5 max-w-2xl text-base text-slate-600 sm:text-lg">
                Generate brand names, analyze uniqueness, and create brand identities using generative AI.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/ai-brand-generator" className="btn-primary btn-glow px-6 py-3">
                  Get Started
                </Link>
                <Link to="/ai-brand-generator" className="btn-secondary px-6 py-3">
                  Try AI Generator
                </Link>
              </div>

              <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-card">
                  <p className="text-xl font-semibold text-ink">20k+</p>
                  <p className="text-xs text-slate-500">Names Generated</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-card">
                  <p className="text-xl font-semibold text-ink">95%</p>
                  <p className="text-xs text-slate-500">Satisfaction</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-card">
                  <p className="text-xl font-semibold text-ink">24/7</p>
                  <p className="text-xs text-slate-500">AI Availability</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-[2.25rem] border border-slate-200/70 bg-white/80 shadow-soft logo-float">
                <AppLogo className="h-24 w-24" withLabel={false} animated />
              </div>
              <p className="text-center text-sm uppercase tracking-[0.18em] text-slate-500">Powered by Generative AI</p>

              <div className="glass-card rounded-2xl p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Live Brand Pulse</p>
                <p className="mt-2 text-sm text-slate-700">Analyzing market fit, naming patterns, and identity direction in real time.</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-600">AI engine active</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="reveal mt-16">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-ink">Why Alkimi AI</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article key={feature.title} className="glass-card rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:shadow-soft">
                <p className="text-2xl" aria-hidden>{feature.icon}</p>
                <h3 className="mt-3 text-base font-semibold text-ink">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="reveal mt-16">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-ink">How It Works</h2>
          <div className="relative mx-auto mt-8 grid max-w-4xl gap-4 md:grid-cols-3">
            <div className="hidden md:block absolute left-[16.5%] right-[16.5%] top-10 h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200" />
            {steps.map((step, index) => (
              <article key={step} className="card rounded-2xl p-5 text-center">
                <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <p className="text-sm font-medium text-slate-700">{step}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="reveal mt-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-12 text-center text-white shadow-soft sm:px-10">
            <div className="cta-glow" />
            <h2 className="relative z-10 text-3xl font-semibold tracking-tight">Start Building Your Brand with AI Today</h2>
            <p className="relative z-10 mx-auto mt-3 max-w-2xl text-sm text-slate-200">
              From name generation to identity strategy, Alkimi AI helps you launch faster with confidence.
            </p>
            <Link to="/ai-brand-generator" className="relative z-10 mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:scale-[1.03]">
              Get Started
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white/80">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:px-6">
          <div className="flex gap-4">
            <Link to="/about" className="transition hover:text-ink">About</Link>
            <a href="#" className="transition hover:text-ink">Privacy</a>
            <a href="#" className="transition hover:text-ink">Contact</a>
          </div>
          <p>© Alkimi AI</p>
        </div>
      </footer>
    </div>
  );
}
