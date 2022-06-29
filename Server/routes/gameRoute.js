const express = require("express");
const router = express.Router();
const UserGame = require("../models/UserGame");
const Game = require("../models/Game");
const Group = require("../models/Group");

//Get UserGamesList
router.get("/:UserID", async (req, res) => {
  UserGame.find({ UserID: req.params.UserID }).then(function (games) {
    res.send(games);
  });
});

//Save User Game Result
router.post("/", async (req, res) => {
  try {
    const usergame = await UserGame.findOne({
      GameID: req.body.GameID,
      UserID: req.body.UserID,
    });
    if (usergame) {
      usergame.Team1 = req.body.Team1;
      usergame.Team2 = req.body.Team2;
      usergame.save();
    } else {
      await new UserGame({
        ...req.body,
      }).save();
    }
    res.status(201).send({ message: "UserGame Created Succesfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log(err.message);
  }
});

//Get Games List
router.get("/", async (req, res) => {
  Game.find().then(function (games) {
    res.send(games);
  });
});

//Insert New Game
router.post("/new", async (req, res) => {
  try {
    const game = await Game.findOne({
      GameID: req.body.GameID,
    });
    if (game) {
      return res.status(201).send({ message: "Game Exist In DB." });
    } else {
      await new Game({
        ...req.body,
      }).save();
    }
    res.status(201).send({ message: "Game Created Succesfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log(err.message);
  }
});

//Update Game Result
router.put("/GameUpdate", async (req, res) => {
  try {
    const game = await Game.findOne({
      GameID: req.body.GameID,
    });
    if (game) {
      game.Res1 = req.body.Team1;
      game.Res2 = req.body.Team2;
      game.save();

      const group = await Group.findOne({
        "local.Team": { $elemMatch: { Team: game.Team1 } },
      });

      const userGames = await UserGame.find({
        GameID: req.body.GameID,
      });

      UpdateGroupPoints(group, game);
      UpdateUserGames(userGames, game);
    }
    res.status(201).send({ message: "Game Saved Succesfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log(err.message);
  }
});

const UpdateGroupPoints = function (group, game) {
  if (game.Res1 === null || game.Res2 === null) return;

  group.Teams.forEach((team) => {
    if (game.Team1 === team.Team || game.Team2 === team.Team) {
      team.Score=0;
      if (game.Team1 === team.Team) {
        if (game.Res1 > game.Res2) team.Score += 3;
        else if (game.Res1 === game.Res2) team.Score += 1;
      } else if (game.Team2 === team.Team) {
        if (game.Res1 < game.Res2) team.Score += 3;
        else if (game.Res1 === game.Res2) team.Score += 1;
      }
    }
  });
  group.save();
};

const UpdateUserGames = function (userGames, game) {
  userGames.forEach((user) => {
    if (user.Team1 === null || user.Team2 === null) return;

    if (game.Res1 > game.Res2) {
      //Team1 Win
      if (user.Team1 === game.Res1 && user.Team2 === game.Res2) {
        user.Score = game.Score1;
        user.Status = "Perfect";
      } else if (user.Team1 > user.Team2) {
        user.Score = game.Score1 / 2;
        user.Status = "Side";
      } else {
        user.Score = 0;
        user.Status = "Wrong";
      }
    } else if (game.Res1 < game.Res2) {
      //Team2 Win
      if (user.Team1 === game.Res1 && user.Team2 === game.Res2) {
        user.Score = game.Score2;
        user.Status = "Perfect";
      } else if (user.Team1 < user.Team2) {
        user.Score = game.Score2 / 2;
        user.Status = "Side";
      } else {
        user.Score = 0;
        user.Status = "Wrong";
      }
    } else {
      //draw
      if (user.Team1 === game.Res1 && user.Team2 === game.Res2) {
        user.Score = game.ScoreX;
        user.Status = "Perfect";
      } else if (user.Team1 === user.Team2) {
        user.Score = game.ScoreX / 2;
        user.Status = "Side";
      } else {
        user.Score = 0;
        user.Status = "Wrong";
      }
    }
    user.save();
  });
};

module.exports = router;
