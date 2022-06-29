import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(0, 0, 2),
    width: "50%",
    "@media (max-width: 450px)": {
      width: "70%",
    },
  },
  main: {
    backgroundColor: "rgba(255,255,255,0.6)",
    color: "black",
    "@media (max-width: 450px)": {
      width: "95%",
    },
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  labels: {
    marginBottom: theme.spacing(1),

  },
  disabledInput: {
    "& .MuiInputBase-root.Mui-disabled": {
      color: "black",
    },
  },
  statistic:{
    marginBottom: theme.spacing(1),
    textAlign:"center"
  }
}));

const UserProfile = ({User, Players, Teams}) => {
  const classes = useStyles();

  const UpdateImg = async (base64data) => { 
    const API =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_Server_ADDRESS_Production
        : process.env.REACT_APP_Server_ADDRESS;

    await fetch(API + "/users/Update/"+User.Name, {
      method: "PUT",
      body: JSON.stringify({
        UserName:User.Name,
        Email:User.Email,
        Profile_img: base64data
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          window.location.reload();
        } else {
          //swal("Email Is Already Exist In DB.", "", "warning");
        }
      })
      .catch((err) => console.error(err));
  };

  const uploadPicture = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];

      var reader = new FileReader();
      reader.readAsDataURL(img); 
      reader.onloadend = function() {
        var base64data = reader.result;                
        UpdateImg(base64data);
      }
    }
  };


  return (
    <Box mt={10} display="flex" justifyContent="center" alignItems="center">
      <Grid item xs={12} md={6} lg={6}>
        <Container component="main" maxWidth="xs" className={classes.main}>
          <CssBaseline />
          <div className={classes.paper}>
            <img
              src={User.Profile_img}
              alt={""}
              style={{ width: "40%", borderRadius: "50%", marginTop: 10 }}
            />
            <Typography component="h1" variant="h5" className={classes.title}>
              {User.Name}
            </Typography>
            <Button variant="contained" component="label" color="primary" className={classes.submit}>
                  Change Image
                  <input type="file" hidden onChange={uploadPicture} />
                </Button>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div>
                  <Typography className={classes.labels}>Email</Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="email"
                    name="email"
                    value={User.Email}
                    className={classes.disabledInput}
                    disabled={true}
                  />
                </div>
              </Grid>
              <Grid item xs={12}>
                <div>
                  <Typography className={classes.labels}>
                    Wininig Team
                  </Typography>
                  <TextField
                    className={classes.disabledInput}
                    variant="outlined"
                    fullWidth
                    id="team"
                    name="team"
                    value={User.Team}
                    disabled={true}
                    InputProps={{
                      startAdornment: (
                        <img
                          src={Teams === undefined ? "" : Teams.find((x) => x.Team === User.Team).Img_Url}
                          style={{ width: "10%", marginRight: "5%" }}
                          alt={""}
                        />
                      ),
                    }}
                  />
                </div>
              </Grid>
              <Grid item xs={12}>
                <div>
                  <Typography className={classes.labels}>
                    Wining Scorer
                  </Typography>
                  <TextField
                    className={classes.disabledInput}
                    variant="outlined"
                    fullWidth
                    id="player"
                    name="player"
                    value={User.Player}
                    disabled={true}
                    InputProps={{
                      startAdornment: (
                        <img
                          src={
                            Players === undefined ? "" : Players.find((x) => x.Name === User.Player).Img
                          }
                          style={{ width: "10%", marginRight: "5%" }}
                          alt={""}
                        />
                      ),
                    }}
                  />
                </div>
              </Grid>
              <Grid item xs={12}>
                <div>
                  <Typography className={classes.labels}>Score</Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="score"
                    name="score"
                    inputProps={{min: 0, style: { textAlign: 'center' }}} // the change is here
                    value={User.Score}
                    className={classes.disabledInput}
                    disabled={true}
                  />
                </div>
              </Grid>
              <Grid container item xs={12}>
                <Grid item xs={4} >
                  <Typography className={classes.statistic}>Perfect</Typography>
                  <Typography className={classes.statistic}>{User.Perfect}/64</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.statistic}>Side</Typography>
                  <Typography className={classes.statistic}>{User.Side}/64</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.statistic}>Wrong</Typography>
                  <Typography className={classes.statistic}>{User.Wrong}/64</Typography>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Container>
      </Grid>
    </Box>
  );
};

export default UserProfile;
