import ChatPanel from "../components/ChatPanel";
import StatCard from "../components/StatCard";
import useApiStatus from "../hooks/useApiStatus";
import useChat from "../hooks/useChat";

export default function DashboardPage() {
  const { loading, error, root, health, models, refresh } = useApiStatus();
  const chat = useChat();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <p className="text-sm text-slate-500">Live backend status plus chat orchestration.</p>
        </div>
        <button className="btn-secondary" onClick={refresh}>
          Refresh API status
        </button>
      </div>

      {error ? <div className="rounded-xl bg-red-50 p-3 text-sm text-danger">{error}</div> : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="API Root" value={root?.message ? "Online" : loading ? "Checking" : "Unknown"} hint={root?.message || "-"} />
        <StatCard title="Health" value={health?.status || (loading ? "Checking" : "Unknown")} hint="GET /health" tone={health?.status === "healthy" ? "good" : "default"} />
        <StatCard title="Text Model" value={models?.text_generation || (loading ? "Checking" : "Unknown")} hint="GET /models/status" />
        <StatCard title="Image Model" value={models?.image_generation || (loading ? "Checking" : "Unknown")} hint={models?.groq_available ? "Groq available" : "Groq not configured"} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <ChatPanel chat={chat} />

        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="text-base font-semibold">Session metrics</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Messages</dt>
                <dd className="font-medium">{chat.stats.total}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Assistant replies</dt>
                <dd className="font-medium">{chat.stats.assistant}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Generated images</dt>
                <dd className="font-medium">{chat.stats.images}</dd>
              </div>
            </dl>
          </div>

          <div className="card p-4">
            <h3 className="text-base font-semibold">Mapped endpoints</h3>
            <ul className="mt-3 space-y-1 text-sm text-slate-600">
              <li>`GET /`</li>
              <li>`GET /health`</li>
              <li>`GET /models/status`</li>
              <li>`POST /chat`</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
