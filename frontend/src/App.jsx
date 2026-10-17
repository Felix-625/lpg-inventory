import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Delivery from "./pages/Delivery.jsx";
import Sale from "./pages/Sale.jsx";
import Inventory from "./pages/Inventory.jsx";
import Layout from "./components/Layout.jsx";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="delivery" element={<Delivery />} />
        <Route path="sale" element={<Sale />} />
        <Route path="inventory" element={<Inventory />} />
      </Route>
    </Routes>
  );
}