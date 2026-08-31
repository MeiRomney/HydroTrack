import React, { useState } from "react";
import type { Channel } from "../types";
import { createChannel, getChannels } from "../api/endpoints";

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

  return <div>channels-page</div>;
}
