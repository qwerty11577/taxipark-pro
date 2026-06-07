import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Drivers from "./pages/Drivers";
import Cars from "./pages/Cars";
import Orders from "./pages/Orders";
import Finance from "./pages/Finance";
import Settings from "./pages/Settings";
import Register from "./pages/Register";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/drivers" element={<Drivers />} />
      <Route path="/cars" element={<Cars />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/finance" element={<Finance />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}