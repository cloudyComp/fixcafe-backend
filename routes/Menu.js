const express = require('express');
const db = require('../db');
const router = express.Router();

// ✅ GET semua menu berdasarkan kategori (coffee / noncoffee)
router.get('/:kategori', (req, res) => {
  const kategori = req.params.kategori;
  db.query('SELECT * FROM menu WHERE kategori = ?', [kategori], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal ambil data', error: err });
    res.json(rows);
  });
});

// ✅ GET menu berdasarkan ID
router.get('/detail/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM menu WHERE id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal ambil data', error: err });
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Menu tidak ditemukan' });
    res.json(rows[0]);
  });
});

// ✅ POST tambah menu
router.post('/', (req, res) => {
  const { nama, deskripsi, harga, kategori } = req.body;

  if (!nama || !deskripsi || !harga || !kategori) {
    return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
  }

  db.query(
    'INSERT INTO menu (nama, deskripsi, harga, kategori) VALUES (?, ?, ?, ?)',
    [nama, deskripsi, harga, kategori],
    (err) => {
      if (err) return res.status(500).json({ success: false, message: 'Gagal simpan menu', error: err });
      res.status(200).json({ success: true, message: 'Menu berhasil disimpan' });
    }
  );
});

// ✅ PUT update menu
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { nama, deskripsi, harga, kategori } = req.body;

  if (!nama || !deskripsi || !harga || !kategori) {
    return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
  }

  db.query(
    'UPDATE menu SET nama = ?, deskripsi = ?, harga = ?, kategori = ? WHERE id = ?',
    [nama, deskripsi, harga, kategori, id],
    (err) => {
      if (err) return res.status(500).json({ success: false, message: 'Gagal update menu', error: err });
      res.status(200).json({ success: true, message: 'Menu berhasil diperbarui' });
    }
  );
});

// ✅ DELETE menu
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM menu WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ success: false, message: 'Gagal hapus menu', error: err });
    res.status(200).json({ success: true, message: 'Menu berhasil dihapus' });
  });
});

module.exports = router;
