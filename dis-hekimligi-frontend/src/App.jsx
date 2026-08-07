import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Hastalar from "./pages/Hastalar";
import HastaGecmis from "./pages/HastaGecmis";
import Hekimler from "./pages/Hekimler";
import Randevular from "./pages/Randevular";
import Tedaviler from "./pages/Tedaviler";
import Stok from "./pages/Stok";
import Receteler from "./pages/Receteler";
import Giris from "./pages/Giris";
import RandevuAl from "./pages/RandevuAl";

function AdminPanel({ cikisYap }) {
  return (
    <div className="flex">
      <Sidebar cikisYap={cikisYap} />
      <main className="flex-1 bg-gray-50 min-h-screen p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/hastalar" element={<Hastalar />} />
          <Route path="/hastalar/:id/gecmis" element={<HastaGecmis />} />
          <Route path="/hekimler" element={<Hekimler />} />
          <Route path="/randevular" element={<Randevular />} />
          <Route path="/tedaviler" element={<Tedaviler />} />
          <Route path="/stok" element={<Stok />} />
          <Route path="/receteler" element={<Receteler />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const [girisYapildiMi, setGirisYapildiMi] = useState(!!localStorage.getItem("kullanici"));

  const girisYapildi = () => setGirisYapildiMi(true);

  const cikisYap = () => {
    localStorage.removeItem("kullanici");
    setGirisYapildiMi(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/randevu-al" element={<RandevuAl />} />
        <Route
          path="/*"
          element={
            girisYapildiMi
              ? <AdminPanel cikisYap={cikisYap} />
              : <Giris girisYapildi={girisYapildi} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}