import { AlertTriangle } from "lucide-react";

const brandDot = {
  "Petron Gasul Elite": "bg-navy-700",
  Solane:               "bg-gold-500",
  "Fiesta Gas":         "bg-sky-soft",
  TownGaz:              "bg-ink-800",
};

export default function StatCard({ cylinder }) {
  const isLow = cylinder.fullCount <= cylinder.lowStockThreshold;
  const dot = brandDot[cylinder.brand] || "bg-navy-400";

  return (
    <div
      className={`relative bg-white rounded-2xl border shadow-sm p-6 transition hover:shadow-md ${
        isLow ? "border-gold-500 ring-1 ring-gold-200" : "border-ink-100"
      }`}
    >
      {isLow && (
        <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gold-50 text-gold-700 text-xs font-semibold">
          <AlertTriangle size={12} /> Low stock
        </span>
      )}

      <div className="flex items-center gap-2 mb-2">
        <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
        <p className="text-xs uppercase tracking-wider text-ink-400 font-semibold">
          {cylinder.size}
        </p>
      </div>

      <h3 className="text-lg font-bold text-ink-800 leading-tight">
        {cylinder.brand}
      </h3>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="rounded-xl bg-navy-50 p-3">
          <p className="text-xs text-navy-600 font-medium">Full</p>
          <p className="text-2xl font-bold text-navy-700">{cylinder.fullCount}</p>
        </div>
        <div className="rounded-xl bg-ink-50 p-3">
          <p className="text-xs text-ink-400 font-medium">Empty</p>
          <p className="text-2xl font-bold text-ink-800">{cylinder.emptyCount}</p>
        </div>
      </div>

      <div className="mt-4 flex justify-between text-xs text-ink-400">
        <span>Threshold: {cylinder.lowStockThreshold}</span>
        <span className="font-semibold text-navy-700">
          ₱{cylinder.price.toLocaleString()} / unit
        </span>
      </div>
    </div>
  );
}