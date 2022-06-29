const express = require("express");
const router = express.Router();
const UserTeam = require("../models/UserTeam");
const { User, validate } = require("../models/User");
const cloudinary = require("cloudinary").v2;

//cloud for uploading images settings:
cloudinary.config({
  cloud_name: "dmrx96yqx",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Get User Teams List
router.get("/Teams", async (req, res) => {
  UserTeam.find().then(function (teams) {
    res.send(teams);
  });
});

//Insert New User Team
router.post("/newTeam", async (req, res) => {
  try {
    const team = await UserTeam.findOne({
      Name: req.body.Name,
    });
    if (team) {
      return res.status(201).send({ message: "Team Exist In DB." });
    } else {
      let path =
        req.body.Img_Url === null
          ? "http://ssl.gstatic.com/accounts/ui/avatar_2x.png"
          : req.body.Img_Url;

      const uniqueFilename = req.body.Name;

      cloudinary.uploader.upload(
        path,
        { public_id: `WorldCup/UserTeams/${uniqueFilename}`, tags: `WorldCup` }, // directory and tags are optional
        async function (err, image) {
          if (err) {
            console.log(err);
            return res.send(err);
          }
          console.log("file uploaded to Cloudinary");

          await new UserTeam({
            ...req.body,
            Img_Url: image.url,
          }).save();
        }
      );

      const user = await User.findOne({ Email: req.body.Admin });
      var arr = user.UserTeams;
      arr.push(req.body.Name);
      user.UserTeams = arr;
      user.save();
      res.status(201).send({ message: "Team Created Succesfully" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log(err.message);
  }
});

//Add Team To User Teams
router.put("/AddUser/:id", async (req, res) => {
  try {
    const user = await User.findOne({ Email: req.body.Email });
    if (!user)
      return res.status(401).send({ message: "User Not Exist In DB." });
    if (user.UserTeams.includes(req.body.TeamName))
      return res.status(401).send({ message: "User Already In The Team" });

    var arr = user.UserTeams;
    arr.push(req.body.TeamName);
    user.UserTeams = arr;
    user.save();
    res.status(201).send({ message: "User Updated Succesfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Delete User Team
router.delete("/Delete/:id", async (req, res) => {
  try {
    const users = await User.find({ UserTeams: req.params.id });
    users.forEach((user) => {
      var arr = user.UserTeams;
      arr = arr.filter((item) => item !== req.params.id);
      user.UserTeams = arr;
      user.save();
    });
    const team = await UserTeam.findOne({
      Name: req.params.id,
    });
    team.remove();
    await cloudinary.uploader.destroy(`WorldCup/UserTeams/${team.Name}`);
    res.status(201).send({ message: "Team Deleted Succesfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Delete Team From UserTeams
router.put("/DeleteUser/:id", async (req, res) => {
  try {
    const user = await User.findOne({ Email: req.body.Email });
    if (!user)
      return res.status(401).send({ message: "User Not Exist In DB." });

    var arr = user.UserTeams;
    arr = arr.filter((item) => item !== req.body.Team);
    user.UserTeams = arr;
    user.save();
    res.status(201).send({ message: "User Updated Succesfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
