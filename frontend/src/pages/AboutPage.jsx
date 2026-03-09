import TopNavbar from "../components/TopNavbar";

export default function AboutPage() {
  return (
    <div className="page-atmosphere min-h-screen bg-white">
      <TopNavbar active="about" />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="card p-6 sm:p-8">
          <h1 className="text-3xl font-semibold text-ink">About Alkimi AI</h1>
          <p className="mt-4 text-slate-600">
            Alkimi AI is an AI-powered workspace for generating brand names, analyzing uniqueness, and turning ideas into launch-ready brand directions.
          </p>
        </div>
      </main>
    </div>
  );
}
