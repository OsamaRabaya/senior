// middleware/protectRoute.js
const jwt = require('jsonwebtoken');

const protectRoute = (req, res, next) => {
  // 1) اقرأ الهيدر Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'التوكن غير موجود أو الصيغة خاطئة' });
  }

  // 2) استخرج التوكن
  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key';

  // 3) تحقق منه
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'التوكن غير صالح أو انتهت صلاحيته' });
    }
    // 4) خزّن بيانات المستخدم في req.user
    req.user = decoded;
    next();
  });
};

module.exports = protectRoute;
