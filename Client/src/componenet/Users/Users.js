import React, { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import "./Users.css";

const Users = ({Email, Players, Teams}) => {
  const [users, setUsers] = useState([]);

  const GetUsers = async () => {
    const API =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_Server_ADDRESS_Production
        : process.env.REACT_APP_Server_ADDRESS;

    await fetch(API + "/users/")
      .then((response) => response.json())
      .then((responseJSON) => {
        setUsers(responseJSON);
      });
  };

  useEffect(() => {
    GetUsers();
  }, []);

  const addUser = async (newData) => {
    const API =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_Server_ADDRESS_Production
      : process.env.REACT_APP_Server_ADDRESS;

    await fetch(API + "/api/users", {
      method: "POST",
      body: JSON.stringify({
        UserName: newData.UserName,
        Email: newData.Email,
        Password: "1234",
        Team: newData.Team,
        Player: newData.Player,
        Profile_img: null
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) this.GetUsers();
      })
      .catch((err) => console.error(err));
  };

  const DeleteUser = (id) => {
    const API =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_Server_ADDRESS_Production
        : process.env.REACT_APP_Server_ADDRESS;

    fetch(API + "/users/Delete/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) 
          window.location.reload();

      })
      .catch((err) => console.error(err));
  };

  //const data = this.state.details[0];

  const columns = [
    { title: '', field: 'imageUrl', width:'0', editable:'never', render: rowData => <img src={rowData.Profile_img} alt="" style={{ width: 40, borderRadius: '50%' }} />},
    { title: "Name", field: "UserName" },
    { title: "Email", field: "Email"},
    { title: '', field: 'imageUrl', width:'0', editable:'never', render: rowData => <img src={Teams.find((x) => x.Team === rowData.Team).Img_Url} alt="" style={{ width: 40, borderRadius: '50%' }} />},
    { title: "Team", field: "Team"},
    { title: '', field: 'imageUrl', width:'0', editable:'never', render: rowData => <img src={Players.find((x) => x.Name === rowData.Player).Img} alt="" style={{ width: 40, borderRadius: '50%' }} />},
    { title: "Player", field: "Player" },
  ];

  return (
    <Box mt={13} display="flex" justifyContent="center" alignItems="center">
      <Grid item xs={12} md={12} lg={12}>
        <Container component="main"  >
          <CssBaseline />
          <MaterialTable
            title="Users"
            data={users}
            columns={columns}
            options={{
              exportButton: true,
              headerStyle: {
                backgroundColor: "#B0B0B0",
                color: "black",
         
              },
              rowStyle: {},
              pageSize: 10,
              pageSizeOptions: [5, 10, 20, 30, 50, 75],
            }}

            editable={Email==="shacharassen3667@gmail.com"?{
              onRowAdd: (newData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    addUser(newData);
                    resolve();
                  }, 1000);
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    DeleteUser(oldData.Email);
                    resolve();
                  }, 1000);
                }),
            }:null}
          />
        </Container>
      </Grid>
    </Box>
  );
};

export default Users;
