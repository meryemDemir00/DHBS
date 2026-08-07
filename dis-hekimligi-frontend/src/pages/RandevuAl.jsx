import { useState, useEffect } from "react";

const SAAT_DILIMLERI = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
];

function bugununTarihi() {
  const d = new Date();
  const yil = d.getFullYear();
  const ay = String(d.getMonth() + 1).padStart(2, "0");
  const gun = String(d.getDate()).padStart(2, "0");
  return `${yil}-${ay}-${gun}`;
}

export default function RandevuAl() {
  const [hekimler, setHekimler] = useState([]);
  const [form, setForm] = useState({ AdSoyad: "", Telefon: "", HekimID: "", Tarih: "", Saat: "" });
  const [mesaj, setMesaj] = useState("");
  const [basariliMi, setBasariliMi] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/hekimler").then(r => r.json()).then(setHekimler);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMesaj("");

    const parcalar = form.AdSoyad.trim().split(" ");
    const ad = parcalar[0];
    const soyad = parcalar.slice(1).join(" ") || "-";
    const tamTarih = `${form.Tarih}T${form.Saat}:00`;

    try {
      await fetch("http://localhost:5000/api/hastalar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Ad: ad, Soyad: soyad, Telefon: form.Telefon, DogumTarihi: null }),
      });

      const hastalarRes = await fetch("http://localhost:5000/api/hastalar");
      const hastalar = await hastalarRes.json();
      const eslesenler = hastalar.filter(h => h.Ad === ad && h.Soyad === soyad);
      const yeniHasta = eslesenler[eslesenler.length - 1];

      if (!yeniHasta) {
        setMesaj("Hasta kaydı oluşturulamadı, lütfen tekrar deneyin.");
        return;
      }

      const randevuRes = await fetch("http://localhost:5000/api/randevular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ HastaID: yeniHasta.HastaID, HekimID: form.HekimID, Tarih: tamTarih }),
      });

      if (randevuRes.ok) {
        setBasariliMi(true);
        setMesaj("Randevu talebiniz alındı! Klinik en kısa sürede sizinle iletişime geçecektir.");
      } else {
        const hataMetni = await randevuRes.text();
        setMesaj(hataMetni || "Randevu oluşturulurken bir hata oluştu.");
      }
    } catch (err) {
      setMesaj("Bağlantı hatası: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-teal-800 mb-1">Diş Kliniği</h1>
        <p className="text-gray-500 text-sm mb-1">Online Randevu Talebi</p>
        <p className="text-gray-400 text-xs mb-6">Randevu saatleri: 09:00 - 15:00 (30 dakikalık dilimler)</p>

        {basariliMi ? (
          <div className="text-center py-6">
            <p className="text-teal-700 font-medium">{mesaj}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Ad Soyad</label>
              <input
                type="text"
                value={form.AdSoyad}
                onChange={(e) => setForm({ ...form, AdSoyad: e.target.value })}
                required
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Telefon</label>
              <input
                type="text"
                value={form.Telefon}
                onChange={(e) => setForm({ ...form, Telefon: e.target.value })}
                required
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Hekim</label>
              <select
                value={form.HekimID}
                onChange={(e) => setForm({ ...form, HekimID: e.target.value })}
                required
                className="w-full border rounded-lg px-3 py-2 mt-1"
              >
                <option value="">Seçiniz</option>
                {hekimler.map((h) => (
                  <option key={h.HekimID} value={h.HekimID}>{h.Ad} {h.Soyad} — {h.Uzmanlik}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-500">Tarih</label>
                <input
                  type="date"
                  min={bugununTarihi()}
                  value={form.Tarih}
                  onChange={(e) => setForm({ ...form, Tarih: e.target.value })}
                  required
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Saat</label>
                <select
                  value={form.Saat}
                  onChange={(e) => setForm({ ...form, Saat: e.target.value })}
                  required
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                >
                  <option value="">Seçiniz</option>
                  {SAAT_DILIMLERI.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {mesaj && !basariliMi && <p className="text-red-600 text-sm">{mesaj}</p>}

            <button type="submit" className="w-full bg-teal-700 text-white rounded-lg px-4 py-2 hover:bg-teal-800 transition">
              Randevu Talep Et
            </button>
          </form>
        )}
      </div>
    </div>
  );
}