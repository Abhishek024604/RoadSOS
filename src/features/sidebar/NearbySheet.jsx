import { ServiceCard } from "./ServiceCard.jsx";

export function NearbySheet({ services, desktop = false }) {
  return (
    <section className={desktop ? "flex h-full flex-col overflow-hidden" : "z-30 flex max-h-[50vh] flex-col overflow-hidden rounded-t-panel bg-white p-4 shadow-soft"}>
      {!desktop && <div className="mx-auto mb-3 h-1 w-14 shrink-0 rounded-full bg-slate-300" />}
      <h2 className="mb-3 shrink-0 text-lg font-bold">Nearby Services</h2>
      <div className="flex-1 space-y-3 overflow-y-auto pr-2 pb-2 min-h-0">
        {services.length ? services.map((service) => <ServiceCard key={service.id} service={service} compact />) : (
          <div className="rounded-xl bg-slate-100 p-4 text-sm text-muted">No matching services. Try changing filters or search.</div>
        )}
      </div>
    </section>
  );
}
