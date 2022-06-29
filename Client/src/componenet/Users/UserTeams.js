import React, { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import "./UserTeamTable.css";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { FaPlus } from "react-icons/fa";
import UserTeamTable from "../Users/UserTeamTable";
import ShareIcon from "@material-ui/icons/Share";
import PersonAddAltIcon from "@material-ui/icons/GroupAdd";
import AddTeam from "../Modals/AddTeam";
import AddUser from "../Modals/AddUser";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  btn: {
    margin: theme.spacing(3, 0, 2),
    background: "#B0B0B0",
  },
  main: {
    backgroundColor: "rgba(255,255,255,0.6)",
    color: "black",
    "@media (max-width: 450px)": {
      width: "95%",
    },
  },
  btnImg: {
    margin: theme.spacing(3, 0, 0),
  },
}));


const Teams = ({ Email, UTeams, Players, Teams }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [open2, setOpen2] = React.useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);
  const [UserTeams, SetUserTeams] = useState([]);
  const [Current, SetUserCurrent] = useState("");
  const classes = useStyles();

  const GetTeams = async () => {
    const API =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_Server_ADDRESS_Production
        : process.env.REACT_APP_Server_ADDRESS;

    await fetch(API + "/UserTeam/Teams", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        SetUserTeams(responseJSON.filter(value => UTeams.includes(value.Name)));
      });
  };

  const DeleteTeam = (id) => {
    const API =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_Server_ADDRESS_Production
        : process.env.REACT_APP_Server_ADDRESS;

    fetch(API + "/UserTeam/Delete/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) 
        window.location.reload(false);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    GetTeams();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const columns = [
    {
      title: "",
      field: "Img_Url",
      width: "0",
      editable: "never",
      render: (rowData) => (
        <img className="TableProfileImg" src={rowData.Img_Url} alt="" />
      ),
    },
    { title: "", field: "Name" },
  ];

  return (
    <Box mt={10} display="flex" justifyContent="center" alignItems="center">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Container component="main">
          <CssBaseline />
          <div className={classes.paper}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.btn}
              onClick={() => handleOpen()}
            >
              Create Team &nbsp;
              <FaPlus />
            </Button>
            <MaterialTable
              title="Teams"
              data={UserTeams}
              columns={columns}
              detailPanel={(rowData) => {
                return (
                  <UserTeamTable
                    TeamName={rowData}
                    Players={Players}
                    Teams={Teams}
                    Email={Email}
                  />
                );
              }}
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
              actions={[
                {
                  icon: ShareIcon,
                  tooltip: "Send Link",
                  onClick: (event, rowData) =>
                    window.open(
                      "whatsapp://send?text=You have been invited to join the "+rowData.Name+" group In The WorldCup 2022 App. Follow the link https://myworldcup-2022.herokuapp.com/SignUp"
                    ),
                },
                (rowData) => ({
                  icon: PersonAddAltIcon,
                  tooltip: "Add User",
                  onClick: (event, rowData) => {handleOpen2(); SetUserCurrent(rowData.Name);},
                  disabled: rowData.Admin!==Email
                }),
                (rowData) => ({
                  icon: "delete",
                  tooltip: "Delete",
                  onClick: (event, rowData) => DeleteTeam(rowData.Name),
                  disabled: rowData.Admin!==Email
                }),
              ]}
            />
          </div>
        </Container>
      </Grid>
      <AddTeam ItsOpen={open} Email={Email} handleClose={handleClose}/>
      <AddUser ItsOpen={open2} Team={Current} handleClose={handleClose2}/>
    </Box>
  );
};

export default Teams;
