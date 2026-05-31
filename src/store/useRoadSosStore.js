import { create } from "zustand";
import { categories } from "../data/categories.js";

const allCategories = categories.map((category) => category.id);
const lastLocation = JSON.parse(localStorage.getItem("roadsos_last_location") || "null");

export const useRoadSosStore = create((set) => ({
  screen: "map",
  query: "",
  activeCategories: [],
  selectedService: null,
  routeService: null,
  isOnline: navigator.onLine,
  location: lastLocation,
  locationStatus: lastLocation ? "ready" : "idle",
  locationError: "",
  recentSearches: JSON.parse(localStorage.getItem("roadsos_recent_searches") || "[]"),
  setScreen: (screen) => set({ screen }),
  setQuery: (query) => set({ query }),
  setLocation: (location) => {
    localStorage.setItem("roadsos_last_location", JSON.stringify(location));
    set({ location, locationStatus: "ready", locationError: "" });
  },
  setLocationStatus: (locationStatus, locationError = "") => set({ locationStatus, locationError }),
  setOnline: (isOnline) => set((state) => ({
    isOnline,
    screen: isOnline ? state.screen : "offline"
  })),
  toggleCategory: (id) => set((state) => ({
    activeCategories: state.activeCategories.includes(id)
      ? state.activeCategories.filter((categoryId) => categoryId !== id)
      : [...state.activeCategories, id]
  })),
  setCategory: (id, enabled) => set((state) => ({
    activeCategories: enabled
      ? Array.from(new Set([...state.activeCategories, id]))
      : state.activeCategories.filter((categoryId) => categoryId !== id)
  })),
  resetCategories: () => set({ activeCategories: [] }),
  selectService: (service) => set({ selectedService: service, screen: "details" }),
  routeToService: (service) => set({ selectedService: service, routeService: service, screen: "route" }),
  rememberSearch: (term) => set((state) => {
    const next = [term, ...state.recentSearches.filter((item) => item !== term)].slice(0, 5);
    localStorage.setItem("roadsos_recent_searches", JSON.stringify(next));
    return { recentSearches: next };
  })
}));
