import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Truck, ShoppingCart, Boxes } from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import StatCard from "../components/StatCard.jsx";
import TransactionsFeed from "../components/TransactionsFeed.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [cylinders, setCylinders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [cRes, tRes] = await Promise.all([
        api.get("/cylinders"),
        api.get("/transactions?limit=10"),
      ]);
      setCylinders(cRes.data);
      setTransactions(tRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const id = setInterval(loadData, 15000);
    return () => clearInterval(id);
  }, [loadData]);

  const lowStockCount = cylinders.filter(
    (c) => c.fullCount <= c.lowStockThreshold
  ).length;

  const totalFull = cylinders.reduce((s, c) => s + c.fullCount, 0);
  const totalEmpty = cylinders.reduce((s, c) => s + c.emptyCount, 0);

  return (
    <div className="p-8">
      <header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-navy-700">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-ink-400">
            Here's your LPG inventory snapshot for today.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <SummaryPill label="Total Full" value={totalFull} tone="navy" />
          <SummaryPill label="Total Empty" value={totalEmpty} tone="ink" />
          {lowStockCount > 0 && (
            <SummaryPill label="Low Stock" value={lowStockCount} tone="gold" />
          )}
        </div>
      </header>

      {lowStockCount > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-gold-50 border border-gold-200 text-gold-700 text-sm">
          ⚠️ {lowStockCount} cylinder type{lowStockCount > 1 ? "s are" : " is"} running
          low. Consider restocking soon.
        </div>
      )}

      {/* Quick actions */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <QuickAction
          to="/delivery"
          icon={Truck}
          title="Log Delivery"
          desc="Receive stock from a supplier"
        />
        <QuickAction
          to="/sale"
          icon={ShoppingCart}
          title="New Sale / Swap"
          desc="Sell a full cylinder, take back an empty"
          accent
        />
        <QuickAction
          to="/inventory"
          icon={Boxes}
          title="Manage Inventory"
          desc="Add, edit, or remove cylinder types"
        />
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-ink-100 shadow-sm p-6 animate-pulse h-44"
            />
          ))
        ) : cylinders.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-dashed border-ink-100 p-10 text-center text-ink-400">
            No cylinder types yet. Add some from the Inventory page.
          </div>
        ) : (
          cylinders.map((c) => <StatCard key={c._id} cylinder={c} />)
        )}
      </section>

      <section>
  <TransactionsFeed transactions={transactions} />
  <div className="mt-3 text-right">
    <Link
      to="/sales"
      className="text-sm font-semibold text-navy-700 hover:underline"
    >
      View all sales →
    </Link>
  </div>
</section>
    </div>
  );
}

function SummaryPill({ label, value, tone }) {
  const tones = {
    navy: "bg-navy-50 text-navy-700 border-navy-100",
    ink: "bg-white text-ink-800 border-ink-100",
    gold: "bg-gold-50 text-gold-700 border-gold-200",
  };
  return (
    <div className={`px-4 py-2 rounded-xl border ${tones[tone]} shadow-sm`}>
      <p className="text-[11px] uppercase tracking-wider font-semibold opacity-80">
        {label}
      </p>
      <p className="text-lg font-bold leading-tight">{value}</p>
    </div>
  );
}

function QuickAction({ to, icon: Icon, title, desc, accent }) {
  return (
    <Link
      to={to}
      className={`group rounded-2xl border p-5 bg-white shadow-sm hover:shadow-md transition flex items-start gap-4 ${
        accent ? "border-gold-200 hover:border-gold-500" : "border-ink-100 hover:border-navy-300"
      }`}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
          accent ? "bg-gold-50 text-gold-700" : "bg-navy-50 text-navy-700"
        }`}
      >
        <Icon size={20} />
      </div>
      <div>
        <p className="font-semibold text-ink-800 group-hover:text-navy-700">{title}</p>
        <p className="text-xs text-ink-400 mt-0.5">{desc}</p>
      </div>
    </Link>
  );
}