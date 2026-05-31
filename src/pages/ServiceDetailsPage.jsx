import { Heart, MapPin, Phone, Share2 } from "lucide-react";
import { Button } from "../components/ui/Button.jsx";
import { categoryById } from "../data/categories.js";
import { useRoadSosStore } from "../store/useRoadSosStore.js";
import { PageHeader } from "./PageHeader.jsx";

export function ServiceDetailsPage() {
  const service = useRoadSosStore((state) => state.selectedService);
  const routeToService = useRoadSosStore((state) => state.routeToService);

  if (!service) {
    return (
      <div className="min-h-full p-5 pt-0">
        <PageHeader title="Service Details" />
        <div className="rounded-xl bg-slate-100 p-5 text-sm text-muted">Select a live nearby service from the map or list first.</div>
      </div>
    );
  }

  const category = categoryById[service.type] || categoryById.unknown;
  const title = service.name || category.label;

  return (
    <div className="min-h-full pb-5">
      <PageHeader title="Service Details" right={<Heart size={20} />} />
      <div className="mx-4 h-44 rounded-xl bg-[linear-gradient(135deg,#dbeafe,#f8fafc_45%,#bfdbfe)] p-5">
        <div className="grid h-full place-items-center rounded-lg border border-white/70 bg-white/35 text-sm font-semibold text-muted shadow-inner">
          Live Google Maps service
        </div>
      </div>
      <section className="p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-full text-white" style={{ backgroundColor: category.color }}><category.Icon size={28} /></span>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold">{title}</h1>
            {Number.isFinite(service.distanceKm) && <p className="text-sm text-muted">{service.distanceKm.toFixed(1)} km away</p>}
          </div>
          {service.status && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">{service.status}</span>}
        </div>
        <p className="mt-5 text-sm text-muted">{category.label}</p>
        <div className="mt-5 space-y-4 border-y border-line py-5 text-sm">
          {service.address && <p className="flex gap-3"><MapPin size={18} className="shrink-0 text-muted" /> {service.address}</p>}
          {service.phone && <p className="flex gap-3"><Phone size={18} className="shrink-0 text-muted" /> {service.phone}</p>}
          {!service.address && !service.phone && <p className="text-muted">No contact or address details are available from Google Maps.</p>}
        </div>
      </section>
      <footer className="fixed bottom-0 left-1/2 grid w-full max-w-[440px] -translate-x-1/2 grid-cols-[1fr_1.4fr_1fr] gap-2 bg-white p-4 shadow-[0_-10px_30px_rgba(15,23,42,0.08)]">
        <Button variant="secondary" disabled={!service.phone} onClick={() => window.open(`tel:${service.phone}`, "_self")}><Phone size={16} />Call</Button>
        <Button onClick={() => routeToService(service)}>Directions</Button>
        <Button variant="outline" onClick={async () => {
          const text = [title, service.address].filter(Boolean).join(" - ");
          if (navigator.share) {
            try { await navigator.share({ title: "RoadSOS Service", text }); } catch (e) { /* ignore cancel */ }
          } else {
            navigator.clipboard?.writeText(text);
            window.alert("Copied to clipboard!");
          }
        }}><Share2 size={16} />Share</Button>
      </footer>
    </div>
  );
}
