import { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import StatCard from "../components/StatCard.jsx";
import DeliveryForm from "../components/DeliveryForm.jsx";
import SaleForm from "../components/SaleForm.jsx";
import TransactionsFeed from "../components/TransactionsFeed.jsx";
import AddCylinderModal from "../components/AddCylinderModal.jsx";

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
          <AddCylinderModal onCreated={loadData} />
        </div>
      </header>

      {lowStockCount > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-gold-50 border border-gold-200 text-gold-700 text-sm">
          ⚠️ {lowStockCount} cylinder type{lowStockCount > 1 ? "s are" : " is"} running
          low. Consider restocking soon.
        </div>
      )}

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
            <Plus className="mx-auto mb-2" />
            No cylinder types yet. Seed the database to get started.
          </div>
        ) : (
          cylinders.map((c) => <StatCard key={c._id} cylinder={c} />)
        )}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DeliveryForm cylinders={cylinders} onSaved={loadData} />
        <SaleForm cylinders={cylinders} onSaved={loadData} />
      </section>

      <section>
        <TransactionsFeed transactions={transactions} />
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