// routes/auth.js
require('dotenv').config();
const express  = require('express');
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const router   = express.Router();
const User     = require('../models/User');
const { registerUser } = require('../controllers/authController');

router.post('/register', registerUser);

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'البريد أو كلمة المرور غير صحيحة' });
    }
    
  const isMatch = await bcrypt.compare( password , user.password);

    console.log('🔑 المُدخل:', password);
    console.log('🔐 من قاعدة البيانات:', user.password);
    console.log(isMatch)
    if (!isMatch) {
      return res.status(401).json({ message: 'البريد أو كلمة المرور غير صحيحة' });
    }
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key';
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

module.exports = router;
