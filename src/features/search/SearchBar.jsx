import { Search } from "lucide-react";
import { useRoadSosStore } from "../../store/useRoadSosStore.js";

export function SearchBar({ compact = false }) {
  const query = useRoadSosStore((state) => state.query);
  const setQuery = useRoadSosStore((state) => state.setQuery);
  const setScreen = useRoadSosStore((state) => state.setScreen);
  const rememberSearch = useRoadSosStore((state) => state.rememberSearch);

  function submit(event) {
    event.preventDefault();
    if (query.trim()) rememberSearch(query.trim());
    setScreen("search");
  }

  return (
    <form onSubmit={submit} className={`flex h-12 items-center gap-2 rounded-xl border border-line bg-white px-3 shadow-sm ${compact ? "min-w-0 flex-1" : "w-full"}`}>
      <Search size={18} className="text-muted" />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search services or places"
        className="min-w-0 flex-1 bg-transparent text-sm outline-none"
      />
    </form>
  );
}
