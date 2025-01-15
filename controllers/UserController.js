const User = require("../models/User");
const bcrypt = require("bcrypt");

const validatePassword = (password) => {
	// Password must have:
	// - at least 8 characters
	// - one digit
	// - one special character
	// - one uppercase letter
	const passwordRegex =
		/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$%!]).*[A-Za-z\d@$%!]{8,}$/;
	return passwordRegex.test(password);
};

// Modify the existing createUser function
exports.createUser = async (userData) => {
	try {
		// Validate password before hashing
		if (!validatePassword(userData.password)) {
			throw new Error(
				"Password must have at least 8 characters, one digit, one special character, and one uppercase letter"
			);
		}

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
		console.error("Error creating user:", error);
		throw error;
	}
};

// login function
// UserController.js - Update the loginUser function
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

	// Calculate detailed time left
	const timeLeft = user.calculateTimeLeft();
	if (timeLeft.isExpired) {
		throw new Error("Subscription expired");
	}

	// Important: Don't update totalSubscriptionDays here anymore
	// We keep the original subscription duration

	// Add timeLeft to user object for response
	const userObject = user.toObject();
	userObject.timeLeft = timeLeft;

	return userObject;
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

// method to update subscription
exports.updateSubscription = async (email, additionalDays) => {
	const user = await User.findOne({ email });
	if (!user) throw new Error("User not found");

	// Reset start date and add days if subscription expired
	const daysLeft = user.calculateDaysLeft();
	if (daysLeft <= 0) {
		user.subscriptionStartDate = new Date();
		user.totalSubscriptionDays = additionalDays;
	} else {
		// Add days to existing subscription
		user.totalSubscriptionDays += additionalDays;
	}

	return user.save();
};

exports.createUser = async (userData) => {
	try {
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

		const newUser = new User({
			...userData,
			password: hashedPassword,
			subscriptionStartDate: new Date(),
			totalSubscriptionDays: userData.totalSubscriptionDays || 0,
		});

		return await newUser.save();
	} catch (error) {
		console.error("Error creating user:", error);
		throw error;
	}
};
