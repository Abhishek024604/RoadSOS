import { Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SearchBar } from "../features/search/SearchBar.jsx";
import { categories } from "../data/categories.js";
import { ServiceCard } from "../features/sidebar/ServiceCard.jsx";
import { useNearbyServices } from "../features/nearby-services/useNearbyServices.js";
import { searchPlaces } from "../services/api.js";
import { useRoadSosStore } from "../store/useRoadSosStore.js";
import { PageHeader } from "./PageHeader.jsx";

export function SearchPage() {
  const recent = useRoadSosStore((state) => state.recentSearches);
  const query = useRoadSosStore((state) => state.query);
  const setQuery = useRoadSosStore((state) => state.setQuery);
  const { data: nearbyServices = [] } = useNearbyServices();
  const { data: searchResults = [], isFetching } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchPlaces(query),
    enabled: Boolean(query.trim())
  });
  const services = query.trim() ? searchResults : nearbyServices;

  return (
    <div className="min-h-full p-5 pt-0">
      <PageHeader title="Search" />
      <SearchBar />
      <section className="mt-6">
        <h2 className="mb-3 text-xs font-bold uppercase text-ink">Recent Searches</h2>
        {recent.length ? recent.map((item) => <button key={item} onClick={() => setQuery(item)} className="flex w-full items-center gap-3 py-2 text-sm"><Clock size={16} />{item}</button>) : <p className="text-sm text-muted">No recent searches yet.</p>}
      </section>
      <section className="mt-5">
        <h2 className="mb-3 text-xs font-bold uppercase text-ink">Popular Searches</h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.slice(0, 6).map(({ id, label, color, Icon }) => <button key={id} onClick={() => setQuery(label)} className="flex items-center gap-2 rounded-xl border border-line px-3 py-3 text-sm font-semibold"><Icon size={17} color={color} />{label}</button>)}
        </div>
      </section>
      <section className="mt-5 space-y-3">
        <h2 className="text-xs font-bold uppercase text-ink">Results</h2>
        {isFetching && <div className="rounded-xl bg-slate-100 p-4 text-sm text-muted">Searching live map data...</div>}
        {!isFetching && services.slice(0, 4).map((service) => <ServiceCard key={service.id} service={service} compact />)}
        {!isFetching && !services.length && <div className="rounded-xl bg-slate-100 p-4 text-sm text-muted">No live results found for this search.</div>}
      </section>
    </div>
  );
}
