import { useState, useEffect } from "react";

export default function RandevuTablosu() {
  const [randevular, setRandevular] = useState([]);
  const [filtre, setFiltre] = useState("Hepsi");

  useEffect(() => {
    fetch("http://localhost:5000/api/randevular")
      .then((res) => res.json())
      .then((data) => setRandevular(data))
      .catch((err) => console.error("Randevular alınamadı:", err));
  }, []);

  const durumRengi = {
    Bekliyor: "bg-yellow-100 text-yellow-700",
    Tamamlandi: "bg-green-100 text-green-700",
    IptalEdildi: "bg-red-100 text-red-700",
  };

  const sekmeler = [
    { ad: "Hepsi", durum: null },
    { ad: "Bekliyor", durum: "Bekliyor" },
    { ad: "Tamamlandı", durum: "Tamamlandi" },
    { ad: "İptal", durum: "IptalEdildi" },
  ];

  const sayac = (durum) => {
    if (!durum) return randevular.length;
    return randevular.filter((r) => r.Durum === durum).length;
  };

  const filtrelenmis =
    filtre === "Hepsi" ? randevular : randevular.filter((r) => r.Durum === filtre);

  const sekmeSinifi = (secili) => {
    if (secili) {
      return "px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition bg-teal-700 text-white";
    }
    return "px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition bg-gray-100 text-gray-600 hover:bg-gray-200";
  };

  const rozetSinifi = (secili) => {
    if (secili) {
      return "text-xs rounded-full px-1.5 bg-teal-900";
    }
    return "text-xs rounded-full px-1.5 bg-gray-300";
  };

  return (
    <div className="bg-white rounded-xl shadow mt-6 overflow-hidden">
      <div className="p-4 border-b flex flex-wrap gap-2">
        {sekmeler.map((s) => {
          const secili = (s.durum || "Hepsi") === filtre;
          return (
            <button
              key={s.ad}
              onClick={() => setFiltre(s.durum || "Hepsi")}
              className={sekmeSinifi(secili)}
            >
              {s.ad}
              <span className={rozetSinifi(secili)}>{sayac(s.durum)}</span>
            </button>
          );
        })}
      </div>

      <table className="w-full text-left">
        <thead className="bg-gray-50 text-gray-500 text-sm">
          <tr>
            <th className="p-3">Hasta</th>
            <th className="p-3">Hekim</th>
            <th className="p-3">Tarih</th>
            <th className="p-3">Durum</th>
          </tr>
        </thead>
        <tbody>
          {filtrelenmis.map((r) => (
            <tr key={r.RandevuID} className="border-t">
              <td className="p-3">{r.Hasta}</td>
              <td className="p-3">{r.Hekim}</td>
              <td className="p-3">{new Date(r.Tarih).toLocaleString("tr-TR")}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs ${durumRengi[r.Durum] || ""}`}>
                  {r.Durum}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}