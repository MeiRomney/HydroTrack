import { Routes, Route, NavLink } from "react-router-dom";
import HomePage from "./pages/home-page";
import BatchesPage from "./pages/batches-page";
import BatchDetailPage from "./pages/batch-detail-page";
import LogReadingPage from "./pages/log-reading-page";
import RecordHarvestPage from "./pages/record-harvest-page";
import ChannelsPage from "./pages/channels-page";

function Nav() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm ${isActive ? "text-white font-semibold" : "text-emerald-100"}`;

  return (
    <nav className="bg-emerald-900 px-6 py-4 flex items-center gap-6">
      <span className="text-white font-bold text-base">
        Hydro<span className="text-emerald-300">Track</span>
      </span>
      <NavLink to="/" end className={linkClass}>
        Dashboard
      </NavLink>
      <NavLink to="/batches" className={linkClass}>
        Batches
      </NavLink>
      <NavLink to="/channels" className={linkClass}>
        Channels
      </NavLink>
    </nav>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/batches" element={<BatchesPage />} />
        <Route path="/channels" element={<ChannelsPage />} />
        <Route path="/batches/:id" element={<BatchDetailPage />} />
        <Route path="/batches/:id/log-reading" element={<LogReadingPage />} />
        <Route
          path="/batches/:id/record-harvest"
          element={<RecordHarvestPage />}
        />
      </Routes>
    </>
  );
}
