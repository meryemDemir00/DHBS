import { useState, useEffect } from "react";

export default function RandevuTablosu() {
  const [randevular, setRandevular] = useState([]);

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

  return (
    <div className="bg-white rounded-xl shadow mt-6 overflow-hidden">
      <h3 className="text-lg font-semibold p-4 border-b">Son Randevular</h3>
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
          {randevular.map((r) => (
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