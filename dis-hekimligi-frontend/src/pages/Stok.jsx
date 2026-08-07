import { useState, useEffect } from "react";

export default function Stok() {
  const [malzemeler, setMalzemeler] = useState([]);
  const [form, setForm] = useState({ MalzemeAdi: "", Miktar: "", KritikSeviye: "" });
  const [mesaj, setMesaj] = useState("");
  const [duzenlenenId, setDuzenlenenId] = useState(null);

  const getir = () => {
    fetch("http://localhost:5000/api/malzemeler").then(r => r.json()).then(setMalzemeler);
  };

  useEffect(() => { getir(); }, []);

  const formuTemizle = () => {
    setForm({ MalzemeAdi: "", Miktar: "", KritikSeviye: "" });
    setDuzenlenenId(null);
  };

  const handleDuzenle = (m) => {
    setDuzenlenenId(m.MalzemeID);
    setForm({ MalzemeAdi: m.MalzemeAdi, Miktar: m.Miktar, KritikSeviye: m.KritikSeviye });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = duzenlenenId
      ? `http://localhost:5000/api/malzemeler/${duzenlenenId}`
      : "http://localhost:5000/api/malzemeler";
    const method = duzenlenenId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMesaj("");
      formuTemizle();
      getir();
    } else {
      setMesaj(await res.text());
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu malzemeyi silmek istediğinizden emin misiniz?")) return;
    const res = await fetch(`http://localhost:5000/api/malzemeler/${id}`, { method: "DELETE" });
    if (res.ok) {
      getir();
    } else {
      alert(await res.text());
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Stok</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div>
          <label className="text-sm text-gray-500">Malzeme Adı</label>
          <input value={form.MalzemeAdi} onChange={e => setForm({...form, MalzemeAdi: e.target.value})} required className="w-full border rounded-lg px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="text-sm text-gray-500">Miktar</label>
          <input type="number" value={form.Miktar} onChange={e => setForm({...form, Miktar: e.target.value})} required className="w-full border rounded-lg px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="text-sm text-gray-500">Kritik Seviye</label>
          <input type="number" value={form.KritikSeviye} onChange={e => setForm({...form, KritikSeviye: e.target.value})} className="w-full border rounded-lg px-3 py-2 mt-1" />
        </div>
        <div className="flex gap-2">
          <button className="bg-teal-700 text-white rounded-lg px-4 py-2 hover:bg-teal-800">
            {duzenlenenId ? "Güncelle" : "Ekle"}
          </button>
          {duzenlenenId && (
            <button type="button" onClick={formuTemizle} className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300">
              İptal
            </button>
          )}
        </div>
      </form>

      {mesaj && <p className="text-sm text-red-600 mb-4">{mesaj}</p>}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr><th className="p-3">Malzeme Adı</th><th className="p-3">Miktar</th><th className="p-3">Durum</th><th className="p-3"></th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {malzemeler.map(m => (
              <tr key={m.MalzemeID} className="border-t">
                <td className="p-3">{m.MalzemeAdi}</td>
                <td className="p-3">{m.Miktar}</td>
                <td className="p-3">
                  {m.Miktar <= m.KritikSeviye
                    ? <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">Kritik</span>
                    : <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">Yeterli</span>}
                </td>
                <td className="p-3">
                  <button onClick={() => handleDuzenle(m)} className="text-blue-600 text-sm hover:underline">
                    Düzenle
                  </button>
                </td>
                <td className="p-3">
                  <button onClick={() => handleDelete(m.MalzemeID)} className="text-red-600 text-sm hover:underline">
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}