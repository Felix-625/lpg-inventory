import { ArrowDownToLine, ArrowUpFromLine, Clock } from "lucide-react";

const formatDate = (iso) =>
  new Date(iso).toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function TransactionsFeed({ transactions }) {
  return (
    <div className="bg-white rounded-2xl border border-ink-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-navy-50 text-navy-700 flex items-center justify-center">
          <Clock size={18} />
        </div>
        <div>
          <h3 className="font-bold text-ink-800">Recent Activity</h3>
          <p className="text-xs text-ink-400">Last {transactions.length} transactions</p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <p className="text-sm text-ink-400 py-6 text-center">No transactions yet.</p>
      ) : (
        <ul className="divide-y divide-ink-100">
          {transactions.map((tx) => {
            const isSale = tx.type === "sale";
            return (
              <li key={tx._id} className="py-3 flex items-start gap-3">
                <div
                  className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isSale
                      ? "bg-gold-50 text-gold-700"
                      : "bg-navy-50 text-navy-700"
                  }`}
                >
                  {isSale ? <ArrowUpFromLine size={15} /> : <ArrowDownToLine size={15} />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-800">
                    {isSale ? "Sale" : "Delivery"} • {tx.quantity} × {tx.brand} {tx.cylinderSize}
                  </p>
                  <p className="text-xs text-ink-400 truncate">
                    {isSale ? tx.customer || "Walk-in customer" : tx.supplier || "Supplier"}{" "}
                    · {tx.emptyReturned} empties exchanged
                  </p>
                </div>

                <div className="text-right shrink-0">
                  {isSale && tx.totalAmount > 0 && (
                    <p className="text-sm font-bold text-gold-700">
                      ₱{tx.totalAmount.toLocaleString()}
                    </p>
                  )}
                  <p className="text-[11px] text-ink-400">{formatDate(tx.createdAt)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}