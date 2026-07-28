import { useState, useEffect } from "react";

export default function Hekimler() {
  const [hekimler, setHekimler] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/hekimler")
      .then((res) => res.json())
      .then(setHekimler)
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Hekimler</h2>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr>
              <th className="p-3">Ad Soyad</th>
              <th className="p-3">Uzmanlık</th>
            </tr>
          </thead>
          <tbody>
            {hekimler.map((h) => (
              <tr key={h.HekimID} className="border-t">
                <td className="p-3">{h.Ad} {h.Soyad}</td>
                <td className="p-3">{h.Uzmanlik}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}