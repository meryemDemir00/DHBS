import { useState, useEffect } from "react";
import Card from "../components/Card";
import RandevuTablosu from "../components/RandevuTablosu";

export default function Dashboard() {
  const [istatistik, setIstatistik] = useState({
    bugunkuRandevu: 0,
    aktifTedavi: 0,
    kritikStok: 0,
    toplamHasta: 0,
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/istatistikler")
      .then((res) => res.json())
      .then(setIstatistik)
      .catch((err) => console.error("İstatistikler alınamadı:", err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Genel Bakış</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Bugünkü Randevu" value={istatistik.bugunkuRandevu} color="border-cyan-500" />
<Card title="Aktif Tedavi" value={istatistik.aktifTedavi} color="border-teal-500" />
<Card title="Kritik Stok" value={istatistik.kritikStok} color="border-red-500" />
<Card title="Toplam Hasta" value={istatistik.toplamHasta} color="border-sky-500" />
      </div>
      <RandevuTablosu />
    </div>
  );
}