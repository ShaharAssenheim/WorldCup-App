const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  GroupID: {type: String, required: true,},
  Teams: [{
    Team:{type: String},
    Img_Url:{type: String},
    Score:{type: Number},
  }]
});

module.exports = mongoose.model("Group", GroupSchema);
