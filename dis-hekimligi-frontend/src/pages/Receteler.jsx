import { useState, useEffect } from "react";

export default function Receteler() {
  const [receteler, setReceteler] = useState([]);
  const [hastalar, setHastalar] = useState([]);
  const [hekimler, setHekimler] = useState([]);
  const [form, setForm] = useState({ HastaID: "", HekimID: "", IlacAdi: "", Doz: "" });
  const [duzenlenenId, setDuzenlenenId] = useState(null);

  const getir = () => {
    fetch("http://localhost:5000/api/receteler").then(r => r.json()).then(setReceteler);
  };

  useEffect(() => {
    getir();
    fetch("http://localhost:5000/api/hastalar").then(r => r.json()).then(setHastalar);
    fetch("http://localhost:5000/api/hekimler").then(r => r.json()).then(setHekimler);
  }, []);

  const formuTemizle = () => {
    setForm({ HastaID: "", HekimID: "", IlacAdi: "", Doz: "" });
    setDuzenlenenId(null);
  };

  const handleDuzenle = (r) => {
    setDuzenlenenId(r.ReceteID);
    setForm({
      HastaID: hastalar.find(h => `${h.Ad} ${h.Soyad}` === r.Hasta)?.HastaID || "",
      HekimID: "",
      IlacAdi: r.IlacAdi,
      Doz: r.Doz || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = duzenlenenId
      ? `http://localhost:5000/api/receteler/${duzenlenenId}`
      : "http://localhost:5000/api/receteler";
    const method = duzenlenenId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    formuTemizle();
    getir();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu reçeteyi silmek istediğinizden emin misiniz?")) return;
    const res = await fetch(`http://localhost:5000/api/receteler/${id}`, { method: "DELETE" });
    if (res.ok) {
      getir();
    } else {
      alert(await res.text());
    }
  };

  const seciliHasta = hastalar.find(h => h.HastaID === Number(form.HastaID));

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Reçeteler</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div>
            <label className="text-sm text-gray-500">Hasta</label>
            <select value={form.HastaID} onChange={e => setForm({...form, HastaID: e.target.value})} required className="w-full border rounded-lg px-3 py-2 mt-1">
              <option value="">Seçiniz</option>
              {hastalar.map(h => <option key={h.HastaID} value={h.HastaID}>{h.Ad} {h.Soyad}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-500">Hekim</label>
            <select value={form.HekimID} onChange={e => setForm({...form, HekimID: e.target.value})} required className="w-full border rounded-lg px-3 py-2 mt-1">
              <option value="">Seçiniz</option>
              {hekimler.map(h => <option key={h.HekimID} value={h.HekimID}>{h.Ad} {h.Soyad}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-500">İlaç Adı</label>
            <input value={form.IlacAdi} onChange={e => setForm({...form, IlacAdi: e.target.value})} required className="w-full border rounded-lg px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="text-sm text-gray-500">Doz</label>
            <input value={form.Doz} onChange={e => setForm({...form, Doz: e.target.value})} className="w-full border rounded-lg px-3 py-2 mt-1" />
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
        </div>

        {seciliHasta && seciliHasta.KronikRahatsizlik && (
          <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-800">
            ⚠️ Dikkat: {seciliHasta.Ad} {seciliHasta.Soyad} hastasının kronik rahatsızlığı var — <b>{seciliHasta.KronikRahatsizlik}</b>. İlaç etkileşimlerini kontrol edin.
          </div>
        )}
        {seciliHasta && (seciliHasta.Boy || seciliHasta.Kilo) && (
          <div className="mt-2 text-xs text-gray-500">
            Boy: {seciliHasta.Boy || "-"} cm, Kilo: {seciliHasta.Kilo || "-"} kg
          </div>
        )}
      </form>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr><th className="p-3">Hasta</th><th className="p-3">İlaç Adı</th><th className="p-3">Doz</th><th className="p-3">Tarih</th><th className="p-3"></th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {receteler.map(r => (
              <tr key={r.ReceteID} className="border-t">
                <td className="p-3">{r.Hasta}</td>
                <td className="p-3">{r.IlacAdi}</td>
                <td className="p-3">{r.Doz}</td>
                <td className="p-3">{new Date(r.Tarih).toLocaleDateString("tr-TR")}</td>
                <td className="p-3">
                  <button onClick={() => handleDuzenle(r)} className="text-blue-600 text-sm hover:underline">
                    Düzenle
                  </button>
                </td>
                <td className="p-3">
                  <button onClick={() => handleDelete(r.ReceteID)} className="text-red-600 text-sm hover:underline">
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