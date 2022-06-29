const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  UserName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Team: {
    type: String,
    required: true,
  },
  Player: {
    type: String,
    required: true,
  },
  Profile_img: {
    type: String,
  },
  Score: {
    type: Number,
  },
  UserTeams: [
    {type: String}
  ],

  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "7d",
  });
  return token;
};

const User = mongoose.model("Users", userSchema);

const validate = (data) => {
  const schema=Joi.object({
    Email: Joi.string().required().label("Email"),
    Password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = {User, validate};
