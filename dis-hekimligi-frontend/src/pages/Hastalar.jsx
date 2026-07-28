import { useState, useEffect } from "react";

export default function Hastalar() {
  const [hastalar, setHastalar] = useState([]);
  const [form, setForm] = useState({ Ad: "", Soyad: "", Telefon: "", DogumTarihi: "" });
  const [mesaj, setMesaj] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/hastalar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMesaj("Hasta başarıyla eklendi.");
        setForm({ Ad: "", Soyad: "", Telefon: "", DogumTarihi: "" });
        hastalariGetir();
      } else {
        setMesaj("Bir hata oluştu.");
      }
    } catch (err) {
      setMesaj("Bağlantı hatası: " + err.message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Hastalar</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-5 mb-6 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
        <div>
          <label className="text-sm text-gray-500">Ad</label>
          <input
            type="text"
            name="Ad"
            value={form.Ad}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">Soyad</label>
          <input
            type="text"
            name="Soyad"
            value={form.Soyad}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">Telefon</label>
          <input
            type="text"
            name="Telefon"
            value={form.Telefon}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">Doğum Tarihi</label>
          <input
            type="date"
            name="DogumTarihi"
            value={form.DogumTarihi}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-700 text-white rounded-lg px-4 py-2 hover:bg-blue-800 transition"
        >
          Ekle
        </button>
      </form>

      {mesaj && <p className="text-sm text-green-600 mb-4">{mesaj}</p>}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr>
              <th className="p-3">Ad Soyad</th>
              <th className="p-3">Telefon</th>
              <th className="p-3">Doğum Tarihi</th>
            </tr>
          </thead>
          <tbody>
            {hastalar.map((h) => (
              <tr key={h.HastaID} className="border-t">
                <td className="p-3">{h.Ad} {h.Soyad}</td>
                <td className="p-3">{h.Telefon}</td>
                <td className="p-3">{new Date(h.DogumTarihi).toLocaleDateString("tr-TR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}