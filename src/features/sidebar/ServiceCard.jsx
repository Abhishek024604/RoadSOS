import { Navigation, Phone } from "lucide-react";
import { categoryById } from "../../data/categories.js";
import { Button } from "../../components/ui/Button.jsx";
import { useRoadSosStore } from "../../store/useRoadSosStore.js";

export function ServiceCard({ service, compact = false }) {
  const category = categoryById[service.type] || categoryById.unknown;
  const selectService = useRoadSosStore((state) => state.selectService);
  const routeToService = useRoadSosStore((state) => state.routeToService);
  const title = service.name || category.label;
  const distance = Number.isFinite(service.distanceKm) ? `${service.distanceKm.toFixed(1)} km` : "";
  const details = [distance, service.status].filter(Boolean).join(" - ");

  return (
    <article onClick={() => selectService(service)} className="flex cursor-pointer items-center gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-md">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white" style={{ backgroundColor: category.color }}><category.Icon size={21} /></span>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold">{title}</h3>
        {details && <p className="text-xs text-muted">{distance}{service.status && <span className="font-semibold text-emerald-600"> - {service.status}</span>}</p>}
        {!compact && service.address && <p className="mt-1 line-clamp-2 text-xs text-muted">{service.address}</p>}
      </div>
      {service.phone && <Button variant="ghostIcon" className="h-9 w-9" onClick={(event) => { event.stopPropagation(); window.open(`tel:${service.phone}`, "_self"); }} aria-label={`Call ${title}`}><Phone size={16} /></Button>}
      <Button variant="ghostIcon" className="h-9 w-9 text-roadsos" onClick={(event) => { event.stopPropagation(); routeToService(service); }} aria-label={`Directions to ${title}`}><Navigation size={16} /></Button>
    </article>
  );
}
