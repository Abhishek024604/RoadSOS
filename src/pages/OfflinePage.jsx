import { WifiOff } from "lucide-react";
import { Button } from "../components/ui/Button.jsx";
import { useRoadSosStore } from "../store/useRoadSosStore.js";
import { PageHeader } from "./PageHeader.jsx";

export function OfflinePage() {
  const setScreen = useRoadSosStore((state) => state.setScreen);

  return (
    <div className="min-h-full p-5 pt-0 text-center">
      <PageHeader title="Offline Mode" />
      <div className="mx-auto mt-10 grid h-28 w-28 place-items-center rounded-3xl bg-blue-50 text-emerald-500"><WifiOff size={46} /></div>
      <h1 className="mt-8 text-2xl font-bold">You are in Offline Mode</h1>
      <p className="mx-auto mt-2 max-w-xs text-sm text-muted">Live service data is unavailable until your connection returns.</p>
      <section className="mt-8 rounded-xl bg-slate-100 p-4 text-left">
        <h2 className="font-bold">No live data available</h2>
        <p className="mt-3 text-sm text-ink">RoadSOS will request fresh Google Maps data when you are back online.</p>
      </section>
      <Button className="mt-8 w-full" onClick={() => setScreen("map")}>Go Online</Button>
    </div>
  );
}
