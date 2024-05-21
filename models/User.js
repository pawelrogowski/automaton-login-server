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
        return /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$%!]).*[A-Za-z\d@$%!]{8,}$/.test(
          v
        );
      },
      message: (props) =>
        `${props.value} is not a valid password Password must have at least 8 characters, one digit, one special character, and one uppercase letter.`,
    },
  },
  daysLeft: {
    type: Number,
    default: 0,
    min: [0, "Days left cannot be less than 0"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
