import { useState } from "react";
import { Car, GitCompareArrows } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../components/ui/Button.jsx";
import { RoadMap } from "../features/map/RoadMap.jsx";
import { getRoute } from "../services/api.js";
import { useRoadSosStore } from "../store/useRoadSosStore.js";
import { PageHeader } from "./PageHeader.jsx";

export function RoutePage() {
  const [isReversed, setIsReversed] = useState(false);
  const service = useRoadSosStore((state) => state.routeService || state.selectedService);
  const location = useRoadSosStore((state) => state.location);
  
  // Round to 3 decimal places to debounce Google Directions API calls
  const roundedLat = location?.lat ? Number(location.lat.toFixed(3)) : null;
  const roundedLng = location?.lng ? Number(location.lng.toFixed(3)) : null;
  const roundedLocation = location ? { lat: roundedLat, lng: roundedLng } : null;

  const { data: route } = useQuery({
    queryKey: ["route", roundedLat, roundedLng, service?.id, isReversed],
    queryFn: () => getRoute({ origin: isReversed ? service : roundedLocation, destination: isReversed ? roundedLocation : service }),
    enabled: Boolean(roundedLocation && service)
  });

  if (!service) {
    return (
      <div className="min-h-full p-5 pt-0">
        <PageHeader title="Route / Directions" />
        <div className="rounded-xl bg-slate-100 p-5 text-sm text-muted">Select a live nearby service before opening directions.</div>
      </div>
    );
  }

  const hasRoute = Number.isFinite(route?.distanceKm) && Number.isFinite(route?.etaMinutes);
  const serviceName = service.name || "Selected service";

  return (
    <div className="min-h-full pb-5">
      <PageHeader title="Route / Directions" backTo="details" />
      <section className="mx-5 grid grid-cols-[1fr_auto] gap-3">
        <div className="space-y-2">
          <div className="rounded-lg border border-line px-3 py-2 text-sm"><span className="font-semibold text-emerald-600">From:</span> {isReversed ? serviceName : "Your Location"}</div>
          <div className="rounded-lg border border-line px-3 py-2 text-sm"><span className="font-semibold text-red-600">To:</span> {isReversed ? "Your Location" : serviceName}</div>
        </div>
        <Button variant="ghostIcon" onClick={() => setIsReversed(!isReversed)}><GitCompareArrows size={18} /></Button>
      </section>
      <div className="mx-5 mt-4 flex gap-3">
        <Button variant="subtle" className="bg-blue-100 text-roadsos" disabled={!hasRoute}><Car size={17} /> {hasRoute ? `${route.etaMinutes} min` : "No route"}</Button>
      </div>
      <div className="relative mx-5 mt-4 h-72 overflow-hidden rounded-xl">
        <RoadMap services={[service]} routeGeometry={route?.geometry} />
      </div>
      <section className="mx-5 -mt-4 rounded-xl bg-white p-5 shadow-soft ring-1 ring-line">
        {hasRoute ? (
          <>
            <h1 className="text-2xl font-bold text-emerald-600">{route.etaMinutes} min <span className="text-base text-ink">({route.distanceKm} km)</span></h1>
            <p className="mt-2 text-sm font-semibold">Google Maps driving route</p>
            <p className="text-sm text-muted">Calculated from your current browser location.</p>
          </>
        ) : (
          <p className="text-sm text-muted">No live route is available right now.</p>
        )}

      </section>
    </div>
  );
}
