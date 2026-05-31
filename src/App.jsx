import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Bell, X } from "lucide-react";
import { Button } from "./components/ui/Button.jsx";
import { Brand } from "./components/Brand.jsx";
import { SearchBar } from "./features/search/SearchBar.jsx";
import { FilterPanel } from "./features/filters/FilterPanel.jsx";
import { CategoryChips } from "./features/filters/CategoryChips.jsx";
import { RoadMap } from "./features/map/RoadMap.jsx";
import { NearbySheet } from "./features/sidebar/NearbySheet.jsx";
import { ServiceDetailsPage } from "./pages/ServiceDetailsPage.jsx";
import { RoutePage } from "./pages/RoutePage.jsx";
import { SearchPage } from "./pages/SearchPage.jsx";
import { OfflinePage } from "./pages/OfflinePage.jsx";
import { ListPage } from "./pages/ListPage.jsx";
import { HelpPage } from "./pages/HelpPage.jsx";
import { useNearbyServices } from "./features/nearby-services/useNearbyServices.js";
import { useRoadSosStore } from "./store/useRoadSosStore.js";
import { useGeolocation } from "./hooks/useGeolocation.js";

export default function App() {
  useGeolocation();
  const screen = useRoadSosStore((state) => state.screen);
  const setScreen = useRoadSosStore((state) => state.setScreen);
  const setOnline = useRoadSosStore((state) => state.setOnline);
  const locationStatus = useRoadSosStore((state) => state.locationStatus);
  const locationError = useRoadSosStore((state) => state.locationError);
  const { data: services = [], isFetching, error: servicesError } = useNearbyServices();

  useEffect(() => {
    const syncOnlineState = () => setOnline(navigator.onLine);
    syncOnlineState();
    window.addEventListener("online", syncOnlineState);
    window.addEventListener("offline", syncOnlineState);
    return () => {
      window.removeEventListener("online", syncOnlineState);
      window.removeEventListener("offline", syncOnlineState);
    };
  }, [setOnline]);

  return (
    <div className="h-[100dvh] overflow-hidden bg-slate-100 p-0 text-ink lg:p-5">
      <AnimatePresence mode="wait">
        {screen === "map" ? (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-auto grid h-full max-w-[1500px] bg-white shadow-soft lg:h-[calc(100dvh-40px)] lg:grid-cols-[310px_1fr_360px] lg:grid-rows-[82px_1fr] lg:overflow-hidden lg:rounded-panel"
          >
            <header className="hidden items-center justify-between border-b border-line px-6 lg:col-span-3 lg:flex">
              <Brand />
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setScreen("list")}>List View</Button>
                <Button variant="ghostIcon" aria-label="Open help" onClick={() => setScreen("help")}><Menu size={22} /></Button>
              </div>
            </header>

            <aside className="hidden flex-col overflow-y-auto border-r border-line p-5 lg:flex">
              <SearchBar />
              <FilterPanel />
            </aside>

            <main className="relative hidden overflow-hidden lg:block">
              <RoadMap services={services} />
              <LocationNotice status={locationStatus} error={locationError || servicesError?.message} loading={isFetching} />
            </main>

            <aside className="hidden border-l border-line bg-slate-50 p-5 lg:flex lg:flex-col lg:overflow-hidden">
              <NearbySheet services={services} desktop />
            </aside>

            <section className="relative flex h-[100dvh] flex-col overflow-hidden lg:hidden">
              <header className="z-20 flex items-center gap-3 p-4">
                <Button variant="ghostIcon" onClick={() => setScreen("help")} aria-label="Menu"><Menu size={22} /></Button>
                <SearchBar compact />
                <Button variant="ghostIcon" onClick={() => setScreen("filters")} aria-label="Filters"><Bell size={20} /></Button>
              </header>
              <CategoryChips />
              <div className="relative flex-1">
                <RoadMap services={services} />
                <LocationNotice status={locationStatus} error={locationError || servicesError?.message} loading={isFetching} />
              </div>
              <NearbySheet services={services} />
            </section>
          </motion.div>
        ) : (
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mx-auto h-[100dvh] w-full max-w-[440px] overflow-y-auto bg-white shadow-soft lg:h-[calc(100dvh-40px)] lg:rounded-panel"
          >
            {screen === "filters" && <ModalHeader title="Filters" closeIcon={<X size={20} />} />}
            {screen === "filters" && <FilterPanel mobile />}
            {screen === "details" && <ServiceDetailsPage />}
            {screen === "route" && <RoutePage />}
            {screen === "search" && <SearchPage />}
            {screen === "offline" && <OfflinePage />}
            {screen === "list" && <ListPage />}
            {screen === "help" && <HelpPage />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModalHeader({ title, closeIcon }) {
  const setScreen = useRoadSosStore((state) => state.setScreen);
  return (
    <header className="flex items-center justify-between px-5 py-4">
      <h1 className="text-lg font-bold">{title}</h1>
      <Button variant="ghostIcon" onClick={() => setScreen("map")} aria-label="Close">{closeIcon}</Button>
    </header>
  );
}

function LocationNotice({ status, error, loading }) {
  if (status === "ready" && !loading) return null;
  return (
    <div className="absolute left-4 right-4 top-20 z-20 rounded-xl bg-white px-4 py-3 text-sm font-semibold shadow-soft ring-1 ring-line lg:left-6 lg:right-auto lg:max-w-sm">
      {status === "requesting" || loading ? "Finding your location and loading nearby live services..." : error || "Allow location access to show nearby services."}
    </div>
  );
}
