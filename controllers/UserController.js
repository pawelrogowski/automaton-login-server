const User = require("../models/User");

exports.createUser = async (userData) => {
  const newUser = new User(userData);
  return newUser.save();
};

exports.getUserByEmail = async (email) => {
  return User.findOne({ email: email });
};

exports.updateUser = async (email, userData) => {
  const user = await User.findOne({ email: email });
  if (!user) throw new Error("User not found");
  return User.findByIdAndUpdate(user._id, userData, { new: true });
};

exports.deleteUser = async (email) => {
  return User.findByIdAndDelete({ email: email });
};

// UserController.js
exports.changeEmail = async (email, newEmail) => {
  const user = await User.findOne({ email: email });
  if (!user) throw new Error("User not found");
  user.email = newEmail;
  return user.save();
};

exports.changePassword = async (email, newPassword) => {
  const user = await User.findOne({ email: email });
  if (!user) throw new Error("User not found");
  user.password = newPassword;
  return user.save();
};
