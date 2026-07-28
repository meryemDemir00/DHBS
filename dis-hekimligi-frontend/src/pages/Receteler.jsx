import { useState, useEffect } from "react";

export default function Receteler() {
  const [receteler, setReceteler] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/receteler")
      .then((res) => res.json())
      .then(setReceteler)
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Reçeteler</h2>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr>
              <th className="p-3">Hasta</th>
              <th className="p-3">İlaç Adı</th>
              <th className="p-3">Doz</th>
              <th className="p-3">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {receteler.map((r) => (
              <tr key={r.ReceteID} className="border-t">
                <td className="p-3">{r.Hasta}</td>
                <td className="p-3">{r.IlacAdi}</td>
                <td className="p-3">{r.Doz}</td>
                <td className="p-3">{new Date(r.Tarih).toLocaleDateString("tr-TR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}