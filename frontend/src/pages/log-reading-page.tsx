import { useParams, Link, useNavigate } from "react-router-dom";
import type { Batch } from "../types";
import React, { useEffect, useState } from "react";
import { createReading, getBatch } from "../api/endpoints";

export default function LogReadingPage() {
  const { id } = useParams<{ id: string }>();
  const batchId = Number(id);
  const navigate = useNavigate();

  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [pH, setPH] = useState("");
  const [ec, setEc] = useState("");
  const [waterTemp, setWaterTemp] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!batchId) return;
    getBatch(batchId)
      .then(setBatch)
      .catch(() => setError("Could not load this batch."))
      .finally(() => setLoading(false));
  }, [batchId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pH || !ec || !waterTemp) {
      setError("pH, Ec, and water tempe are required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await createReading({
        batchId,
        date: new Date(date) as any,
        pH: Number(pH),
        ec: Number(ec),
        waterTemp: Number(waterTemp),
        notes: notes || undefined,
      });
      navigate(`/batches/${batchId}`);
    } catch {
      setError("Failed to save reading. Check the values and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="p-6 text-neutral-500">Loading...</p>;
  if (!batch)
    return <p className="p-6 text-red-600">{error ?? "Batch not found."}</p>;

  return (
    <div className="max-w-md mx-auto p-6">
      <Link
        to={`/batches/${batchId}`}
        className="text-sm text-emerald-700 hover:underline"
      >
        &larr; Back to batch
      </Link>

      <p className="text-xs text-neutral-500 mt-3">
        Batches / {batch.cropType} -{" "}
        {batch.channel?.name ?? `Channel #${batch.channelId}`}
      </p>
      <h1 className="text-xl font-semibold text-neutral-900 mt-1 mb-6">
        Log a reading
      </h1>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="border border-neutral-200 bg-stone-50 rounded-xl p-5 space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-emeral-800 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-emerald-800 mb-1">
              pH
            </label>
            <input
              type="number"
              step="0.1"
              value={pH}
              onChange={(e) => setPH(e.target.value)}
              placeholder="e.g. 6.1"
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-emerald-800 mb-1">
              EC (mS/cm)
            </label>
            <input
              type="number"
              step="0.1"
              value={ec}
              onChange={(e) => setEc(e.target.value)}
              placeholder="e.g. 1.8"
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-emerald-800 mb-1">
              Water Temperature (°C)
            </label>
            <input
              type="number"
              step="0.1"
              value={waterTemp}
              onChange={(e) => setWaterTemp(e.target.value)}
              placeholder="e.g. 22"
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm bg-white"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-emerald-800 mb-1">
              Notes
            </label>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional"
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm bg-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg w-full"
        >
          {submitting ? "Saving..." : "Save reading"}
        </button>
      </form>
    </div>
  );
}
