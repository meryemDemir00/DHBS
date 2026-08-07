import { useState, useEffect } from "react";

export default function RandevuTablosu() {
  const [randevular, setRandevular] = useState([]);
  const [filtre, setFiltre] = useState("Hepsi");

  const getir = () => {
    fetch("http://localhost:5000/api/randevular")
      .then((res) => res.json())
      .then((data) => setRandevular(data))
      .catch((err) => console.error("Randevular alınamadı:", err));
  };

  useEffect(() => {
    getir();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bu randevuyu silmek istediğinizden emin misiniz?")) return;
    const res = await fetch(`http://localhost:5000/api/randevular/${id}`, { method: "DELETE" });
    if (res.ok) {
      getir();
    } else {
      alert(await res.text());
    }
  };

  const durumGuncelle = async (randevu, yeniDurum) => {
    if (!randevu.HastaID || !randevu.HekimID) {
      alert("Randevu bilgisi eksik (HastaID/HekimID gelmiyor). Backend'in güncel olduğundan emin olun.");
      return;
    }
    const res = await fetch(`http://localhost:5000/api/randevular/${randevu.RandevuID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        HastaID: randevu.HastaID,
        HekimID: randevu.HekimID,
        Tarih: randevu.Tarih,
        Durum: yeniDurum,
      }),
    });
    if (res.ok) {
      getir();
      setFiltre(yeniDurum);
    } else {
      alert(await res.text());
    }
  };

  const durumRengi = {
    Bekliyor: "bg-yellow-100 text-yellow-700",
    Onaylandi: "bg-blue-100 text-blue-700",
    Tamamlandi: "bg-green-100 text-green-700",
    Reddedildi: "bg-red-100 text-red-700",
    IptalEdildi: "bg-red-100 text-red-700",
  };

  const sekmeler = [
    { ad: "Hepsi", durum: null },
    { ad: "Bekliyor", durum: "Bekliyor" },
    { ad: "Onaylandı", durum: "Onaylandi" },
    { ad: "Tamamlandı", durum: "Tamamlandi" },
    { ad: "Reddedildi", durum: "Reddedildi" },
  ];

  const sayac = (durum) => {
    if (!durum) return randevular.length;
    return randevular.filter((r) => r.Durum === durum).length;
  };

  const filtrelenmis =
    filtre === "Hepsi" ? randevular : randevular.filter((r) => r.Durum === filtre);

  const sekmeSinifi = (secili) => {
    if (secili) {
      return "px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition bg-teal-700 text-white";
    }
    return "px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition bg-gray-100 text-gray-600 hover:bg-gray-200";
  };

  const rozetSinifi = (secili) => {
    if (secili) {
      return "text-xs rounded-full px-1.5 bg-teal-900";
    }
    return "text-xs rounded-full px-1.5 bg-gray-300";
  };

  return (
    <div className="bg-white rounded-xl shadow mt-6 overflow-hidden">
      <div className="p-4 border-b flex flex-wrap gap-2">
        {sekmeler.map((s) => {
          const secili = (s.durum || "Hepsi") === filtre;
          return (
            <button key={s.ad} type="button" onClick={() => setFiltre(s.durum || "Hepsi")} className={sekmeSinifi(secili)}>
              {s.ad}
              <span className={rozetSinifi(secili)}>{sayac(s.durum)}</span>
            </button>
          );
        })}
      </div>

      <table className="w-full text-left">
        <thead className="bg-gray-50 text-gray-500 text-sm">
          <tr>
            <th className="p-3">Hasta</th>
            <th className="p-3">Hekim</th>
            <th className="p-3">Tarih</th>
            <th className="p-3">Durum</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {filtrelenmis.map((r) => (
            <tr key={r.RandevuID} className="border-t">
              <td className="p-3">{r.Hasta}</td>
              <td className="p-3">{r.Hekim}</td>
              <td className="p-3">{new Date(r.Tarih).toLocaleString("tr-TR")}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs ${durumRengi[r.Durum] || ""}`}>
                  {r.Durum}
                </span>
              </td>
              <td className="p-3">
                <div className="flex gap-3 items-center flex-wrap">
                  {r.Durum === "Bekliyor" && (
                    <>
                      <button onClick={() => durumGuncelle(r, "Onaylandi")} className="text-blue-600 text-sm hover:underline">
                        Onayla
                      </button>
                      <button onClick={() => durumGuncelle(r, "Reddedildi")} className="text-orange-600 text-sm hover:underline">
                        Reddet
                      </button>
                    </>
                  )}
                  <button onClick={() => handleDelete(r.RandevuID)} className="text-red-600 text-sm hover:underline">
                    Sil
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}