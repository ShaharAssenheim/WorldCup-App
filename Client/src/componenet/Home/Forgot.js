import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
//import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  main: {
    backgroundColor: "rgba(255,255,255,0.6)",
    color: "black",
  },
  title: {
    marginBottom:theme.spacing(3),
    }
}));

const Forgot = () => {
  const [Email, setEmail] = useState("");
  const classes = useStyles();
  //const navigate = useNavigate();

  const SendEmail = async () => {
    const API =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_Server_ADDRESS_Production
        : process.env.REACT_APP_Server_ADDRESS;
    await fetch(API + "/auth/Forgot", {
      method: "POST",
      body: JSON.stringify({
        Email: Email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((res) => {
            //selectUserName(Email, res.Name);

            //const Path = "/Users/" + res.Name;
            //navigate(Path);
          });
        }
      })
      .catch((err) => console.error(err));
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
              Forgot Password
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={Email}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => SendEmail()}
            >
              Submit
            </Button>
          </div>
        </Container>
      </Grid>
    </Box>
  );
};

export default Forgot;
