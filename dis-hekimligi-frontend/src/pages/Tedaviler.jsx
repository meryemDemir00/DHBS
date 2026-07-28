import { useState, useEffect } from "react";

export default function Tedaviler() {
  const [tedaviler, setTedaviler] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/tedaviler")
      .then((res) => res.json())
      .then(setTedaviler)
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Tedaviler</h2>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr>
              <th className="p-3">Hasta</th>
              <th className="p-3">Diş No</th>
              <th className="p-3">Tedavi Türü</th>
              <th className="p-3">Durum</th>
            </tr>
          </thead>
          <tbody>
            {tedaviler.map((t) => (
              <tr key={t.TedaviID} className="border-t">
                <td className="p-3">{t.Hasta}</td>
                <td className="p-3">{t.DisNumarasi}</td>
                <td className="p-3">{t.TedaviTuru}</td>
                <td className="p-3">{t.Durum}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}