import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button.jsx";
import { useRoadSosStore } from "../store/useRoadSosStore.js";

export function PageHeader({ title, right = null, backTo = "map" }) {
  const setScreen = useRoadSosStore((state) => state.setScreen);
  return (
    <header className="flex items-center justify-between px-5 py-4">
      <Button variant="ghost" className="h-10 px-0" onClick={() => setScreen(backTo)} aria-label="Go back"><ArrowLeft size={21} /></Button>
      <h1 className="text-base font-bold">{title}</h1>
      <div className="w-10 text-right">{right}</div>
    </header>
  );
}
