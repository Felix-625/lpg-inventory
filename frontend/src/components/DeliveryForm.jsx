import { useState } from "react";
import { Truck, Loader2 } from "lucide-react";
import api from "../api/client";

export default function DeliveryForm({ cylinders, onSaved }) {
  const [form, setForm] = useState({
    cylinderId: cylinders[0]?._id || "",
    quantity: 1,
    emptyReturned: 0,
    supplier: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      await api.post("/transactions/delivery", form);
      setMsg({ type: "success", text: "Delivery logged successfully." });
      setForm({ ...form, quantity: 1, emptyReturned: 0, supplier: "", note: "" });
      onSaved?.();
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-ink-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-sky-soft/20 text-navy-700 flex items-center justify-center">
          <Truck size={18} />
        </div>
        <div>
          <h3 className="font-bold text-ink-800">Log Delivery</h3>
          <p className="text-xs text-ink-400">Record stock received from supplier</p>
        </div>
      </div>

      {msg && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm border ${
            msg.type === "success"
              ? "bg-navy-50 text-navy-700 border-navy-100"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {msg.text}
        </div>
      )}

      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-sm font-medium text-ink-700">Cylinder</label>
          <select
            value={form.cylinderId}
            onChange={(e) => setForm({ ...form, cylinderId: e.target.value })}
            className="mt-1 w-full px-3 py-2 border border-ink-100 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
          >
            {cylinders.map((c) => (
              <option key={c._id} value={c._id}>
                {c.brand} {c.size}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-ink-700">Full received</label>
            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-ink-100 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700">Empties sent back</label>
            <input
              type="number"
              min="0"
              value={form.emptyReturned}
              onChange={(e) => setForm({ ...form, emptyReturned: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-ink-100 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-ink-700">Supplier</label>
          <input
            value={form.supplier}
            onChange={(e) => setForm({ ...form, supplier: e.target.value })}
            className="mt-1 w-full px-3 py-2 border border-ink-100 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
            placeholder="e.g., Petron Depot"
          />
        </div>

        <button
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-navy-700 hover:bg-navy-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Saving..." : "Log delivery"}
        </button>
      </form>
    </div>
  );
}