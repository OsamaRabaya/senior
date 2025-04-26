const express = require('express');
const router  = express.Router();
const protectRoute = require('../middleware/protectRoute');

const { handleForgotPassword } = require('../controllers/authController');

// محمي - هذا المسار يحتاج إلى الحماية باستخدام الـ middleware
router.get('/', protectRoute, (req, res) => {
  // req.user موجود من الـ middleware
  res.status(200).json({
    message: 'Welcome to your dashboard',
    userId: req.user.userId
  });
});

// نسيت كلمة المرور - تأكد أن دالة handleForgotPassword هي دالة غير متزامنة وتعمل بشكل صحيح
router.post('/forgot-password', async (req, res) => {
  try {
    await handleForgotPassword(req, res);  // التأكد من أن handleForgotPassword يتم التعامل معها بشكل صحيح
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ غير متوقع في عملية استرجاع كلمة المرور' });
  }
});

module.exports = router;


