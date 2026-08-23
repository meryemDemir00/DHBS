import { useState, useEffect } from "react";

function durumGoster(durum) {
  const esleme = {
    DevamEdiyor: "Devam Ediyor",
    Tamamlandi: "Tamamlandı",
  };
  return esleme[durum] || durum;
}

export default function Tedaviler() {
  const [tedaviler, setTedaviler] = useState([]);
  const [hastalar, setHastalar] = useState([]);
  const [hekimler, setHekimler] = useState([]);
  const [form, setForm] = useState({ HastaID: "", HekimID: "", DisNumarasi: "", TedaviTuru: "", Durum: "DevamEdiyor" });
  const [duzenlenenId, setDuzenlenenId] = useState(null);

  const getir = () => {
    fetch("http://localhost:5000/api/tedaviler").then(r => r.json()).then(setTedaviler);
  };

  useEffect(() => {
    getir();
    fetch("http://localhost:5000/api/hastalar").then(r => r.json()).then(setHastalar);
    fetch("http://localhost:5000/api/hekimler").then(r => r.json()).then(setHekimler);
  }, []);

  const formuTemizle = () => {
    setForm({ HastaID: "", HekimID: "", DisNumarasi: "", TedaviTuru: "", Durum: "DevamEdiyor" });
    setDuzenlenenId(null);
  };

  const handleDuzenle = (t) => {
    setDuzenlenenId(t.TedaviID);
    setForm({
      HastaID: t.HastaID,
      HekimID: hekimler.find(h => `${h.Ad} ${h.Soyad}` === t.Hekim)?.HekimID || "",
      DisNumarasi: t.DisNumarasi,
      TedaviTuru: t.TedaviTuru,
      Durum: t.Durum,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = duzenlenenId
      ? `http://localhost:5000/api/tedaviler/${duzenlenenId}`
      : "http://localhost:5000/api/tedaviler";
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
    if (!window.confirm("Bu tedaviyi silmek istediğinizden emin misiniz?")) return;
    const res = await fetch(`http://localhost:5000/api/tedaviler/${id}`, { method: "DELETE" });
    if (res.ok) {
      getir();
    } else {
      alert(await res.text());
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Tedaviler</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-5 mb-6 grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
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
          <label className="text-sm text-gray-500">Diş No</label>
          <input type="number" value={form.DisNumarasi} onChange={e => setForm({...form, DisNumarasi: e.target.value})} className="w-full border rounded-lg px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="text-sm text-gray-500">Tedavi Türü</label>
          <input value={form.TedaviTuru} onChange={e => setForm({...form, TedaviTuru: e.target.value})} className="w-full border rounded-lg px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="text-sm text-gray-500">Durum</label>
          <select value={form.Durum} onChange={e => setForm({...form, Durum: e.target.value})} className="w-full border rounded-lg px-3 py-2 mt-1">
            <option value="DevamEdiyor">Devam Ediyor</option>
            <option value="Tamamlandi">Tamamlandı</option>
          </select>
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
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr><th className="p-3">Hasta</th><th className="p-3">Diş No</th><th className="p-3">Tedavi Türü</th><th className="p-3">Durum</th><th className="p-3"></th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {tedaviler.map(t => (
              <tr key={t.TedaviID} className="border-t">
                <td className="p-3">{t.Hasta}</td>
                <td className="p-3">{t.DisNumarasi}</td>
                <td className="p-3">{t.TedaviTuru}</td>
                <td className="p-3">{durumGoster(t.Durum)}</td>
                <td className="p-3">
                  <button onClick={() => handleDuzenle(t)} className="text-blue-600 text-sm hover:underline">
                    Düzenle
                  </button>
                </td>
                <td className="p-3">
                  <button onClick={() => handleDelete(t.TedaviID)} className="text-red-600 text-sm hover:underline">
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