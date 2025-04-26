
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  // أضف أي حقول أخرى حسب حاجتك
});


const User = mongoose.model('User', userSchema);
module.exports = User;
