import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function HastaGecmis() {
  const { id } = useParams();
  const [gecmis, setGecmis] = useState([]);
  const [hasta, setHasta] = useState(null);
  const [hekimler, setHekimler] = useState([]);

  const gecmisiGetir = () => {
    fetch(`http://localhost:5000/api/hastalar/${id}/gecmis`)
      .then((res) => res.json())
      .then(setGecmis)
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    gecmisiGetir();

    fetch("http://localhost:5000/api/hastalar")
      .then((res) => res.json())
      .then((data) => setHasta(data.find((h) => h.HastaID === Number(id))));

    fetch("http://localhost:5000/api/hekimler")
      .then((res) => res.json())
      .then(setHekimler);
  }, [id]);

  const handleTamamlandiIsaretle = async (kayit) => {
    const hekim = hekimler.find((h) => `${h.Ad} ${h.Soyad}` === kayit.Hekim);
    if (!hekim) {
      alert("Hekim bilgisi bulunamadı, güncelleme yapılamadı.");
      return;
    }
    const res = await fetch(`http://localhost:5000/api/tedaviler/${kayit.TedaviID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        HastaID: Number(id),
        HekimID: hekim.HekimID,
        DisNumarasi: kayit.DisNumarasi,
        TedaviTuru: kayit.TedaviTuru,
        Durum: "Tamamlandi",
      }),
    });
    if (res.ok) {
      gecmisiGetir();
    } else {
      alert(await res.text());
    }
  };

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
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Tedavi:</span> {g.TedaviTuru}
              </p>
              {g.Durum === "DevamEdiyor" && (
                <button onClick={() => handleTamamlandiIsaretle(g)} className="text-sm text-teal-700 hover:underline">
                  ✓ Tamamlandı olarak işaretle
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}