// controllers/authController.js

// استيراد موديل المستخدم وتصحيح المسار
const User   = require('../models/User');
const bcrypt = require('bcrypt');

// دالة تسجيل المستخدم
const registerUser = async (req, res) => {
  const { email, password, fullName, phone } = req.body;

  try {
    // التحقق من وجود المستخدم
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'هذا البريد مسجل بالفعل' });
    }

    // تجزئة كلمة المرور
    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('🔐 كلمة المرور المجزأة:', hashedPassword);

    // إنشاء وحفظ المستخدم الجديد
    const newUser = new User({
      email,
      password: hashedPassword,
      fullName,
      phone
    });
    await newUser.save();

    res.status(201).json({ message: 'تم إنشاء الحساب بنجاح' });
  } catch (error) {
    console.error('خطأ في التسجيل:', error);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
};

// تصدير الدالة ليستخدمها الراوتر
module.exports = { registerUser };
