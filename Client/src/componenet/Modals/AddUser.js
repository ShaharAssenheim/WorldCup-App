import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import swal from "sweetalert";
import MaterialTable from "@material-table/core";
import AddCircle from "@material-ui/icons/AddCircle";
import "./AddUser.css";


const useStyles = makeStyles((theme) => ({
  table: {
    margin: theme.spacing(3, 0, 0),
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
  p: 4,
};

const AddUser = ({ItsOpen, Team, handleClose}) => {
  const [users, setUsers] = useState([]);
  const [FilterdUsers, setFilterdUsers] = useState([]);
  const classes = useStyles();

  const SaveUser = async (data) => {
    if (data.UserName === "") {
      swal("You Must Fill Name", "", "warning");
      return;
    }
    const API =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_Server_ADDRESS_Production
        : process.env.REACT_APP_Server_ADDRESS;

    await fetch(API + "/UserTeam/AddUser/"+data.Email, {
      method: "PUT",
      body: JSON.stringify({
        Email: data.Email,
        TeamName: Team,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          handleClose();
          window.location.reload(false);
        } else {
          swal("User Already In The Team", "", "warning");
        }
      })
      .catch((err) => console.error(err));
  };

  const GetUsers = async () => {
    const API =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_Server_ADDRESS_Production
        : process.env.REACT_APP_Server_ADDRESS;

    await fetch(API + "/users/")
      .then((response) => response.json())
      .then((responseJSON) => {
        setUsers(responseJSON);
        setFilterdUsers(responseJSON);
      });
  };
  
  const FilterUsers = async (val) => {
    let u = users;
    u = u.filter(function(user) {
      return user.UserName.toLowerCase().indexOf(val) !== -1; // returns true or false
    });
    setFilterdUsers(u);
  }

  useEffect(() => {
    GetUsers();
  }, [Team]);

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
    { title: "", field: "UserName" },
  ];

  return (

      <Modal
        open={ItsOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add User - {Team}
          </Typography>
          <TextField
            autoComplete="fname"
            name="teamName"
            variant="outlined"
            fullWidth
            id="teamName"
            label="Name"
            autoFocus
            onChange={(e) => { FilterUsers(e.target.value);}}
            className={classes.table}
          />
          <MaterialTable
              title="Users"
              data={FilterdUsers}
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
              actions={[
                {
                  icon: AddCircle,
                  tooltip: "Add",
            
                  onClick: (event, rowData) =>
                      SaveUser(rowData)
                }
              ]}
            />
        </Box>
      </Modal>
  );
};

export default AddUser;
