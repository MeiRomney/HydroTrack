import React, { useState } from "react";
import type { Channel } from "../types";

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

  return <div>channels-page</div>;
}
