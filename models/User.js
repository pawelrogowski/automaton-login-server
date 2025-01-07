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
		minlength: 8,
		validate: {
			validator: function (v) {
				// Only validate password format for non-hashed passwords
				if (!this.isModified("password")) return true;
				return /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$%!]).*[A-Za-z\d@$%!]{8,}$/.test(
					v
				);
			},
			message: (props) =>
				`Password must have at least 8 characters, one digit, one special character, and one uppercase letter.`,
		},
	},
	daysLeft: {
		type: Number,
		default: 0,
		min: [0, "Days left cannot be less than 0"],
	},
});

// Add method to exclude password when converting to JSON
userSchema.methods.toJSON = function () {
	const userObject = this.toObject();
	delete userObject.password;
	return userObject;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
