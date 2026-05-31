export function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-red-500 text-2xl font-black text-white shadow-lg shadow-red-500/25">✚</div>
      <div className="leading-tight">
        <strong className="block text-2xl">RoadSOS</strong>
        <span className="text-sm font-medium text-muted">Nearby Help. Faster Relief.</span>
      </div>
    </div>
  );
}
