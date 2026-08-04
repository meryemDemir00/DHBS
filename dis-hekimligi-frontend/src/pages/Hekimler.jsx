import { useState, useEffect } from "react";

export default function Hekimler() {
  const [hekimler, setHekimler] = useState([]);
  const [form, setForm] = useState({ Ad: "", Soyad: "", Uzmanlik: "" });
  const [mesaj, setMesaj] = useState("");

  const getir = () => {
    fetch("http://localhost:5000/api/hekimler").then(r => r.json()).then(setHekimler);
  };

  useEffect(() => { getir(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/hekimler", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMesaj("");
      setForm({ Ad: "", Soyad: "", Uzmanlik: "" });
      getir();
    } else {
      setMesaj(await res.text());
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu hekimi silmek istediğinizden emin misiniz?")) return;
    const res = await fetch(`http://localhost:5000/api/hekimler/${id}`, { method: "DELETE" });
    if (res.ok) {
      getir();
    } else {
      alert(await res.text());
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Hekimler</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div>
          <label className="text-sm text-gray-500">Ad</label>
          <input value={form.Ad} onChange={e => setForm({...form, Ad: e.target.value})} required className="w-full border rounded-lg px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="text-sm text-gray-500">Soyad</label>
          <input value={form.Soyad} onChange={e => setForm({...form, Soyad: e.target.value})} required className="w-full border rounded-lg px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="text-sm text-gray-500">Uzmanlık</label>
          <input value={form.Uzmanlik} onChange={e => setForm({...form, Uzmanlik: e.target.value})} className="w-full border rounded-lg px-3 py-2 mt-1" />
        </div>
        <button className="bg-teal-700 text-white rounded-lg px-4 py-2 hover:bg-teal-800">Ekle</button>
      </form>

      {mesaj && <p className="text-sm text-red-600 mb-4">{mesaj}</p>}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr><th className="p-3">Ad Soyad</th><th className="p-3">Uzmanlık</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {hekimler.map(h => (
              <tr key={h.HekimID} className="border-t">
                <td className="p-3">{h.Ad} {h.Soyad}</td>
                <td className="p-3">{h.Uzmanlik}</td>
                <td className="p-3">
                  <button onClick={() => handleDelete(h.HekimID)} className="text-red-600 text-sm hover:underline">
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