require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const User = require('./models/User');  // تأكد من استيراد نموذج المستخدم بشكل صحيح
const authRoutes      = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboardRoutes');
const app = express();

// CORS Configuration
app.use(cors({
  origin: '*',  // السماح لجميع المواقع (مؤقتًا في مرحلة التطوير)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(cors());  // تفعيل CORS لجميع المصادر
app.use(bodyParser.json());  // تحليل بيانات JSON القادمة من الطلبات

// إعداد الجلسات
app.use(session({
  secret: 'your_secret_key',  // استخدم قيمة سرية فريدة هنا
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // إذا كنت تستخدم HTTPS، قم بتغيير `secure` إلى true
}));

// التحقق من إعدادات البيئة
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('PORT:', process.env.PORT);

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ DB connected'))
.catch(err => console.error('❌ DB error:', err));


// ربط الـ routes
app.use('/api/auth', authRoutes);          // → /api/auth/login , /api/auth/register
app.use('/api/dashboard', dashboardRoutes);// → GET /api/dashboard/


// مسار تسجيل الدخول
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // البحث عن المستخدم في قاعدة البيانات
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }

    // مقارنة كلمة المرور المدخلة مع كلمة المرور المشفرة في قاعدة البيانات
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }

    // توليد التوكن
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key';
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });

    // حفظ التوكن في الجلسة
    req.session.token = token;
    console.log('تم حفظ التوكن في الجلسة:', req.session.token);

    // إرسال التوكن إلى العميل
    res.json({ message: 'تم تسجيل الدخول بنجاح', token });
  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});

// مسار محمي (مثل /dashboard)
app.get('/api/dashboard', (req, res) => {
  // التحقق من التوكن في الجلسة
  const token = req.session.token;

  if (!token) {
    return res.status(401).json({ message: 'التوكن غير موجود أو انتهت صلاحيته' });
  }

  const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key';

  // التحقق من صحة التوكن
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'التوكن غير صالح أو انتهت صلاحيته' });
    }

    // التوكن صالح، قم بالاستمرار في العملية
    res.json({ message: 'مرحبًا بك في لوحة التحكم', data: decoded });
  });
});

// تشغيل الخادم
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));

