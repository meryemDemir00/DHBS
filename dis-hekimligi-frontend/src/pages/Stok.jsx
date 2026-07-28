import { useState, useEffect } from "react";

export default function Stok() {
  const [malzemeler, setMalzemeler] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/malzemeler")
      .then((res) => res.json())
      .then(setMalzemeler)
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Stok</h2>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr>
              <th className="p-3">Malzeme Adı</th>
              <th className="p-3">Miktar</th>
              <th className="p-3">Kritik Seviye</th>
            </tr>
          </thead>
          <tbody>
            {malzemeler.map((m) => (
              <tr key={m.MalzemeID} className="border-t">
                <td className="p-3">{m.MalzemeAdi}</td>
                <td className="p-3">{m.Miktar}</td>
                <td className="p-3">
                  {m.Miktar <= m.KritikSeviye ? (
                    <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">Kritik</span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">Yeterli</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}