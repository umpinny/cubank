const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { stringify } = require("querystring");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },

  accountId: {
    type: String,
    required: [true, "Please add accountId"],
    match: [/^\d{10}$/, "Please add a valid accountId"],
    unique: true,
  },

  balance: {
    type: Number,
    default: 0,
  },
  transactions: [
    {
      title: String,
      target: String,
      among: Number,
      balance: Number,
      date: Date,
    },
  ],
  password: {
    type: String,
    required: [true, "Please add a password"],
    select: false,
    match: [/^\d{4}$/, "Please add a valid password"],
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createAt: {
    type: Date,
    default: Date.now,
  },
});

//Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
