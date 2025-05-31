const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const db      = require('../db');
const router  = express.Router();

// Setup penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/promo');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// Konfigurasi upload
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // max 15MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
      return cb(new Error('Hanya file JPG, JPEG, PNG yang diperbolehkan'));
    }
    cb(null, true);
  }
});

// ✅ POST tambah menu
router.post('/uploadPromo', upload.single('gambar'), (req, res) => {
  const { nama, deskripsi, tanggal } = req.body;
  const filename = req.file && req.file.filename;

  if (!filename || !nama || !deskripsi || !tanggal) {
    return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
  }

  const query = 'INSERT INTO promo (nama, deskripsi, tanggal, filename) VALUES (?, ?, ?, ?)';
  db.query(query, [nama, deskripsi, tanggal, filename], (err) => {
    if (err) {
      console.error('[INSERT PROMO ERROR]:', err);
      return res.status(500).json({ success: false, message: 'Gagal simpan promo', error: err });
    }
    res.status(200).json({ success: true, message: 'Promo berhasil disimpan' });
  });
});

router.get('/getAll', (req, res) => {
  db.query('SELECT * FROM promo', (err, rows) => {
    if (err) {
      console.error('❌ DB error:', err);
      return res.status(500).json({ error: 'Gagal mengambil data promo' });
    }
    res.json(rows);
  });
});

// GET promo by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM promo WHERE id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (rows.length === 0) return res.status(404).json({ message: 'Promo tidak ditemukan' });
    res.json(rows[0]);
  });
});

router.delete('/:id', (req, res) => {
  const promoId = req.params.id;
  db.query('DELETE FROM promo WHERE id = ?', [promoId], (err) => {
    if (err) {
      console.error('DB delete error:', err);
      return res.status(500).json({ message: 'Gagal menghapus promo' });
    }
    res.status(200).json({ message: 'Promo berhasil dihapus' });
  });
});

// ✅ PUT: Update promo
router.put('/update/:id', upload.single('gambar'), async (req, res) => {
  const { id } = req.params;
  const { nama, deskripsi, tanggal } = req.body;
  const filename = req.file ? req.file.filename : null;

  if (!nama || !deskripsi || !tanggal) {
    return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
  }

  // Jika ada gambar baru, update filename
  const query = filename 
    ? 'UPDATE promo SET nama = ?, deskripsi = ?, tanggal = ?, filename = ? WHERE id = ?' 
    : 'UPDATE promo SET nama = ?, deskripsi = ?, tanggal = ? WHERE id = ?';

  const params = filename
    ? [nama, deskripsi, tanggal, filename, id]
    : [nama, deskripsi, tanggal, id];

  db.query(query, params, (err) => {
    if (err) {
      console.error('DB update error:', err);
      return res.status(500).json({ success: false, message: 'Gagal memperbarui promo' });
    }
    res.status(200).json({ success: true, message: 'Promo berhasil diperbarui' });
  });
});


module.exports = router;
