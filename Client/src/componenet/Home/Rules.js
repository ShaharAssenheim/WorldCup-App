import React from "react";
import "../App/App.css";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

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
  main: {
    backgroundColor: "rgba(255,255,255,0.6)",
    color: "black",
    "@media (max-width: 450px)": {
      width: "95%",
    },
  },
}));

const Rules = () => {
  const classes = useStyles();
  return (
    <Box mt={10} display="flex" justifyContent="center" alignItems="center">
      <Grid item xs={12} md={6} lg={6}>
        <Container component="main" maxWidth="xs" className={classes.main}>
          <CssBaseline />
          <div className={classes.paper}>
            <Typography  variant="h4">
              Rules
            </Typography>
            <Typography  variant="h6">
            Try to guess in advance the exact result of each game and get a score accordingly.
            </Typography>
          </div>
        </Container>
      </Grid>
    </Box>
  );
};

export default Rules;
