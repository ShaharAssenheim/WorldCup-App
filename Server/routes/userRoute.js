const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/User");
const cloudinary = require("cloudinary").v2;
const UserGame = require("../models/UserGame");

//cloud for uploading images settings:
cloudinary.config({
  cloud_name: "dmrx96yqx",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Get All Users
router.get("/", async (req, res) => {
  const users = await User.find();
  const usergames = await UserGame.find();

  users.forEach((user) => {
    const games = usergames.filter((x) => x.UserID === user.Email);
    var _Score = 0;
    games.forEach((game) => {
      _Score += game.Score;
    });
    user.Score = _Score;
  });
  res.send(users.sort((a, b) => (a.Score < b.Score ? 1 : -1)));
});

//Update user details
router.put("/Update/:id", async (req, res) => {
  try {
    const user = await User.findOne({ Email: req.body.Email });
    if (!user)
      return res.status(401).send({ message: "User Not Exist In DB." });

    let path = req.body.Profile_img;
    const uniqueFilename = req.body.UserName;

    await cloudinary.uploader.destroy(`WorldCup/${uniqueFilename}`); //delete old image from cloudinary

    cloudinary.uploader.upload(
      path,
      { public_id: `WorldCup/Users/${uniqueFilename}`, tags: `WorldCup` }, // directory and tags are optional
      async function (err, image) {
        if (err) {
          console.log(err);
          return res.send(err);
        }
        console.log("file uploaded to Cloudinary");

        user.Profile_img = image.url;
        user.save();
        res.status(201).send({ message: "User Updated Succesfully" });
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Delete User
router.delete("/Delete/:id", async (req, res) => {
  try {
    User.findOne({ Email: req.params.id }, async function (err, user) {
      if (err)
        return res.status(401).send({ message: "User Not Exist In DB." });
      await cloudinary.uploader.destroy(`WorldCup/Users/${user.UserName}`);
      user.remove();
    });
    UserGame.find({ UserID: req.params.id }, async function (err, games) {
      if (err)
        return res.status(401).send({ message: "User Not Exist In DB." });
      games.forEach(x=>x.remove());
    });
    res.status(201).send({ message: "User Deleted Succesfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get Users By Game And Team
router.get("/UsersBets/:id", async (req, res) => {
  var s = req.params.id.split("_");
  const users = await User.find({ UserTeams: s[0] });
  const usergames = await UserGame.find({ GameID: s[1] });
  var arr = [];
  users.forEach((user) => {
    const game = usergames.filter((x) => x.UserID === user.Email)[0];
    var b =
      game.Team1 === null || game.Team2 === null
        ? "---"
        : game.Team1 + "-" + game.Team2;
    var u = {
      Name: user.UserName,
      UserTeams: user.UserTeams,
      Profile_img: user.Profile_img,
      Score: game.Score,
      Bet: b,
    };
    arr.push(u);
  });
  res.send(arr.sort((a, b) => (a.Score < b.Score ? 1 : -1)));
});

module.exports = router;
