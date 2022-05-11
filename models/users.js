const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    facebook: {
      token: { type: String },
      firstname: { type: String },
      lastname: { type: String },
      email: { type: String },
      profile: { type: String },
    },
    googleId: {
      type: String,
    },
    google: {
      token: { type: String },
      firstname: { type: String },
      lastname: { type: String },
      email: { type: String },
      profile: { type: String },
    },
    profile:{
      type:String
    },
    isVerified:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("user", userSchema);
module.exports = User;
