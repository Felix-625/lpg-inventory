import { useEffect, useState, useCallback } from "react";
import api from "../api/client";
import DeliveryForm from "../components/DeliveryForm.jsx";

export default function Delivery() {
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
        <h1 className="text-2xl font-bold text-navy-700">Log Delivery</h1>
        <p className="text-sm text-ink-400">
          Record stock received from a supplier. Full counts increase and any empties
          you hand back are subtracted.
        </p>
      </header>

      <DeliveryForm cylinders={cylinders} onSaved={load} />
    </div>
  );
}