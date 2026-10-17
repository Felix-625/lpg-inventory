import { useEffect, useState, useCallback } from "react";
import api from "../api/client";
import SaleForm from "../components/SaleForm.jsx";

export default function Sale() {
  const [cylinders, setCylinders] = useState([]);

  const load = useCallback(async () => {
    const { data } = await api.get("/cylinders");
    setCylinders(data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="p-8 max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-navy-700">New Sale / Swap</h1>
        <p className="text-sm text-ink-400">
          Sell a full cylinder and take back an empty one. Full counts decrease and
          empties increase based on how many the customer returns.
        </p>
      </header>

      <SaleForm cylinders={cylinders} onSaved={load} />
    </div>
  );
}