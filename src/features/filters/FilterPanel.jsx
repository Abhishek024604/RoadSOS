import { categories } from "../../data/categories.js";
import { useRoadSosStore } from "../../store/useRoadSosStore.js";
import { Button } from "../../components/ui/Button.jsx";

export function FilterPanel({ mobile = false }) {
  const active = useRoadSosStore((state) => state.activeCategories);
  const setCategory = useRoadSosStore((state) => state.setCategory);
  const resetCategories = useRoadSosStore((state) => state.resetCategories);
  const setScreen = useRoadSosStore((state) => state.setScreen);

  return (
    <section className={mobile ? "px-5 pb-6" : "mt-8"}>
      <h2 className="mb-4 text-xs font-bold uppercase tracking-wide text-ink">Select Services</h2>
      <div className="space-y-4">
        {categories.map(({ id, label, color, Icon }) => (
          <label key={id} className="flex cursor-pointer items-center gap-3 text-sm font-medium">
            <span className="grid h-7 w-7 place-items-center rounded-full text-white" style={{ backgroundColor: color }}><Icon size={16} /></span>
            <span className="flex-1">{label}</span>
            <input
              type="checkbox"
              checked={active.includes(id)}
              onChange={(event) => setCategory(id, event.target.checked)}
              className="h-4 w-4 accent-roadsos"
            />
          </label>
        ))}
      </div>
      <div className="mt-8 space-y-3">
        {mobile && <Button className="w-full" onClick={() => setScreen("map")}>Apply Filters</Button>}
        <Button variant="outline" className="w-full" onClick={resetCategories}>Clear Filters</Button>
      </div>
    </section>
  );
}
