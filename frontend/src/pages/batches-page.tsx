import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Batch } from "../types";
import { getBatches } from "../api/endpoints";

export default function BatchesPage() {
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
    return <p className="p-6 text-neutral-500">Loading batches…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Batches</h1>
      </div>

      {batches.length === 0 ? (
        <p className="text-neutral-500 text-sm">No batches yet.</p>
      ) : (
        <div className="border border-neutral-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-neutral-500 border-b-2 border-emerald-600">
                <th className="px-4 py-3 font-semibold">Crop</th>
                <th className="px-4 py-3 font-semibold">Channel</th>
                <th className="px-4 py-3 font-semibold">Planted</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.id} className="border-b border-neutral-200 last:border-0 hover:bg-emerald-50">
                  <td className="px-4 py-3">
                    <Link to={`/batches/${batch.id}`} className="text-emerald-700 hover:underline font-medium">
                      {batch.cropType}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{batch.channel?.name ?? `Channel #${batch.channelId}`}</td>
                  <td className="px-4 py-3">
                    {new Date(batch.plantedDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={batch.status} />
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
