const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  GameID: {
    type: String,
    required: true,
  },
  Team1: {
    type: String,
  },
  Team2: {
    type: String,
  },
  Team1_img: {
    type: String,
    required: true,
  },
  Team2_img: {
    type: String,
    required: true,
  },
  Time: {
    type: String,
    required: true,
  },
  Date: {
    type: String,
    required: true,
  },
  Location: {
    type: String,
    required: true,
  },
  Score1: {
    type: Number,
    required: true,
  },
  ScoreX: {
    type: Number,
    required: true,
  },
  Score2: {
    type: Number,
    required: true,
  },
  Res1: {
    type: Number,
  },
  Res2: {
    type: Number,
  },

});

module.exports = mongoose.model("Game", GameSchema);
