import { Ambulance, Building2, Fuel, Hospital, MapPin, Pill, Shield, Wrench, Cross } from "lucide-react";

export const categories = [
  { id: "hospital", label: "Hospitals", short: "Hospitals", color: "#ef4444", Icon: Hospital },
  { id: "trauma", label: "Trauma Centers", short: "Trauma", color: "#dc2626", Icon: Cross },
  { id: "police", label: "Police Stations", short: "Police", color: "#2563eb", Icon: Shield },
  { id: "ambulance", label: "Ambulance Services", short: "Ambulance", color: "#f97316", Icon: Ambulance },
  { id: "towing", label: "Towing Services", short: "Towing", color: "#f59e0b", Icon: Wrench },
  { id: "puncture", label: "Puncture Shops", short: "Puncture", color: "#8b5cf6", Icon: Building2 },
  { id: "pharmacy", label: "Pharmacies", short: "Pharmacy", color: "#10b981", Icon: Pill },
  { id: "fuel", label: "Fuel Stations", short: "Fuel", color: "#eab308", Icon: Fuel }
];

export const unknownCategory = { id: "unknown", label: "Uncategorized", short: "Other", color: "#64748b", Icon: MapPin };

export const categoryById = {
  ...Object.fromEntries(categories.map((category) => [category.id, category])),
  unknown: unknownCategory
};
