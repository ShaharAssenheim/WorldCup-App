import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";
import "./Game.css";
import TeamGuess from "../Modals/TeamGuess";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  img1: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(1),
    marginRight: "auto",
    marginLeft: "1em",
    width: "20%",
    "@media (max-width: 450px)": {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(2),
      width: "17%",
    },
  },
  img2: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(1),
    marginLeft: "auto",
    marginRight: "1em",
    width: "20%",
    "@media (max-width: 450px)": {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(1),
      width: "17%",
    },
  },
  main: {
    backgroundColor: "white",
    color: "black",
    opacity: "0.8",
    boxShadow: "0 0 30px 30px white",
    padding: theme.spacing(0, 0, 0),
  },
  txt: {
    margin: theme.spacing(0.5, 0, 0),
    width: "3em",
  },
  grid: {
    alignItems: "center",
    justifyContent: "center",
  },
  vs: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(0.3),
    marginBottom: theme.spacing(1.3),
    width: "10%",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "20px",
    textAlign: "center",
  },
  t1: {
    marginRight: "auto",
    marginLeft: "0",
  },
  t2: {
    marginLeft: "auto",
    marginRight: "0",
    fontSize: "15px",
  },
  GussesBtn: {
    backgroundColor: "#7B7D7F",
    color:"White",
    fontSize: "15px",
    marginTop: theme.spacing(0.3),
  },
  score: {
    textAlign: "center",
  },
  real: {
    textAlign: "center",
  },
  earnd: {
    background: "#62F25D",
  },
}));

const Game = ({
  Game_Id,
  UserID,
  Team1,
  Team2,
  Team1_img,
  Team2_img,
  Time,
  Date,
  Location,
  Score1,
  ScoreX,
  Score2,
  UserVal1,
  UserVal2,
  UserScore,
  RealVal1,
  RealVal2,
  UserTeams
}) => {
  const [Val1, setVal1] = useState(UserVal1);
  const [Val2, setVal2] = useState(UserVal2);
  const [Dis, setDisabled] = useState(true);
  const [Vis, setVisible] = useState(false);
  const [VisPoints, setVisPoints] = useState(false);
  const [Color, setColor] = useState("#62F25D");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const classes = useStyles();

  const Save = async () => {
    if (UserID === undefined) return;
    const API =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_Server_ADDRESS_Production
        : process.env.REACT_APP_Server_ADDRESS;

    await fetch(API + "/games", {
      method: "POST",
      body: JSON.stringify({
        UserID: UserID,
        GameID: Game_Id,
        Team1: Val1,
        Team2: Val2,
        Score: 0,
        Status: "",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          //navigate("/Login");
        } else {
          //swal("Email Is Already Exist In DB.", "", "warning");
        }
      })
      .catch((err) => console.error(err));
  };

  const CheckDis = () => {
    var now = new window.Date();
    var Dateparts = Date.split("/");
    var Timeparts = Time.split(":");
    var d =
      Dateparts[2] +
      "-" +
      Dateparts[1] +
      "-" +
      Dateparts[0] +
      " " +
      Timeparts[0] +
      ":" +
      Timeparts[1] +
      ":00";

    var GameTime = new window.Date(d);

    if (window.Date.parse(now) > window.Date.parse(GameTime)) {
      setDisabled(true);
      setVisible(true);
      if (UserID !== undefined) {
        var color = UserScore === 0 ? "#EE453D" : "#62F25D";
        setColor(color);
        setVisPoints(true);
      }
    } else {
      setDisabled(false);
      setVisible(false);
    }

    if (UserID === undefined) {
      setDisabled(true);
    }
  };

  useEffect(() => {
    Save();
    CheckDis();
  }, [Val1, Val2]);

  return (
    <Box
      mr={1}
      ml={1}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item xs={12} md={6} lg={6}>
        <Container component="main" maxWidth="xs" className={classes.main}>
          <CssBaseline />
          <div className={classes.paper}>
            <Typography>{Date}</Typography>
            <Typography>{Time}</Typography>
            <Typography>{Location}</Typography>
            <Grid container>
              <Typography className={classes.t1}>{Team1}</Typography>
              <Typography className={classes.t2}>{Team2}</Typography>
            </Grid>
            <Grid container className={classes.grid}>
              <img src={Team1_img} alt={""} className={classes.img1} />
              <div>
                {Vis && (
                  <Typography className={classes.real}>{RealVal1}</Typography>
                )}
                <TextField
                  id="outlined-basic"
                  label=""
                  variant="outlined"
                  className={classes.txt}
                  disabled={Dis}
                  onChange={(e) => {
                    setVal1(e.target.value.replace(/[^0-9]/g, ""));
                    // Save();
                  }}
                  value={Val1}
                  inputProps={{
                    style: {
                      padding: 9,
                      textAlign: "center",
                    },
                  }}
                />
                <Typography className={classes.score}>+{Score1}</Typography>
              </div>
              <div>
                {Vis && <Typography className={classes.real}>Real</Typography>}
                <Typography className={classes.vs}>X</Typography>
                <Typography className={classes.score}>+{ScoreX}</Typography>
              </div>
              <div>
                {Vis && (
                  <Typography className={classes.real}>{RealVal2}</Typography>
                )}
                <TextField
                  id="outlined-basic"
                  label=""
                  variant="outlined"
                  disabled={Dis}
                  onChange={(e) => {
                    setVal2(e.target.value.replace(/[^0-9]/g, ""));
                    //Save();
                  }}
                  value={Val2}
                  className={classes.txt}
                  inputProps={{
                    style: {
                      padding: 9,
                      textAlign: "center",
                    },
                  }}
                />
                <Typography className={classes.score}>+{Score2}</Typography>
              </div>

              <img src={Team2_img} alt={""} className={classes.img2} />
            </Grid>
            {VisPoints && (
              <Typography style={{ background: Color }}>
                Earned Points {UserScore}
              </Typography>
            )}
             {VisPoints && (
            <Button className={classes.GussesBtn}   onClick={() => handleOpen()}>Team Guess</Button>
            )}
          </div>
        </Container>
      </Grid>
      <TeamGuess ItsOpen={open} handleClose={handleClose} UserTeams={UserTeams} GameID={Game_Id} Team1={Team1} Team2={Team2} Team1_img={Team1_img} Team2_img={Team2_img}/>
    </Box>
  );
};

export default Game;
