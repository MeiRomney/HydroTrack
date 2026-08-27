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

  return <div>channels-page</div>;
}
