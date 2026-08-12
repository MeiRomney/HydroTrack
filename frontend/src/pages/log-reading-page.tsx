import { useParams, Link } from "react-router-dom";

export default function LogReadingPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-md mx-auto p-6">
      <Link
        to={`/batches/${id}`}
        className="text-sm text-emerald-700 hover:underline"
      >
        &larr; Back to batch
      </Link>
      <h1 className="text-xl font-semibold text-neutral-900 mt-3">
        Log a reading
      </h1>
      <p className="text-neutral-500 text-sm mt-2">
        Form coming soon — this page is wired into routing for batch #{id},
        ready to build next.
      </p>
    </div>
  );
}
