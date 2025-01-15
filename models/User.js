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

const User = mongoose.model("User", userSchema);

module.exports = User;
