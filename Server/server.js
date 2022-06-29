require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const port = process.env.PORT || 5000;

//DB Connection
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to DataBaase"));

app.use(cors());

app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb', extended: true}));

//Routes

const authRouter = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const gameRoute = require("./routes/gameRoute");
const statRoute = require("./routes/statRoute");
const UserTeamRoute = require("./routes/UserTeamRoute");
app.use("/api/auth", authRouter);
app.use("/api/users", userRoute);
app.use("/api/games", gameRoute);
app.use("/api/stat", statRoute);
app.use("/api/UserTeam", UserTeamRoute);


//for deploying server & client together.
if (process.env.NODE_ENV === "production") {
    app.use(express.static(__dirname + '/build'));
    app.get('/*', (req, res) => {
      res.sendFile(__dirname + '/build/index.html');
    });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
