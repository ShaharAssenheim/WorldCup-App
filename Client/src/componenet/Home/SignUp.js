import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";
import swal from "sweetalert";
import "../App/App.css";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  main: {
    backgroundColor: "rgba(255,255,255,0.6)",
    color: "black",
    "@media (max-width: 450px)": {
      width: "95%",
    },
  },
  title: {
    marginBottom: theme.spacing(2),
  },
}));

const SignUp = ({Players, Teams}) => {
  const [FirstName, setFirst] = useState(""); //should be "" if we want to get userName.
  const [LastName, setLast] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Team, setTeam] = useState("");
  const [Player, setPlayer] = useState("");
  const [Profile, setProfile] = useState(null);
  const classes = useStyles();
  const navigate = useNavigate();

  const SaveUser = async () => {
    if (!handleValidation()) {
      swal("You Must Fill All The Fileds!", "", "warning");
      return;
    }

    const API =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_Server_ADDRESS_Production
        : process.env.REACT_APP_Server_ADDRESS;

    await fetch(API + "/auth/SignUp", {
      method: "POST",
      body: JSON.stringify({
        UserName: FirstName + " " + LastName,
        Email: Email,
        Password: Password,
        Team: Team,
        Player: Player,
        Profile_img: Profile
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          navigate("/Login");
        } else {
          swal("Email Is Already Exist In DB.", "", "warning");
        }
      })
      .catch((err) => console.error(err));
  };

  const handleValidation = () => {
    let formIsValid = true;
    if (FirstName === "") formIsValid = false;
    if (LastName === "") formIsValid = false;
    if (Email === "") formIsValid = false;
    if (Password === "") formIsValid = false;
    if (Team === "") formIsValid = false;
    if (Player === "") formIsValid = false;

    return formIsValid;
  };

  const uploadPicture = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];

      var reader = new FileReader();
      reader.readAsDataURL(img); 
      reader.onloadend = function() {
        var base64data = reader.result;                
        setProfile(base64data);
      }
    }
  };

  return (
    <Box mt={10} display="flex" justifyContent="center" alignItems="center">
      <Grid item xs={12} md={6} lg={6}>
        <Container component="main" maxWidth="xs" className={classes.main}>
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" className={classes.title}>
              Sign up
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={(e) => setFirst(e.target.value)}
                  value={FirstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  onChange={(e) => setLast(e.target.value)}
                  value={LastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={Email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={Password}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  id="Team"
                  options={Teams}
                  classes={{
                    option: classes.option,
                  }}
                  onChange={(event, newValue) => {
                    setTeam(newValue.Team);
                  }}
                  autoHighlight
                  getOptionLabel={(option) => option.Team}
                  renderOption={(option) => (
                    <React.Fragment>
                      <img
                        src={option.Img_Url}
                        alt={""}
                        style={{ width: "10%", marginRight: "20px" }}
                      />
                      {option.Team}
                    </React.Fragment>
                  )}
                  renderInput={(params, data) => (
                    <TextField
                      {...params}
                      label="Team"
                      variant="outlined"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password",
                        style: { paddingLeft: "20px" }, // disable autocomplete and autofill
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  id="Player"
                  options={Players}
                  classes={{
                    option: classes.option,
                  }}
                  onChange={(event, newValue) => {
                    setPlayer(newValue.Name);
                  }}
                  autoHighlight
                  getOptionLabel={(option) => option.Name}
                  renderOption={(option) => (
                    <React.Fragment>
                      <img
                        src={option.Img}
                        alt={""}
                        style={{ width: "10%", marginRight: "20px" }}
                      />
                      {option.Name}
                    </React.Fragment>
                  )}
                  renderInput={(params, data) => (
                    <TextField
                      {...params}
                      label="Top Scorrer"
                      variant="outlined"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password",
                        style: { paddingLeft: "20px" }, // disable autocomplete and autofill
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" component="label" fullWidth>
                  Choose Profile Image
                  <input type="file" hidden onChange={uploadPicture} />
                </Button>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => SaveUser()}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/Login" variant="body2">
                  Already have an account? Login
                </Link>
              </Grid>
            </Grid>
          </div>
        </Container>
      </Grid>
    </Box>
  );
};

export default SignUp;
