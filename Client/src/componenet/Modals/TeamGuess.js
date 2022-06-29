import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Grid from "@material-ui/core/Grid";
import MaterialTable from "@material-table/core";
import "./AddUser.css";
import { Button } from "react-bootstrap";

const useStyles = makeStyles((theme) => ({
  table: {
    margin: theme.spacing(3, 0, 0),
  },
  TeamBtn: {
    backgroundColor: "#7B7D7F",
    color: "White",
    borderColor: "#7B7D7F",
    fontSize: "15px",
    margin: theme.spacing(0.3),
  },
  t1: {
    marginRight: "auto",
    marginLeft: "0",
    marginTop:theme.spacing(1),
  },
  t2: {
    marginLeft: "auto",
    marginRight: "0",
    marginTop:theme.spacing(1),
  },
  vs: {
    marginTop:theme.spacing(1),
  },
  img1: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(1),
    marginRight: "auto",
    marginLeft: "1em",
    width: "10%",
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
    width: "10%",
    "@media (max-width: 450px)": {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(1),
      width: "17%",
    },
  },
}));

const ModalStyle = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
};

const TeamGuess = ({
  ItsOpen,
  handleClose,
  UserTeams,
  GameID,
  Team1,
  Team2,
  Team1_img,
  Team2_img,
}) => {
  const [users, setUsers] = useState([]);
  const [chosenTeam, setchosenTeam] = useState("");
  const classes = useStyles();

  const GetUsers = async (Name) => {
    setchosenTeam(Name);
    const API =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_Server_ADDRESS_Production
        : process.env.REACT_APP_Server_ADDRESS;
    await fetch(API + "/users/UsersBets/" + Name + "_" + GameID)
      .then((response) => response.json())
      .then((responseJSON) => {
        var newArray = responseJSON.filter(function (el) {
          console.log(el);
          return el.UserTeams.includes(Name);
        });
        setUsers(newArray);
      });
  };

  const Close = () => {
    setchosenTeam("");
    handleClose();
  };

  const columns = [
    {
      title: "",
      field: "Profile_img",
      width: "0",
      editable: "never",
      render: (rowData) => (
        <img className="TableProfileImg" src={rowData.Profile_img} alt="" />
      ),
    },
    { title: "Name", field: "Name" },
    { title: "Score", field: "Bet" },
    { title: "Points", field: "Score" },
  ];

  return (
    <Modal
      open={ItsOpen}
      onClose={Close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={ModalStyle}>
        <Grid container>
          <img src={Team1_img} alt={""} className={classes.img1} />
          <Typography className={classes.t1}>{Team1}</Typography>
          <Typography className={classes.vs}>---</Typography>
          <Typography className={classes.t2}>{Team2}</Typography>
          <img src={Team2_img} alt={""} className={classes.img2} />
        </Grid>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Your Teams
        </Typography>
        {UserTeams === undefined
          ? null
          : UserTeams.map((Name) => (
              <Button
                key={Name}
                className={classes.TeamBtn}
                onClick={() => GetUsers(Name)}
              >
                {Name}
              </Button>
            ))}
        {chosenTeam !== "" ? (
          <MaterialTable
            title="Users"
            data={users}
            columns={columns}
            options={{
              headerStyle: {
                textAlign: "center",
                backgroundColor: "#B0B0B0",
                color: "black",
                fontWeight: "Bold",
              },
              cellStyle: { textAlign: "left" },
              search: false,
              rowStyle: {},
              paging: false,
              actionsColumnIndex: -1,
            }}
          />
        ) : null}
      </Box>
    </Modal>
  );
};

export default TeamGuess;
