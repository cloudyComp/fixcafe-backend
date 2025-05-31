const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email dan password wajib diisi' });
  }

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Server error' });

    // ✅ Cek jika ada user ditemukan
    if (result.length > 0) {
      return res.status(200).json({ success: true, message: 'Login berhasil' });
    } else {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }
  });
});

module.exports = router;
