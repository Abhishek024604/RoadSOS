import { useEffect, useRef, useState } from "react";
import { LocateFixed, Minus, Navigation, Plus } from "lucide-react";
import { categoryById } from "../../data/categories.js";
import { useRoadSosStore } from "../../store/useRoadSosStore.js";

export function RoadMap({ services, routeGeometry }) {
  const mapNode = useRef(null);
  const map = useRef(null);
  const userMarker = useRef(null);
  const markers = useRef([]);
  const polyline = useRef(null);
  const hasFlownToLocation = useRef(false);
  const [mapError, setMapError] = useState("");
  const [mapReady, setMapReady] = useState(false);
  const location = useRoadSosStore((state) => state.location);
  const routeToService = useRoadSosStore((state) => state.routeToService);
  const selectService = useRoadSosStore((state) => state.selectService);
  const center = location || { lat: 20.5937, lng: 78.9629 };

  useEffect(() => {
    if (!mapNode.current || map.current) return;
    
    if (!window.google?.maps) {
      const blankTimer = window.setInterval(() => {
        if (window.google?.maps) {
          window.clearInterval(blankTimer);
          initMap();
        }
      }, 500);
      window.setTimeout(() => {
        window.clearInterval(blankTimer);
        if (!mapReady && !window.google?.maps) setMapError("Google Maps script failed to load. Check API Key or Network.");
      }, 10000);
      return () => window.clearInterval(blankTimer);
    } else {
      initMap();
    }

    async function initMap() {
      try {
        const { Map } = await window.google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");

        map.current = new Map(mapNode.current, {
          center,
          zoom: location ? 13 : 4,
          disableDefaultUI: true,
          clickableIcons: false,
          mapId: "ROADSOS_MAP_ID"
        });

        window.google.maps.event.addListenerOnce(map.current, "idle", () => {
          setMapReady(true);
        });

        const userEl = document.createElement("div");
        userEl.className = "user-pulse";
        
        userMarker.current = new AdvancedMarkerElement({
          map: map.current,
          position: center,
          content: userEl,
          zIndex: 9999
        });
      } catch (err) {
        setMapError(err.message);
      }
    }

    return () => {
      markers.current.forEach((marker) => { if (marker.map) marker.map = null; });
      markers.current = [];
      if (polyline.current) polyline.current.setMap(null);
      if (userMarker.current) userMarker.current.map = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current || !location || !userMarker.current) return;
    
    userMarker.current.position = location;

    if (!hasFlownToLocation.current) {
      map.current.panTo(location);
      map.current.setZoom(13);
      hasFlownToLocation.current = true;
    }
  }, [location?.lat, location?.lng]);

  useEffect(() => {
    if (!map.current || !mapReady || !window.google?.maps?.marker) return;
    
    markers.current.forEach((marker) => { marker.map = null; });
    
    markers.current = services
      .filter((service) => Number.isFinite(service.lat) && Number.isFinite(service.lng))
      .map((service) => {
        const category = categoryById[service.type] || categoryById.unknown;
        
        const container = document.createElement("div");
        const el = document.createElement("button");
        el.className = "map-pin";
        el.style.backgroundColor = category.color;
        el.innerHTML = `<span>${category.short.charAt(0)}</span>`;
        el.title = service.name || category.label;
        container.appendChild(el);
        container.addEventListener("click", () => selectService(service));

        // Add microscopic jitter (~15m) so overlapping businesses at the same exact lat/lng don't hide each other
        const jitterLat = service.lat + (Math.random() - 0.5) * 0.0003;
        const jitterLng = service.lng + (Math.random() - 0.5) * 0.0003;

        return new window.google.maps.marker.AdvancedMarkerElement({
          map: map.current,
          position: { lat: jitterLat, lng: jitterLng },
          content: container
        });
      });
  }, [services, selectService, mapReady]);

  useEffect(() => {
    if (!map.current || !mapReady) return;

    if (polyline.current) {
      polyline.current.setMap(null);
      polyline.current = null;
    }

    if (!routeGeometry || routeGeometry.length === 0) return;

    const path = routeGeometry.map(coord => ({ lat: coord[1], lng: coord[0] }));

    polyline.current = new window.google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: "#2563eb",
      strokeOpacity: 0.8,
      strokeWeight: 5
    });
    polyline.current.setMap(map.current);

    const bounds = new window.google.maps.LatLngBounds();
    path.forEach(coord => bounds.extend(coord));
    map.current.fitBounds(bounds, 40);
  }, [routeGeometry, mapReady]);

  const first = services[0];

  return (
    <div className="absolute inset-0">
      {(!mapReady || mapError) && <div className="absolute inset-0 bg-slate-200" />}
      <div ref={mapNode} className={`absolute inset-0 h-full w-full ${mapError ? "hidden" : ""}`} />
      <div className="absolute left-4 top-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold shadow-soft">
        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />
        Showing {services.length} live services
      </div>
      {mapError && (
        <div className="absolute left-4 right-4 top-20 z-10 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-red-700 shadow-soft ring-1 ring-red-200 lg:right-auto lg:max-w-sm">
          Map could not load: {mapError}
        </div>
      )}
      <div className="absolute bottom-20 right-4 grid overflow-hidden rounded-xl bg-white shadow-soft ring-1 ring-line">
        <button className="grid h-12 w-12 place-items-center border-b border-line" onClick={() => location && map.current?.panTo(location)} aria-label="Locate me"><LocateFixed size={20} /></button>
        <button className="grid h-12 w-12 place-items-center border-b border-line" onClick={() => map.current?.setZoom(map.current.getZoom() + 1)} aria-label="Zoom in"><Plus size={20} /></button>
        <button className="grid h-12 w-12 place-items-center" onClick={() => map.current?.setZoom(map.current.getZoom() - 1)} aria-label="Zoom out"><Minus size={20} /></button>
      </div>
      <div className="absolute bottom-4 left-4 right-4 hidden items-center gap-3 overflow-x-auto rounded-xl bg-white px-4 py-3 text-xs font-semibold shadow-soft lg:flex">
        {Object.values(categoryById).map(({ id, short, color, Icon }) => <span key={id} className="flex items-center gap-1"><Icon size={15} color={color} />{short}</span>)}
      </div>
      {first && !routeGeometry && (
        <button
          onClick={() => routeToService(first)}
          className="absolute right-4 top-4 hidden rounded-xl bg-roadsos px-4 py-2 text-sm font-bold text-white shadow-soft lg:flex"
        >
          <Navigation size={17} className="mr-2" /> Quick Route
        </button>
      )}
    </div>
  );
}
