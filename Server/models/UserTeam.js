const mongoose = require("mongoose");

const UserTeamSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Img_Url: {
    type: String,
  },
  Admin: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("UserTeam", UserTeamSchema);