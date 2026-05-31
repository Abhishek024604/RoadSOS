import { categories } from "../../data/categories.js";
import { useRoadSosStore } from "../../store/useRoadSosStore.js";

export function CategoryChips() {
  const active = useRoadSosStore((state) => state.activeCategories);
  const toggleCategory = useRoadSosStore((state) => state.toggleCategory);
  const setScreen = useRoadSosStore((state) => state.setScreen);

  return (
    <div className="z-20 flex gap-2 overflow-x-auto px-4 pb-3">
      {categories.slice(0, 4).map((category) => (
        <button
          key={category.id}
          onClick={() => toggleCategory(category.id)}
          className="shrink-0 rounded-full px-4 py-2 text-sm font-bold text-white shadow-sm"
          style={{ backgroundColor: active.includes(category.id) ? category.color : "#94a3b8" }}
        >
          {category.short}
        </button>
      ))}
      <button onClick={() => setScreen("filters")} className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm ring-1 ring-line">More</button>
    </div>
  );
}
