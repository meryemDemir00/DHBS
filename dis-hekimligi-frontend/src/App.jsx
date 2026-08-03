import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Hastalar from "./pages/Hastalar";
import Hekimler from "./pages/Hekimler";
import Randevular from "./pages/Randevular";
import Tedaviler from "./pages/Tedaviler";
import Stok from "./pages/Stok";
import Receteler from "./pages/Receteler";
import HastaGecmis from "./pages/HastaGecmis";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 bg-gray-50 min-h-screen p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/hastalar" element={<Hastalar />} />
            <Route path="/hekimler" element={<Hekimler />} />
            <Route path="/randevular" element={<Randevular />} />
            <Route path="/tedaviler" element={<Tedaviler />} />
            <Route path="/stok" element={<Stok />} />
            <Route path="/receteler" element={<Receteler />} />
            <Route path="/hastalar/:id/gecmis" element={<HastaGecmis />} /><Route path="/hastalar/:id/gecmis" element={<HastaGecmis />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}