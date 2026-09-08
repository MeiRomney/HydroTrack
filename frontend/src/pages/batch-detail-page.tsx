import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Batch, Reading, Harvest, Channel } from "../types";
import {
  getBatch,
  getReadings,
  getHarvests,
  getChannels,
  updateBatch,
} from "../api/endpoints";

const STATUS_OPTIONS = ["germinating", "growing", "harvested"];

function formatDateForInput(value: string | Date): string {
  return new Date(value).toISOString().slice(0, 10);
}

export default function BatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const batchId = Number(id);

  const [batch, setBatch] = useState<Batch | null>(null);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [cropType, setCropType] = useState("");
  const [channelId, setChannelId] = useState("");
  const [plantedDate, setPlantedDate] = useState("");
  const [expectedHarvestDate, setExpectedHarvestDate] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function loadAll() {
    if (!batchId) return;
    setLoading(true);
    Promise.all([
      getBatch(batchId),
      getReadings(batchId),
      getHarvests(batchId),
      getChannels(),
    ])
      .then(([b, r, h, c]) => {
        setBatch(b);
        setReadings(r);
        setHarvests(h);
        setChannels(c);
        setCropType(b.cropType);
        setChannelId(String(b.channelId));
        setPlantedDate(formatDateForInput(b.plantedDate));
        setExpectedHarvestDate(formatDateForInput(b.expectedHarvestDate));
        setStatus(b.status);
      })
      .catch(() => setError("Could not load this batch."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchId]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateBatch(batchId, {
        cropType,
        channelId: Number(channelId),
        plantedDate: new Date(plantedDate),
        expectedHarvestDate: new Date(expectedHarvestDate),
        status,
      });
      setEditing(false);
      loadAll();
    } catch {
      setError(
        "Failed to update batch. Check all fields are filled correctly.",
      );
    } finally {
      setSubmitting(false);
    }
  }

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
        <div className="flex gap-3">
          <button
            onClick={() => setEditing((e) => !e)}
            className="bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50 text-sm font-semibold px-4 py-2 rounded-lg"
          >
            {editing ? "Cancel" : "Edit"}
          </button>
          <Link
            to={`/batches/${batch.id}/log-reading`}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-4 py-2 rounded-lg"
          >
            + Log reading
          </Link>
          <Link
            to={`/batches/${batch.id}/record-harvest`}
            className="bg-white border border-emerald-700 text-emerald-800 hover:bg-emerald-50 text-sm font-semibold px-4 py-2 rounded-lg"
          >
            + Record harvest
          </Link>
        </div>
      </div>

      {editing ? (
        <form
          onSubmit={handleSave}
          className="border border-neutral-200 bg-stone-50 rounded-xl p-5 grid grid-cols-2 gap-4 mb-8"
        >
          <div>
            <label className="block text-xs font-semibold text-emerald-800 mb-1">
              Crop type
            </label>
            <input
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-emerald-800 mb-1">
              Channel
            </label>
            <select
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              {channels.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-emerald-800 mb-1">
              Planted date
            </label>
            <input
              type="date"
              value={plantedDate}
              onChange={(e) => setPlantedDate(e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-emerald-800 mb-1">
              Expected harvest date
            </label>
            <input
              type="date"
              value={expectedHarvestDate}
              onChange={(e) => setExpectedHarvestDate(e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-emerald-800 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg"
            >
              {submitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      ) : (
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
      )}

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
