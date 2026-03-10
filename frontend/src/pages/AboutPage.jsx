import TopNavbar from "../components/TopNavbar";

const teamMembers = [
  {
    name: "D Sri Karthik",
    role: "Backend Developer",
    caption: "Team Lead",
    quote: "Building stable and scalable AI backend systems."
  },
  {
    name: "G Sri Vardhini",
    role: "Frontend Developer",
    caption: "Frontend",
    quote: "Designing smooth, intuitive user experiences."
  },
  {
    name: "D Suchitha",
    role: "Testing & Quality Assurance",
    caption: "QA",
    quote: "Keeping product quality consistent and reliable."
  },
  {
    name: "K Mallikkumar",
    role: "Product Manager",
    caption: "Product",
    quote: "Aligning vision, features, and user needs."
  },
  {
    name: "A Nakshatra",
    role: "UI/UX Designer",
    caption: "Design",
    quote: "Crafting clean and modern visual systems."
  }
];

export default function AboutPage() {
  return (
    <div className="page-atmosphere min-h-screen bg-white">
      <TopNavbar active="about" />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="card rounded-3xl p-7 sm:p-10">
          <h1 className="text-3xl font-semibold text-ink sm:text-4xl">About Alkimi AI</h1>
          <p className="mt-4 max-w-4xl text-slate-600">
            Alkimi AI is a generative AI platform designed to help users create brand identities using artificial
            intelligence. It provides tools like AI brand name generation, tagline creation, domain suggestions, and
            branding insights.
          </p>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-ink sm:text-3xl">Meet Our Team</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <article
                key={member.name}
                className="group rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                      {member.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-ink">{member.name}</h3>
                      <p className="text-sm text-slate-500">{member.role}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {member.caption}
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-600">{member.quote}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-12 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-6 text-white shadow-lg sm:px-8">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-200">Alkimi AI</p>
          <p className="mt-2 text-xl font-semibold">Building the future of intelligent branding.</p>
        </div>
      </main>
    </div>
  );
}
