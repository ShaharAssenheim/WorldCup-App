import React, { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import "./UserTeamTable.css";

const UserTeamTable = ({TeamName, Players, Teams, Email}) => {
  const [users, setUsers] = useState([]);

  const GetUsers = async () => {
    const API =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_Server_ADDRESS_Production
        : process.env.REACT_APP_Server_ADDRESS;

    await fetch(API + "/users/")
      .then((response) => response.json())
      .then((responseJSON) => {
        var newArray = responseJSON.filter(function (el) {
          return el.UserTeams.includes(TeamName.rowData.Name);
        });
        setUsers(newArray);
      });
  };

  const DeleteUser = async (data) => {
    const API =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_Server_ADDRESS_Production
        : process.env.REACT_APP_Server_ADDRESS;

    await fetch(API + "/UserTeam/DeleteUser/"+data.Email, {
      method: "PUT",
      body: JSON.stringify({
        Email: data.Email,
        Team: TeamName.rowData.Name,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          window.location.reload(false);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    GetUsers();
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  const columns = [
    { title: '', field: 'imageUrl', width:'0', editable:'never', render: rowData => <img className="TableProfileImg" src={rowData.Profile_img} alt="" />},
    { title: "Name", field: "UserName" },
    { title: "Score", field: "Score" }, 
    { title: 'Win Team', field: 'imageUrl', width:'0', editable:'never', render: rowData => <img className="TableImg" src={Teams.find((x) => x.Team === rowData.Team).Img_Url} alt="" />},
    { title: 'Top Scorrer', field: 'imageUrl', width:'0', editable:'never', render: rowData => <img className="TableImg" src={Players.find((x) => x.Name === rowData.Player).Img} alt="" />},
    
];

  return (
    <Box  display="flex" justifyContent="center" alignItems="center">
      <Grid item>
        <Container component="main"  >
          <CssBaseline />
          <MaterialTable
            title="Users"
            data={users}
            columns={columns}
            options={{
                headerStyle: {
                textAlign:'center',
                backgroundColor: "#B0B0B0",
                color: "black",
                fontWeight:"Bold",
 
              },
              cellStyle: {textAlign:'left'},    
              search:false,
              rowStyle: {},
              paging: false,
              actionsColumnIndex: -1,
            }}
            actions={[
              (rowData) => ({
                icon: "delete",
                tooltip: "Delete",
                onClick: (event, rowData) => DeleteUser(rowData),
                disabled: TeamName.rowData.Admin!==Email
              }),
            ]}
          />
        </Container>
      </Grid>
    </Box>
  );
};

export default UserTeamTable;
