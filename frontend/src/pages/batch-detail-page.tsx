import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Batch, Reading, Harvest } from "../types";
import { getBatch, getReadings, getHarvests } from "../api/endpoints";

export default function BatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const batchId = Number(id);

  const [batch, setBatch] = useState<Batch | null>(null);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!batchId) return;
    Promise.all([getBatch(batchId), getReadings(batchId), getHarvests(batchId)])
      .then(([b, r, h]) => {
        setBatch(b);
        setReadings(r);
        setHarvests(h);
      })
      .catch(() => setError("Could not load this batch."))
      .finally(() => setLoading(false));
  }, [batchId]);

  if (loading) return <p className="p-6 text-neutral-500">Loading batch…</p>;
  if (error || !batch)
    return <p className="p-6 text-red-600">{error ?? "Batch not found."}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/batches" className="text-sm text-emerald-700 hover:underline">
        &larr; Back to batches
      </Link>

      <div className="flex items-center justify-between mt-3 mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">
          {batch.cropType} —{" "}
          {batch.channel?.name ?? `Channel #${batch.channelId}`}
        </h1>
        <Link
          to={`/batches/${batch.id}/log-reading`}
          className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          + Log reading
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <InfoCard label="Status" value={batch.status} />
        <InfoCard
          label="Planted"
          value={new Date(batch.plantedDate).toLocaleDateString()}
        />
        <InfoCard
          label="Expected harvest"
          value={new Date(batch.expectedHarvestDate).toLocaleDateString()}
        />
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-800 mb-3">
        Readings
      </h2>
      {readings.length === 0 ? (
        <p className="text-neutral-500 text-sm mb-8">No readings logged yet.</p>
      ) : (
        <div className="border border-neutral-200 rounded-xl overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-neutral-500 border-b-2 border-emerald-600">
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">pH</th>
                <th className="px-4 py-3 font-semibold">EC</th>
                <th className="px-4 py-3 font-semibold">Water temp</th>
                <th className="px-4 py-3 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {readings.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-neutral-200 last:border-0"
                >
                  <td className="px-4 py-3">
                    {new Date(r.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{r.pH}</td>
                  <td className="px-4 py-3">{r.ec}</td>
                  <td className="px-4 py-3">{r.waterTemp}°C</td>
                  <td className="px-4 py-3 text-neutral-500">
                    {r.notes || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-800 mb-3">
        Harvests
      </h2>
      {harvests.length === 0 ? (
        <p className="text-neutral-500 text-sm">No harvests recorded yet.</p>
      ) : (
        <div className="border border-neutral-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-neutral-500 border-b-2 border-emerald-600">
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Yield (kg)</th>
                <th className="px-4 py-3 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {harvests.map((h) => (
                <tr
                  key={h.id}
                  className="border-b border-neutral-200 last:border-0"
                >
                  <td className="px-4 py-3">
                    {new Date(h.harvestDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{h.yieldKg}</td>
                  <td className="px-4 py-3 text-neutral-500">
                    {h.notes || "—"}
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

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-neutral-200 rounded-xl p-4 bg-stone-50">
      <div className="text-sm font-semibold text-emerald-900">{value}</div>
      <div className="text-xs text-neutral-500 mt-1">{label}</div>
    </div>
  );
}
