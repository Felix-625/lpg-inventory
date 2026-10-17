import { useEffect, useState, useCallback } from "react";
import { Pencil, Trash2, Plus, AlertTriangle } from "lucide-react";
import api from "../api/client";
import CylinderFormModal from "../components/CylinderFormModal.jsx";

export default function Inventory() {
  const [cylinders, setCylinders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // cylinder object or null
  const [openForm, setOpenForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get("/cylinders");
      setCylinders(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = () => {
    setEditing(null);
    setOpenForm(true);
  };

  const handleEdit = (cylinder) => {
    setEditing(cylinder);
    setOpenForm(true);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await api.delete(`/cylinders/${confirmDelete._id}`);
      setConfirmDelete(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="p-8">
      <header className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-navy-700">Inventory</h1>
          <p className="text-sm text-ink-400">
            Manage every brand and size of cylinder you stock.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-navy-700 hover:bg-navy-800 text-white font-semibold rounded-lg text-sm transition"
        >
          <Plus size={16} /> Add cylinder type
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-ink-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy-50 text-navy-700 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-5 py-3 font-semibold">Brand</th>
              <th className="text-left px-5 py-3 font-semibold">Size</th>
              <th className="text-right px-5 py-3 font-semibold">Full</th>
              <th className="text-right px-5 py-3 font-semibold">Empty</th>
              <th className="text-right px-5 py-3 font-semibold">Threshold</th>
              <th className="text-right px-5 py-3 font-semibold">Price</th>
              <th className="text-right px-5 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-5 py-10 text-center text-ink-400">
                  Loading…
                </td>
              </tr>
            ) : cylinders.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-5 py-10 text-center text-ink-400">
                  No cylinder types yet. Click "Add cylinder type".
                </td>
              </tr>
            ) : (
              cylinders.map((c) => {
                const isLow = c.fullCount <= c.lowStockThreshold;
                return (
                  <tr key={c._id} className="hover:bg-navy-50/40">
                    <td className="px-5 py-3 font-semibold text-ink-800">
                      {c.brand}
                    </td>
                    <td className="px-5 py-3 text-ink-700">{c.size}</td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          isLow ? "text-gold-700" : "text-ink-800"
                        }`}
                      >
                        {isLow && <AlertTriangle size={13} />}
                        {c.fullCount}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-ink-700">
                      {c.emptyCount}
                    </td>
                    <td className="px-5 py-3 text-right text-ink-400">
                      {c.lowStockThreshold}
                    </td>
                    <td className="px-5 py-3 text-right text-ink-800 font-medium">
                      ₱{c.price.toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleEdit(c)}
                          className="p-2 rounded-lg text-navy-700 hover:bg-navy-50 transition"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(c)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {openForm && (
        <CylinderFormModal
          cylinder={editing}
          onClose={() => setOpenForm(false)}
          onSaved={() => {
            setOpenForm(false);
            load();
          }}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-ink-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
              <Trash2 size={20} />
            </div>
            <h3 className="text-lg font-bold text-ink-800">Delete cylinder type?</h3>
            <p className="text-sm text-ink-400 mt-1">
              This will permanently remove{" "}
              <span className="font-semibold text-ink-700">
                {confirmDelete.brand} {confirmDelete.size}
              </span>
              . Past transactions are kept.
            </p>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-ink-100 text-ink-700 font-semibold hover:bg-ink-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}