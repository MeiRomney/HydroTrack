import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Batch } from "../types";
import { createHarvest, getBatch, updateBatch } from "../api/endpoints";

export default function RecordHarvestPage() {
  const { id } = useParams<{ id: string }>();
  const batchId = Number(id);
  const navigate = useNavigate();

  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [harvestDate, setHarvestDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [yieldKg, setYieldKg] = useState("");
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
    if (!yieldKg) {
      setError("Yield (kg) is required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await createHarvest({
        batchId,
        harvestDate: new Date(harvestDate),
        yieldKg: Number(yieldKg),
        notes: notes || undefined,
      });
      // Mark the batch as harvested now that yield has been recorded
      await updateBatch(batchId, { status: "harvested" });
      navigate(`/batches/${batchId}`);
    } catch {
      setError("Failed to record harvest. Check the values and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="p-6 text-neutral-500">Loading...</p>;
  if (!batch)
    return <p className="p-6 text-red-600">{error ?? "Batch not found."}</p>;

  const alreadyHarvested = batch.status === "harvested";

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
        Record harvest
      </h1>

      {alreadyHarvested && (
        <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm mb-4">
          This batch is already marked as harvested. Submitting again will add
          another harvest record.
        </p>
      )}
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="border border-neutral-200 bg-stone-50 rounded-xl p-5 space-y-4"
      >
        <div>
          <label className="block text-xs font-semibold text-emerald-800 mb-1">
            Harvest date
          </label>
          <input
            type="date"
            value={harvestDate}
            onChange={(e) => setHarvestDate(e.target.value)}
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-emerald-800 mb-1">
            Yield (kg)
          </label>
          <input
            type="number"
            step="0.1"
            value={yieldKg}
            onChange={(e) => setYieldKg(e.target.value)}
            placeholder="e.g. 2.4"
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm bg-white"
          />
        </div>
        <div>
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

        <button
          type="submit"
          disabled={submitting}
          className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg w-full"
        >
          {submitting ? "Saving..." : "Save harvest"}
        </button>
      </form>
    </div>
  );
}
