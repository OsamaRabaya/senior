const jwt = require('jsonwebtoken');

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // تأكد من أنك استوردت نموذج المستخدم بشكل صحيح

// تعريف المسار POST لتسجيل الدخول
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // التحقق من وجود المستخدم في قاعدة البيانات
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
  }

  // التحقق من كلمة المرور
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
  }

  // توليد التوكن
  const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });

  // إرسال التوكن إلى العميل
  res.json({ token });
});

module.exports = router;
