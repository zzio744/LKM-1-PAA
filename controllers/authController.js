const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findByEmail(email);
    if (userExists) return res.status(400).json({ status: 'error', message: 'Email sudah terdaftar' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create(name, email, hashedPassword);
    res.status(201).json({ status: 'success', message: 'Registrasi berhasil', data: newUser });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ status: 'error', message: 'Email atau password salah' });
    }
    res.status(200).json({ status: 'success', message: 'Login berhasil', data: { id: user.id, name: user.name } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = { register, login };