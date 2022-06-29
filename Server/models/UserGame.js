const mongoose = require("mongoose");

const UserGameSchema = new mongoose.Schema({
  UserID: {
    type: String,
    required: true,
  },
  GameID: {
    type: String,
    required: true,
  },
  Team1: {
    type: Number,
  },
  Team2: {
    type: Number,
  },
  Score: {
    type: Number,
  },
  Status: {
    type: String,
  }
});

module.exports = mongoose.model("UserGame", UserGameSchema);
