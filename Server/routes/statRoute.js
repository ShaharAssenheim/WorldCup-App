const express = require("express");
const router = express.Router();
const Game = require("../models/Game");
const Group = require("../models/Group");
const Player = require("../models/Player");

//Get Groups List
router.get("/Groups", async (req, res) => {
  Group.find().then(function (groups) {
    res.send(groups);
  });
});

//Insert New Group
router.post("/newGroup", async (req, res) => {
  try {   
    const group = await Group.findOne({
      GroupID: req.body.GroupID,
    });
    if (group) {
      return res.status(201).send({ message: "Group Exist In DB." });
    }
    else{
        await new Group({
            ...req.body,
          }).save();
    }
    res.status(201).send({ message: "Group Created Succesfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log(err.message+"test");
  }
});

//Get Players List
router.get("/Players", async (req, res) => {
  Player.find().then(function (players) {
    res.send(players);
  });
});

//Insert New Player
router.post("/newPlayer", async (req, res) => {
  try {   
    const player = await Player.findOne({
      Name: req.body.Name,
    });
    if (player) {
      return res.status(201).send({ message: "Player Exist In DB." });
    }
    else{
        await new Player({
            ...req.body,
          }).save();
    }
    res.status(201).send({ message: "Player Created Succesfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log(err.message);
  }
});

//Update Player Goals
router.put("/UpdatePlayers", async (req, res) => {
  try {
    const player = await Player.findOne({
      Name: req.body.Name,
    });
    if (player) {
      player.Goals = req.body.Goals;
      player.save();

    }
    res.status(201).send({ message: "player Saved Succesfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log(err.message);
  }
});



module.exports = router;
