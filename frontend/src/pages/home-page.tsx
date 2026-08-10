import { useEffect, useState } from "react";
import type { Batch } from "../types";
import { getBatches } from "../api/endpoints";

export default function HomePage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBatches()
      .then(setBatches)
      .catch(() =>
        setError(
          "Could not load batches. Is the backend running on port 3001?",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="p-6 text-neutral-500">Loading dashboard…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  const activeCount = batches.filter((b) => b.status !== "harvested").length;
  // adjust 'ready' to match whatever status value you actually use for harvest-ready batches
  const readyCount = batches.filter((b) => b.status === "ready").length;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-xl font-semibold text-neutral-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Active batches" value={activeCount} />
        <StatCard label="Ready to harvest" value={readyCount} />
        <StatCard label="Total batches" value={batches.length} />
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-800 mb-3">
        Batches
      </h2>

      {batches.length === 0 ? (
        <p className="text-neutral-500 text-sm">
          No batches yet — create one to get started.
        </p>
      ) : (
        <div className="border border-neutral-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-neutral-500 border-b-2 border-emerald-600">
                <th className="px-4 py-3 font-semibold">Crop</th>
                <th className="px-4 py-3 font-semibold">Planted</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr
                  key={b.id}
                  className="border-b border-neutral-200 last:border-0"
                >
                  <td className="px-4 py-3">{b.cropType}</td>
                  <td className="px-4 py-3">
                    {new Date(b.plantedDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-neutral-200 rounded-xl p-4 bg-stone-50 flex-1">
      <div className="text-2xl font-bold text-emerald-900">{value}</div>
      <div className="text-xs text-neutral-500 mt-1">{label}</div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    germinating: "bg-amber-50 text-amber-700",
    growing: "bg-teal-50 text-teal-700",
    harvested: "bg-violet-50 text-violet-700",
  };
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] ?? "bg-neutral-100 text-neutral-600"}`}
    >
      {status}
    </span>
  );
}
