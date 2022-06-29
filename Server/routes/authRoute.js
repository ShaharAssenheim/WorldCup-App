const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/User");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;
const UserGame = require("../models/UserGame");

//cloud for uploading images settings:
cloudinary.config({
  cloud_name: "dmrx96yqx",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//CreateUSer, in this app use postman
router.post("/SignUp", async (req, res) => {
  try {
    const user = await User.findOne({ Email: req.body.Email });
    if (user)
      return res
        .status(401)
        .send({ message: "User Email Is Already Exist In DB." });

    let path =
      req.body.Profile_img === null
        ? "http://ssl.gstatic.com/accounts/ui/avatar_2x.png"
        : req.body.Profile_img;

    const uniqueFilename = req.body.UserName;

    cloudinary.uploader.upload(
      path,
      { public_id: `WorldCup/Users/${uniqueFilename}`, tags: `WorldCup` }, // directory and tags are optional
      async function (err, image) {
        if (err) {
          console.log(err);
          return res.send(err);
        }
        console.log("file uploaded to Cloudinary");

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.Password, salt);

        await new User({
          ...req.body,
          Password: hashPassword,
          Profile_img: image.url,
          UserTeams:[]
        }).save();
        res.status(201).send({ message: "User Created Succesfully" });
      }
    );
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log(err.message);
  }
});

//Login for the first time, compare passowrd and genarte token.
router.post("/Login", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ Email: req.body.Email });

    if (!user)
      return res.status(401).send({ message: "Invalid User Name or Password" });

    const validPassword = await bcrypt.compare(
      req.body.Password,
      user.Password
    );
    if (!validPassword)
      return res.status(401).send({ message: "Invalid User Name or Password" });

    const token = user.generateAuthToken();

    const usergames = await UserGame.find({ UserID: user.Email });
    var _Score = 0;
    var _Perfect = 0;
    var _Side = 0;
    var _Wrong = 0;

    usergames.forEach((game) => {
      _Score += game.Score;
      if (game.Status === "Perfect") _Perfect++;
      else if (game.Status === "Side") _Side++;
      else if (game.Status === "Wrong") _Wrong++;
    });

    return res.status(200).send({
      Email: user.Email,
      Name: user.UserName,
      Team: user.Team,
      Player: user.Player,
      Profile_img: user.Profile_img,
      Score: _Score,
      Perfect: _Perfect,
      Side:_Side,
      Wrong: _Wrong,
      data: token,
      UserTeams: user.UserTeams,
      message: "Logged In Successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
});

// Aotumatic Login, recixe a token from the client and check for authorization.
router.get("/", async (req, res) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWTPRIVATEKEY, (err, user) => {
    if (err) return res.sendStatus(403);

    var userId = user._id;
    User.findOne({ _id: userId }).then(async function (u) {
      if (u===null) return res.sendStatus(403);

      const usergames = await UserGame.find({ UserID: u.Email });
      var _Score = 0;
      var _Perfect = 0;
      var _Side = 0;
      var _Wrong = 0;

      usergames.forEach((game) => {
        _Score += game.Score;
        if (game.Status === "Perfect") _Perfect++;
        else if (game.Status === "Side") _Side++;
        else if (game.Status === "Wrong") _Wrong++;
      });

      return res.status(200).send({
        Email: u.Email,
        Name: u.UserName,
        Team: u.Team,
        Player: u.Player,
        Profile_img: u.Profile_img,
        Score: _Score,
        Perfect: _Perfect,
        Side:_Side,
        Wrong: _Wrong,
        data: token,
        UserTeams: u.UserTeams,
        message: "Logged In Successfully",
      });
    });
  });
});

//Forgot Password
router.post("/Forgot", async (req, res) => {
  try {
    let token = "";
    crypto.randomBytes(20, function (err, buf) {
      token = buf.toString("hex");
    });

    const u = await User.findOne({ Email: req.body.Email });

    u.resetPasswordToken = token;
    u.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    u.save();

    let smtpTransport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,

      auth: {
        user: process.env.Email,
        pass: process.env.GMAILPW,
      },
    });

    let mailOptions = {
      to: u.Email,
      from: "shacharassen3667@gmail.com",
      subject: "World Cup App Password Reset",
      text:
        "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
        "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
        "http://" +
        req.headers.host +
        "/reset/" +
        token +
        "\n\n" +
        "If you did not request this, please ignore this email and your password will remain unchanged.\n",
    };

    smtpTransport.sendMail(mailOptions, function (err) {
      console.log("mail sent");
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
