import { SlidersHorizontal } from "lucide-react";
import { Button } from "../components/ui/Button.jsx";
import { ServiceCard } from "../features/sidebar/ServiceCard.jsx";
import { useNearbyServices } from "../features/nearby-services/useNearbyServices.js";
import { useRoadSosStore } from "../store/useRoadSosStore.js";
import { PageHeader } from "./PageHeader.jsx";

export function ListPage() {
  const { data: services = [] } = useNearbyServices();
  const setScreen = useRoadSosStore((state) => state.setScreen);

  return (
    <div className="min-h-full p-5 pt-0">
      <PageHeader title="List View" right={<Button variant="ghost" className="p-0" onClick={() => setScreen("filters")}><SlidersHorizontal size={18} /></Button>} />
      <div className="space-y-3">
        {services.map((service) => <ServiceCard key={service.id} service={service} compact />)}
      </div>
    </div>
  );
}
