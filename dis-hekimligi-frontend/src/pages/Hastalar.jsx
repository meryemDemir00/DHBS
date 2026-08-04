import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function yasHesapla(dogumTarihi) {
  const dogum = new Date(dogumTarihi);
  const bugun = new Date();
  let yil = bugun.getFullYear() - dogum.getFullYear();
  let ay = bugun.getMonth() - dogum.getMonth();
  let gun = bugun.getDate() - dogum.getDate();
  if (gun < 0) {
    ay -= 1;
    const oncekiAy = new Date(bugun.getFullYear(), bugun.getMonth(), 0);
    gun += oncekiAy.getDate();
  }
  if (ay < 0) {
    yil -= 1;
    ay += 12;
  }
  return `${yil}Y ${ay}A ${gun}G`;
}

function tarihFormatla(tarih) {
  const d = new Date(tarih);
  const gun = String(d.getDate()).padStart(2, "0");
  const ay = String(d.getMonth() + 1).padStart(2, "0");
  const yil = d.getFullYear();
  return `${gun}.${ay}.${yil}`;
}

export default function Hastalar() {
  const [hastalar, setHastalar] = useState([]);
  const [form, setForm] = useState({ Ad: "", Soyad: "", Telefon: "", DogumTarihi: "" });
  const [mesaj, setMesaj] = useState("");
  const [arama, setArama] = useState("");
  const [duzenlenenId, setDuzenlenenId] = useState(null);

  const hastalariGetir = () => {
    fetch("http://localhost:5000/api/hastalar")
      .then((res) => res.json())
      .then(setHastalar)
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    hastalariGetir();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const formuTemizle = () => {
    setForm({ Ad: "", Soyad: "", Telefon: "", DogumTarihi: "" });
    setDuzenlenenId(null);
  };

  const handleDuzenle = (h) => {
    setDuzenlenenId(h.HastaID);
    setForm({
      Ad: h.Ad,
      Soyad: h.Soyad,
      Telefon: h.Telefon || "",
      DogumTarihi: h.DogumTarihi ? h.DogumTarihi.split("T")[0] : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = duzenlenenId
        ? `http://localhost:5000/api/hastalar/${duzenlenenId}`
        : "http://localhost:5000/api/hastalar";
      const method = duzenlenenId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMesaj(duzenlenenId ? "Hasta güncellendi." : "Hasta başarıyla eklendi.");
        formuTemizle();
        hastalariGetir();
      } else {
        setMesaj("Bir hata oluştu.");
      }
    } catch (err) {
      setMesaj("Bağlantı hatası: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu hastayı silmek istediğinizden emin misiniz?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/hastalar/${id}`, { method: "DELETE" });
      if (res.ok) {
        hastalariGetir();
      } else {
        alert(await res.text());
      }
    } catch (err) {
      alert("Bağlantı hatası: " + err.message);
    }
  };

  const filtrelenmisHastalar = hastalar.filter((h) => {
    const aramaKucuk = arama.toLowerCase();
    return (
      h.Ad.toLowerCase().includes(aramaKucuk) ||
      h.Soyad.toLowerCase().includes(aramaKucuk) ||
      (h.Telefon || "").includes(arama)
    );
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Hastalar</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-5 mb-6 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
        <div>
          <label className="text-sm text-gray-500">Ad</label>
          <input type="text" name="Ad" value={form.Ad} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="text-sm text-gray-500">Soyad</label>
          <input type="text" name="Soyad" value={form.Soyad} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="text-sm text-gray-500">Telefon</label>
          <input type="text" name="Telefon" value={form.Telefon} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="text-sm text-gray-500">Doğum Tarihi</label>
          <input type="date" name="DogumTarihi" value={form.DogumTarihi} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1" />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-teal-700 text-white rounded-lg px-4 py-2 hover:bg-teal-800 transition">
            {duzenlenenId ? "Güncelle" : "Ekle"}
          </button>
          {duzenlenenId && (
            <button type="button" onClick={formuTemizle} className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300 transition">
              İptal
            </button>
          )}
        </div>
      </form>

      {mesaj && <p className="text-sm text-green-600 mb-4">{mesaj}</p>}

      <input
        type="text"
        placeholder="Ad, Soyad veya Telefon ile ara..."
        value={arama}
        onChange={(e) => setArama(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 mb-4"
      />

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr>
              <th className="p-3">Ad Soyad</th>
              <th className="p-3">Telefon</th>
              <th className="p-3">Doğum Tarihi</th>
              <th className="p-3">Yaş</th>
              <th className="p-3"></th>
              <th className="p-3"></th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtrelenmisHastalar.map((h) => (
              <tr key={h.HastaID} className="border-t">
                <td className="p-3">{h.Ad} {h.Soyad}</td>
                <td className="p-3">
                  {h.Telefon ? h.Telefon.slice(0, 4) + "****" + h.Telefon.slice(-2) : "-"}
                </td>
                <td className="p-3">{tarihFormatla(h.DogumTarihi)}</td>
                <td className="p-3 text-teal-700 text-sm">{yasHesapla(h.DogumTarihi)}</td>
                <td className="p-3">
                  <Link to={`/hastalar/${h.HastaID}/gecmis`} className="text-teal-700 text-sm hover:underline">
                    Geçmiş →
                  </Link>
                </td>
                <td className="p-3">
                  <button onClick={() => handleDuzenle(h)} className="text-blue-600 text-sm hover:underline">
                    Düzenle
                  </button>
                </td>
                <td className="p-3">
                  <button onClick={() => handleDelete(h.HastaID)} className="text-red-600 text-sm hover:underline">
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