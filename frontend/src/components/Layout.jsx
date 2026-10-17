import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Flame,
  LayoutDashboard,
  Truck,
  ShoppingCart,
  Boxes,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/delivery", label: "Log Delivery", icon: Truck },
  { to: "/sale", label: "New Sale / Swap", icon: ShoppingCart },
  { to: "/inventory", label: "Inventory", icon: Boxes },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-navy-50">
      <aside className="w-64 bg-navy-700 flex flex-col text-white">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-lg bg-gold-500 flex items-center justify-center text-navy-700">
            <Flame size={22} />
          </div>
          <div>
            <p className="font-bold leading-tight">LPG Manager</p>
            <p className="text-xs text-white/60">Inventory System</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-gold-500" />
                  )}
                  <Icon size={18} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="mb-3">
            <p className="text-sm font-semibold text-white">{user?.name}</p>
            <p className="text-xs text-white/60 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}