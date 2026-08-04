const express = require("express");
const cors = require("cors");
const sql = require("mssql");

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  user: "dis_hekimligi_user",
  password: "Staj2026!",
  server: "localhost",
  port: 1433,
  database: "DisHekimligiDB",
  options: {
    instanceName: "SQLEXPRESS",
    encrypt: false,
    trustServerCertificate: true,
  },
};

// ---------- HASTA ----------
app.get("/api/hastalar", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query("SELECT * FROM Hasta");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Hata: " + err.message);
  }
});

app.post("/api/hastalar", async (req, res) => {
  try {
    const { Ad, Soyad, Telefon, DogumTarihi } = req.body;
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("Ad", sql.NVarChar, Ad)
      .input("Soyad", sql.NVarChar, Soyad)
      .input("Telefon", sql.NVarChar, Telefon)
      .input("DogumTarihi", sql.Date, DogumTarihi)
      .query("INSERT INTO Hasta (Ad, Soyad, Telefon, DogumTarihi) VALUES (@Ad, @Soyad, @Telefon, @DogumTarihi)");
    res.status(201).send("Hasta eklendi");
  } catch (err) {
    res.status(500).send("Hata: " + err.message);
  }
});

app.delete("/api/hastalar/:id", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    await pool.request().input("id", sql.Int, req.params.id)
      .query("DELETE FROM Hasta WHERE HastaID = @id");
    res.send("Hasta silindi");
  } catch (err) {
    res.status(500).send("Hata: " + err.message + " (Bu hastaya bağlı kayıtlar olabilir.)");
  }
});

// ---------- HASTA GEÇMİŞİ ----------
app.get("/api/hastalar/:id/gecmis", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input("HastaID", sql.Int, req.params.id)
      .query(`
        SELECT T.TedaviID, HK.Ad + ' ' + HK.Soyad AS Hekim, T.DisNumarasi,
               T.TedaviTuru, T.Yakinma, T.Durum, T.Tarih
        FROM Tedavi T
        JOIN Hekim HK ON T.HekimID = HK.HekimID
        WHERE T.HastaID = @HastaID
        ORDER BY T.Tarih DESC
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Hata: " + err.message);
  }
});

// ---------- HEKİM ----------
app.get("/api/hekimler", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query("SELECT * FROM Hekim");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Hata: " + err.message);
  }
});

app.post("/api/hekimler", async (req, res) => {
  try {
    const { Ad, Soyad, Uzmanlik } = req.body;
    const pool = await sql.connect(dbConfig);

    const kontrol = await pool.request()
      .input("Ad", sql.NVarChar, Ad)
      .input("Soyad", sql.NVarChar, Soyad)
      .query("SELECT COUNT(*) AS adet FROM Hekim WHERE Ad = @Ad AND Soyad = @Soyad");

    if (kontrol.recordset[0].adet > 0) {
      return res.status(409).send("Bu isimde bir hekim zaten kayıtlı.");
    }

    await pool.request()
      .input("Ad", sql.NVarChar, Ad)
      .input("Soyad", sql.NVarChar, Soyad)
      .input("Uzmanlik", sql.NVarChar, Uzmanlik)
      .query("INSERT INTO Hekim (Ad, Soyad, Uzmanlik) VALUES (@Ad, @Soyad, @Uzmanlik)");
    res.status(201).send("Hekim eklendi");
  } catch (err) {
    res.status(500).send("Hata: " + err.message);
  }
});

app.delete("/api/hekimler/:id", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    await pool.request().input("id", sql.Int, req.params.id)
      .query("DELETE FROM Hekim WHERE HekimID = @id");
    res.send("Hekim silindi");
  } catch (err) {
    res.status(500).send("Hata: " + err.message + " (Bu hekime bağlı kayıtlar olabilir.)");
  }
});

// ---------- RANDEVU ----------
app.get("/api/randevular", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`
      SELECT R.RandevuID, H.Ad + ' ' + H.Soyad AS Hasta, HK.Ad + ' ' + HK.Soyad AS Hekim, R.Tarih, R.Durum
      FROM Randevu R
      JOIN Hasta H ON R.HastaID = H.HastaID
      JOIN Hekim HK ON R.HekimID = HK.HekimID
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Hata: " + err.message);
  }
});

app.post("/api/randevular", async (req, res) => {
  try {
    const { HastaID, HekimID, Tarih } = req.body;
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("HastaID", sql.Int, HastaID)
      .input("HekimID", sql.Int, HekimID)
      .input("Tarih", sql.DateTime, Tarih)
      .query("INSERT INTO Randevu (HastaID, HekimID, Tarih) VALUES (@HastaID, @HekimID, @Tarih)");
    res.status(201).send("Randevu eklendi");
  } catch (err) {
    res.status(500).send("Hata: " + err.message);
  }
});

app.delete("/api/randevular/:id", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    await pool.request().input("id", sql.Int, req.params.id)
      .query("DELETE FROM Randevu WHERE RandevuID = @id");
    res.send("Randevu silindi");
  } catch (err) {
    res.status(500).send("Hata: " + err.message);
  }
});

// ---------- TEDAVİ ----------
app.get("/api/tedaviler", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`
      SELECT T.TedaviID, T.HastaID, H.Ad + ' ' + H.Soyad AS Hasta, HK.Ad + ' ' + HK.Soyad AS Hekim,
             T.DisNumarasi, T.TedaviTuru, T.Durum, T.Yakinma, T.Tarih
      FROM Tedavi T
      JOIN Hasta H ON T.HastaID = H.HastaID
      JOIN Hekim HK ON T.HekimID = HK.HekimID
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Hata: " + err.message);
  }
});

app.post("/api/tedaviler", async (req, res) => {
  try {
    const { HastaID, HekimID, DisNumarasi, TedaviTuru } = req.body;
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("HastaID", sql.Int, HastaID)
      .input("HekimID", sql.Int, HekimID)
      .input("DisNumarasi", sql.Int, DisNumarasi)
      .input("TedaviTuru", sql.NVarChar, TedaviTuru)
      .query("INSERT INTO Tedavi (HastaID, HekimID, DisNumarasi, TedaviTuru) VALUES (@HastaID, @HekimID, @DisNumarasi, @TedaviTuru)");
    res.status(201).send("Tedavi eklendi");
  } catch (err) {
    res.status(500).send("Hata: " + err.message);
  }
});

app.delete("/api/tedaviler/:id", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    await pool.request().input("id", sql.Int, req.params.id)
      .query("DELETE FROM Tedavi_Malzeme WHERE TedaviID = @id");
    await pool.request().input("id", sql.Int, req.params.id)
      .query("DELETE FROM Tedavi WHERE TedaviID = @id");
    res.send("Tedavi silindi");
  } catch (err) {
    res.status(500).send("Hata: " + err.message);
  }
});

// ---------- MALZEME ----------
app.get("/api/malzemeler", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query("SELECT * FROM Malzeme");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Hata: " + err.message);
  }
});

app.post("/api/malzemeler", async (req, res) => {
  try {
    const { MalzemeAdi, Miktar, KritikSeviye } = req.body;
    const pool = await sql.connect(dbConfig);

    const kontrol = await pool.request()
      .input("MalzemeAdi", sql.NVarChar, MalzemeAdi)
      .query("SELECT COUNT(*) AS adet FROM Malzeme WHERE MalzemeAdi = @MalzemeAdi");

    if (kontrol.recordset[0].adet > 0) {
      return res.status(409).send("Bu isimde bir malzeme zaten kayıtlı.");
    }

    await pool.request()
      .input("MalzemeAdi", sql.NVarChar, MalzemeAdi)
      .input("Miktar", sql.Int, Miktar)
      .input("KritikSeviye", sql.Int, KritikSeviye)
      .query("INSERT INTO Malzeme (MalzemeAdi, Miktar, KritikSeviye) VALUES (@MalzemeAdi, @Miktar, @KritikSeviye)");
    res.status(201).send("Malzeme eklendi");
  } catch (err) {
    res.status(500).send("Hata: " + err.message);
  }
});

app.delete("/api/malzemeler/:id", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    await pool.request().input("id", sql.Int, req.params.id)
      .query("DELETE FROM Malzeme WHERE MalzemeID = @id");
    res.send("Malzeme silindi");
  } catch (err) {
    res.status(500).send("Hata: " + err.message + " (Bu malzeme bir tedavide kullanılmış olabilir.)");
  }
});

// ---------- REÇETE ----------
app.get("/api/receteler", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`
      SELECT RC.ReceteID, H.Ad + ' ' + H.Soyad AS Hasta, RC.IlacAdi, RC.Doz, RC.Tarih
      FROM Recete RC
      JOIN Hasta H ON RC.HastaID = H.HastaID
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Hata: " + err.message);
  }
});

app.post("/api/receteler", async (req, res) => {
  try {
    const { HastaID, HekimID, IlacAdi, Doz } = req.body;
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("HastaID", sql.Int, HastaID)
      .input("HekimID", sql.Int, HekimID)
      .input("IlacAdi", sql.NVarChar, IlacAdi)
      .input("Doz", sql.NVarChar, Doz)
      .query("INSERT INTO Recete (HastaID, HekimID, IlacAdi, Doz) VALUES (@HastaID, @HekimID, @IlacAdi, @Doz)");
    res.status(201).send("Reçete eklendi");
  } catch (err) {
    res.status(500).send("Hata: " + err.message);
  }
});

app.delete("/api/receteler/:id", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    await pool.request().input("id", sql.Int, req.params.id)
      .query("DELETE FROM Recete WHERE ReceteID = @id");
    res.send("Reçete silindi");
  } catch (err) {
    res.status(500).send("Hata: " + err.message);
  }
});

// ---------- İSTATİSTİKLER ----------
app.get("/api/istatistikler", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const bugunkuRandevu = await pool.request().query(`
      SELECT COUNT(*) AS adet FROM Randevu WHERE CAST(Tarih AS DATE) = CAST(GETDATE() AS DATE)
    `);
    const aktifTedavi = await pool.request().query(`
      SELECT COUNT(*) AS adet FROM Tedavi WHERE Durum = 'DevamEdiyor'
    `);
    const kritikStok = await pool.request().query(`
      SELECT COUNT(*) AS adet FROM Malzeme WHERE Miktar <= KritikSeviye
    `);
    const toplamHasta = await pool.request().query(`
      SELECT COUNT(*) AS adet FROM Hasta
    `);

    res.json({
      bugunkuRandevu: bugunkuRandevu.recordset[0].adet,
      aktifTedavi: aktifTedavi.recordset[0].adet,
      kritikStok: kritikStok.recordset[0].adet,
      toplamHasta: toplamHasta.recordset[0].adet,
    });
  } catch (err) {
    res.status(500).send("Hata: " + err.message);
  }
});

// ---------- GÜNCELLEME İŞLEMLERİ ----------
app.put("/api/hastalar/:id", async (req, res) => {
  try {
    const { Ad, Soyad, Telefon, DogumTarihi } = req.body;
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("id", sql.Int, req.params.id)
      .input("Ad", sql.NVarChar, Ad)
      .input("Soyad", sql.NVarChar, Soyad)
      .input("Telefon", sql.NVarChar, Telefon)
      .input("DogumTarihi", sql.Date, DogumTarihi)
      .query("UPDATE Hasta SET Ad=@Ad, Soyad=@Soyad, Telefon=@Telefon, DogumTarihi=@DogumTarihi WHERE HastaID=@id");
    res.send("Hasta güncellendi");
  } catch (err) {
    res.status(500).send("Hata: " + err.message);
  }
});

app.put("/api/hekimler/:id", async (req, res) => {
  try {
    const { Ad, Soyad, Uzmanlik } = req.body;
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("id", sql.Int, req.params.id)
      .input("Ad", sql.NVarChar, Ad)
      .input("Soyad", sql.NVarChar, Soyad)
      .input("Uzmanlik", sql.NVarChar, Uzmanlik)
      .query("UPDATE Hekim SET Ad=@Ad, Soyad=@Soyad, Uzmanlik=@Uzmanlik WHERE HekimID=@id");
    res.send("Hekim güncellendi");
  } catch (err) {
    res.status(500).send("Hata: " + err.message);
  }
});

app.put("/api/malzemeler/:id", async (req, res) => {
  try {
    const { MalzemeAdi, Miktar, KritikSeviye } = req.body;
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("id", sql.Int, req.params.id)
      .input("MalzemeAdi", sql.NVarChar, MalzemeAdi)
      .input("Miktar", sql.Int, Miktar)
      .input("KritikSeviye", sql.Int, KritikSeviye)
      .query("UPDATE Malzeme SET MalzemeAdi=@MalzemeAdi, Miktar=@Miktar, KritikSeviye=@KritikSeviye WHERE MalzemeID=@id");
    res.send("Malzeme güncellendi");
  } catch (err) {
    res.status(500).send("Hata: " + err.message);
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});