import { useEffect, useState, useMemo } from "react";
import { Search, Calendar, TrendingUp, PackageCheck, Receipt } from "lucide-react";
import api from "../api/client";

const peso = (n) =>
  `₱${Number(n || 0).toLocaleString("en-PH", { maximumFractionDigits: 2 })}`;

const formatDateTime = (iso) =>
  new Date(iso).toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// Build last 12 months for the dropdown (incl. current)
function last12Months() {
  const out = [];
  const d = new Date();
  for (let i = 0; i < 12; i++) {
    const dt = new Date(d.getFullYear(), d.getMonth() - i, 1);
    const value = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
    const label = dt.toLocaleString("en-PH", { month: "long", year: "numeric" });
    out.push({ value, label });
  }
  return out;
}

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState("all");
  const [search, setSearch] = useState("");

  const months = useMemo(last12Months, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const params = { type: "sale" };
    if (month !== "all") params.month = month;

    api
      .get("/transactions", { params })
      .then(({ data }) => {
        if (active) setSales(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [month]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sales;
    return sales.filter((s) =>
      `${s.brand} ${s.cylinderSize} ${s.customer || ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [sales, search]);

  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, s) => {
        acc.revenue += s.totalAmount || 0;
        acc.units += s.quantity || 0;
        acc.count += 1;
        return acc;
      },
      { revenue: 0, units: 0, count: 0 }
    );
  }, [filtered]);

  const currentMonthLabel =
    month === "all"
      ? "All time"
      : months.find((m) => m.value === month)?.label || month;

  return (
    <div className="p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-navy-700">Sales</h1>
        <p className="text-sm text-ink-400">
          Review every completed sale. Filter by month to see a specific period's performance.
        </p>
      </header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 bg-white border border-ink-100 rounded-lg px-3 py-2">
          <Calendar size={16} className="text-ink-400" />
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-transparent text-sm font-medium text-ink-800 outline-none pr-2"
          >
            <option value="all">All time</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 bg-white border border-ink-100 rounded-lg px-3 py-2 flex-1 max-w-md">
          <Search size={16} className="text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brand, size, or customer…"
            className="bg-transparent text-sm outline-none w-full text-ink-800 placeholder:text-ink-400"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Stat
          icon={TrendingUp}
          label="Total Revenue"
          value={peso(totals.revenue)}
          hint={currentMonthLabel}
          tone="gold"
        />
        <Stat
          icon={PackageCheck}
          label="Units Sold"
          value={totals.units}
          hint={currentMonthLabel}
          tone="navy"
        />
        <Stat
          icon={Receipt}
          label="Transactions"
          value={totals.count}
          hint={currentMonthLabel}
          tone="ink"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-ink-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy-50 text-navy-700 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-5 py-3 font-semibold">Date</th>
              <th className="text-left px-5 py-3 font-semibold">Cylinder</th>
              <th className="text-left px-5 py-3 font-semibold">Customer</th>
              <th className="text-right px-5 py-3 font-semibold">Qty</th>
              <th className="text-right px-5 py-3 font-semibold">Empties In</th>
              <th className="text-right px-5 py-3 font-semibold">Unit Price</th>
              <th className="text-right px-5 py-3 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-5 py-10 text-center text-ink-400">
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-5 py-10 text-center text-ink-400">
                  No sales found for {currentMonthLabel.toLowerCase()}.
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s._id} className="hover:bg-navy-50/40">
                  <td className="px-5 py-3 text-ink-400 whitespace-nowrap">
                    {formatDateTime(s.createdAt)}
                  </td>
                  <td className="px-5 py-3 font-semibold text-ink-800">
                    {s.brand} <span className="text-ink-400 font-normal">{s.cylinderSize}</span>
                  </td>
                  <td className="px-5 py-3 text-ink-700">
                    {s.customer || <span className="text-ink-400">Walk-in</span>}
                  </td>
                  <td className="px-5 py-3 text-right text-ink-800">{s.quantity}</td>
                  <td className="px-5 py-3 text-right text-ink-700">{s.emptyReturned}</td>
                  <td className="px-5 py-3 text-right text-ink-700">
                    {peso(s.unitPrice)}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-gold-700">
                    {peso(s.totalAmount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {!loading && filtered.length > 0 && (
            <tfoot className="bg-navy-50 text-navy-700">
              <tr>
                <td colSpan="3" className="px-5 py-3 font-semibold">
                  Totals ({filtered.length} {filtered.length === 1 ? "sale" : "sales"})
                </td>
                <td className="px-5 py-3 text-right font-semibold">{totals.units}</td>
                <td />
                <td />
                <td className="px-5 py-3 text-right font-bold">
                  {peso(totals.revenue)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, hint, tone }) {
  const tones = {
    gold: "bg-gold-50 text-gold-700",
    navy: "bg-navy-50 text-navy-700",
    ink: "bg-ink-50 text-ink-800",
  };
  return (
    <div className="bg-white rounded-2xl border border-ink-100 shadow-sm p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tones[tone]}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-ink-400 font-semibold">
          {label}
        </p>
        <p className="text-2xl font-bold text-ink-800 leading-tight truncate">{value}</p>
        <p className="text-[11px] text-ink-400 mt-0.5">{hint}</p>
      </div>
    </div>
  );
}