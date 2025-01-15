// User.js
const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true,
		validate: {
			validator: validator.isEmail,
			message: (props) => `${props.value} is not a valid email`,
		},
	},
	password: {
		type: String,
		required: true,
	},
	subscriptionStartDate: {
		type: Date,
		required: true,
		default: Date.now,
	},
	totalSubscriptionDays: {
		type: Number,
		required: true,
		default: 0,
		min: [0, "Subscription days cannot be negative"],
	},
});

// method to calculate days left
userSchema.methods.calculateDaysLeft = function () {
	const now = new Date();
	const startDate = this.subscriptionStartDate;
	const totalDays = this.totalSubscriptionDays;

	const daysPassed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
	const daysLeft = Math.max(0, totalDays - daysPassed);

	return daysLeft;
};

// method to exclude password when converting to JSON
userSchema.methods.toJSON = function () {
	const userObject = this.toObject();
	delete userObject.password;
	return userObject;
};

userSchema.methods.calculateTimeLeft = function () {
	const now = new Date();
	const startDate = this.subscriptionStartDate;
	const totalDays = this.totalSubscriptionDays;

	// Convert total days to milliseconds
	const totalMs = totalDays * 24 * 60 * 60 * 1000;
	const endDate = new Date(startDate.getTime() + totalMs);
	const msLeft = endDate - now;

	if (msLeft <= 0) {
		return {
			days: 0,
			hours: 0,
			minutes: 0,
			totalMinutesLeft: 0,
			isExpired: true,
		};
	}

	// Calculate the components
	const days = Math.floor(msLeft / (24 * 60 * 60 * 1000));
	const hours = Math.floor((msLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
	const minutes = Math.floor((msLeft % (60 * 60 * 1000)) / (60 * 1000));
	const totalMinutesLeft = Math.floor(msLeft / (60 * 1000));

	return {
		days,
		hours,
		minutes,
		totalMinutesLeft,
		isExpired: false,
	};
};

const User = mongoose.model("User", userSchema);

module.exports = User;
