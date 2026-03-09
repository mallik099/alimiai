import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import useChat from "../hooks/useChat";

export default function AnalyticsPage() {
  const chat = useChat();

  const dailyData = useMemo(() => {
    const grouped = {};
    chat.messages.forEach((message) => {
      const day = new Date(message.createdAt).toLocaleDateString();
      if (!grouped[day]) {
        grouped[day] = { day, user: 0, assistant: 0, images: 0 };
      }
      grouped[day][message.role] += 1;
      if (message.imageUrl) {
        grouped[day].images += 1;
      }
    });
    return Object.values(grouped).slice(-7);
  }, [chat.messages]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Activity & Analytics</h2>
        <p className="text-sm text-slate-500">Client-side analytics from chat history storage.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-4">
          <div className="text-xs uppercase text-slate-500">Total messages</div>
          <div className="mt-2 text-3xl font-semibold">{chat.stats.total}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs uppercase text-slate-500">Assistant replies</div>
          <div className="mt-2 text-3xl font-semibold">{chat.stats.assistant}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs uppercase text-slate-500">Generated images</div>
          <div className="mt-2 text-3xl font-semibold">{chat.stats.images}</div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-base font-semibold">7-day chat activity</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="user" fill="#101828" radius={[6, 6, 0, 0]} />
              <Bar dataKey="assistant" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              <Bar dataKey="images" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
