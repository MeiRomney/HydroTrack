import React, { useEffect, useState } from "react";
import type { Channel } from "../types";
import { createChannel, deleteChannel, getChannels } from "../api/endpoints";

const STATUS_STYLE: Record<string, string> = {
  active: "bg-teal-50 text-teal-700",
  empty: "bg-neutral-100 text-neutral-600",
  needs_cleaning: "bg-amber-50 text-amber-700",
};

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState("empty");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  function loadAll() {
    setLoading(true);
    getChannels()
      .then(setChannels)
      .catch(() =>
        setError(
          "Could not load channels. Is the backend running on port 3001?",
        ),
      )
      .finally(() => setLoading(false));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !capacity) return;
    setSubmitting(true);
    try {
      await createChannel({ name, capacity: Number(capacity), status });
      setName("");
      setCapacity("");
      setStatus("empty");
      setShowForm(false);
      loadAll();
    } catch {
      setError(
        "Failed to create channel. Check all fields are filled correctly.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (
      !confirm("Delete this channel? Batches assigned to it may be affected.")
    )
      return;

    try {
      await deleteChannel(id);
      loadAll();
    } catch {
      setError(
        "Could not delete channel - it may still have batches assigned to it.",
      );
    }
  }

  if (loading)
    return <p className="p-6 text-neutral-500">Loading channels...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">
          Grow channels
        </h1>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          {showForm ? "Cancel" : "+ New channel"}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="border border-neutral-200 bg-stone-50 rounded-xl p-4 mb-6 grid grid-cols-3 gap-4"
        >
          <div>
            <label className="block text-xs font-semibold text-emerald-800 mb-1">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Channel E"
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-emerald-800 mb-1">
              Capacity
            </label>

            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="e.g. 12"
              className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm bg-white"
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
              <option value="empty">Empty</option>
              <option value="active">Active</option>
              <option value="needs_cleaning">Needs cleaning</option>
            </select>
          </div>
          <div className="col-span-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg"
            >
              {submitting ? "Saving..." : "Save channel"}
            </button>
          </div>
        </form>
      )}

      {channels.length === 0 ? (
        <p className="text-neutral-500 text-sm">
          No channels yet - create one to get started.
        </p>
      ) : (
        <div className="border border-neutral-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-neutral-500 border-b-2 border-emerald-600">
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Capacity</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Batches</th>
                <th className="px-4 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {channels.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-neutral-200 last:border-0"
                >
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.capacity}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLE[c.status] ?? "bg-neutral-100 text-neutral-600"}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-500">
                    {c.batches?.length ?? 0}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Delete
                    </button>
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
