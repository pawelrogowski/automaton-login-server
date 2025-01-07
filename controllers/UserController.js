const User = require("../models/User");
const bcrypt = require("bcrypt");

// Modify the existing createUser function
exports.createUser = async (userData) => {
	try {
		// Hash the password
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

		// Create new user with hashed password
		const newUser = new User({
			...userData,
			password: hashedPassword,
		});

		// Save user and return
		return await newUser.save();
	} catch (error) {
		// Add better error handling
		console.error("Error creating user:", error);
		throw error;
	}
};

// Add the new login function
exports.loginUser = async (email, password) => {
	// Find user by email
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error("Invalid email or password");
	}

	// Compare provided password with stored hash
	const isValidPassword = await bcrypt.compare(password, user.password);
	if (!isValidPassword) {
		throw new Error("Invalid email or password");
	}

	return user; // Password will be automatically excluded thanks to toJSON method
};

exports.getUserByEmail = async (email) => {
	return User.findOne({ email: email });
};

exports.updateUser = async (email, userData) => {
	const user = await User.findOne({ email: email });
	if (!user) throw new Error("User not found");

	// If updating password, hash it
	if (userData.password) {
		const saltRounds = 10;
		userData.password = await bcrypt.hash(userData.password, saltRounds);
	}

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

	const saltRounds = 10;
	user.password = await bcrypt.hash(newPassword, saltRounds);
	return user.save();
};
