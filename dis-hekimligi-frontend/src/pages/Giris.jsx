import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Giris({ girisYapildi }) {
  const [form, setForm] = useState({ KullaniciAdi: "", Sifre: "" });
  const [hata, setHata] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHata("");
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const veri = await res.json();
      if (res.ok && veri.basarili) {
        localStorage.setItem("kullanici", JSON.stringify(veri.kullanici));
        girisYapildi();
        navigate("/");
      } else {
        setHata(veri.mesaj || "Giriş başarısız.");
      }
    } catch (err) {
      setHata("Bağlantı hatası: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-teal-800 mb-1">Diş Kliniği</h1>
        <p className="text-gray-500 text-sm mb-6">Yönetim Sistemine Giriş</p>

        <div className="mb-4">
          <label className="text-sm text-gray-500">Kullanıcı Adı</label>
          <input
            type="text"
            value={form.KullaniciAdi}
            onChange={(e) => setForm({ ...form, KullaniciAdi: e.target.value })}
            required
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="text-sm text-gray-500">Şifre</label>
          <input
            type="password"
            value={form.Sifre}
            onChange={(e) => setForm({ ...form, Sifre: e.target.value })}
            required
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        {hata && <p className="text-red-600 text-sm mb-4">{hata}</p>}

        <button type="submit" className="w-full bg-teal-700 text-white rounded-lg px-4 py-2 hover:bg-teal-800 transition">
          Giriş Yap
        </button>
      </form>
    </div>
  );
}