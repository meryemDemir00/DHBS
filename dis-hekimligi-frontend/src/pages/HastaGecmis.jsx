import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function HastaGecmis() {
  const { id } = useParams();
  const [gecmis, setGecmis] = useState([]);
  const [hasta, setHasta] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/hastalar/${id}/gecmis`)
      .then((res) => res.json())
      .then(setGecmis)
      .catch((err) => console.error(err));

    fetch("http://localhost:5000/api/hastalar")
      .then((res) => res.json())
      .then((data) => {
        const bulunan = data.find((h) => h.HastaID === Number(id));
        setHasta(bulunan);
      });
  }, [id]);

  return (
    <div>
      <Link to="/hastalar" className="text-teal-700 text-sm hover:underline">
        ← Hastalar listesine dön
      </Link>

      <h2 className="text-2xl font-semibold mt-3 mb-6">
        {hasta ? `${hasta.Ad} ${hasta.Soyad} — Muayene Geçmişi` : "Muayene Geçmişi"}
      </h2>

      {gecmis.length === 0 ? (
        <p className="text-gray-500">Bu hastaya ait kayıtlı muayene bulunmuyor.</p>
      ) : (
        <div className="space-y-4">
          {gecmis.map((g) => (
            <div key={g.TedaviID} className="bg-white rounded-xl shadow p-5">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-teal-800">
                  {new Date(g.Tarih).toLocaleString("tr-TR")} — Dr. {g.Hekim}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {g.Durum}
                </span>
              </div>
              {g.Yakinma && (
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Yakınma:</span> {g.Yakinma}
                </p>
              )}
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Diş No:</span> {g.DisNumarasi}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Tedavi:</span> {g.TedaviTuru}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}