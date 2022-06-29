const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  Name: {type: String, required: true,},
  Img: {type: String},
  Goals: {type: Number},
});

module.exports = mongoose.model("Player", PlayerSchema);
