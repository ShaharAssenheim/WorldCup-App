import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import "./Game.css";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  img1: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(1),
    marginRight: "auto",
    marginLeft: "1em",
    width: "15%",
    "@media (max-width: 450px)": {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(2),
    },
  },
  img2: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(1),
    marginLeft: "auto",
    marginRight: "1em",
    width: "15%",
    "@media (max-width: 450px)": {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(1),
    },
  },
  main: {
    backgroundColor: "white",
    color: "black",
    opacity:"0.8",
    boxShadow:"0 0 30px 30px white",
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
  score: {
    textAlign: "center",
  },
  real:{
    textAlign: "center",
  }
}));

const Game = ({
  Game_Id,
  Team1,
  Team2,
  Team1_img,
  Team2_img,
  Time,
  Date,
  Location,
  RealVal1,
  RealVal2
}) => {
  const [Val1, setVal1] = useState(RealVal1);
  const [Val2, setVal2] = useState(RealVal2);
  const [Dis, setDisabled] = useState(true);
  const classes = useStyles();

  const Save = async () => {
    const API =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_Server_ADDRESS_Production
        : process.env.REACT_APP_Server_ADDRESS;

    await fetch(API + "/games/GameUpdate", {
      method: "PUT",
      body: JSON.stringify({
        GameID: Game_Id,
        Team1: Val1,
        Team2: Val2,
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
      setDisabled(false);

    } else {
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
              </div>
              <div>
                <Typography className={classes.vs}>X</Typography>
              </div>
              <div>
                <TextField
                  id="outlined-basic"
                  label=""
                  variant="outlined"
                  onChange={(e) => {
                    setVal2(e.target.value.replace(/[^0-9]/g, ""));
                    //Save();
                  }}
                  value={Val2}
                  className={classes.txt}
                  disabled={Dis}
                  inputProps={{
                    style: {
                      padding: 9,
                      textAlign: "center",
                    },
                  }}
                />
              </div>
              <img src={Team2_img} alt={""} className={classes.img2} />
            </Grid>
          </div>
        </Container>
      </Grid>
    </Box>
  );
};

export default Game;
