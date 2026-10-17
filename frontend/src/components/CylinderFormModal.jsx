import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import api from "../api/client";

const KNOWN_BRANDS = ["Petron Gasul Elite", "Solane", "Fiesta Gas", "TownGaz"];

export default function CylinderFormModal({ cylinder, onClose, onSaved }) {
  const isEdit = Boolean(cylinder);
  const [form, setForm] = useState({
    brand: "",
    size: "",
    fullCount: 0,
    emptyCount: 0,
    lowStockThreshold: 10,
    price: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (cylinder) {
      setForm({
        brand: cylinder.brand,
        size: cylinder.size,
        fullCount: cylinder.fullCount,
        emptyCount: cylinder.emptyCount,
        lowStockThreshold: cylinder.lowStockThreshold,
        price: cylinder.price,
      });
    }
  }, [cylinder]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isEdit) {
        await api.put(`/cylinders/${cylinder._id}`, form);
      } else {
        await api.post("/cylinders", form);
      }
      onSaved?.();
    } catch (err) {
      setError(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink-900/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-ink-800">
            {isEdit ? "Edit cylinder type" : "New cylinder type"}
          </h3>
          <button
            onClick={onClose}
            className="text-ink-400 hover:text-ink-700"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-3 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-sm font-medium text-ink-700">Brand</label>
            <input
              required
              list="brand-options"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-ink-100 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
              placeholder="e.g., Petron Gasul Elite"
            />
            <datalist id="brand-options">
              {KNOWN_BRANDS.map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="text-sm font-medium text-ink-700">Size</label>
            <input
              required
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-ink-100 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
              placeholder="e.g., 11kg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Full count" field="fullCount" form={form} setForm={setForm} />
            <NumberField label="Empty count" field="emptyCount" form={form} setForm={setForm} />
            <NumberField
              label="Low stock threshold"
              field="lowStockThreshold"
              form={form}
              setForm={setForm}
            />
            <NumberField label="Price (₱)" field="price" form={form} setForm={setForm} />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-ink-100 text-ink-700 font-semibold hover:bg-ink-50 transition"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-navy-700 hover:bg-navy-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Saving…" : isEdit ? "Save changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function NumberField({ label, field, form, setForm }) {
  return (
    <div>
      <label className="text-sm font-medium text-ink-700">{label}</label>
      <input
        type="number"
        min="0"
        value={form[field]}
        onChange={(e) => setForm({ ...form, [field]: Number(e.target.value) })}
        className="mt-1 w-full px-3 py-2 border border-ink-100 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
      />
    </div>
  );
}