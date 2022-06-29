import React, { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import CssBaseline from "@material-ui/core/CssBaseline";
import "./Statistics.css";

const Groups = () => {
  const [groups, setGroups] = useState([]);

  const GetGroups = async () => {
    const API =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_Server_ADDRESS_Production
        : process.env.REACT_APP_Server_ADDRESS;

    await fetch(API + "/stat/Groups/", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        setGroups(responseJSON);
      });
  };

  useEffect(() => {
    GetGroups();
  }, []);

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
    { title: "Team", field: "Team" },
    { title: "Score", field: "Score" },
  ];

  return (
    <Box mt={13} ml={5} mr={5} justifyContent="center" alignItems="center">
      <Grid container spacing={8}>
        <CssBaseline />
        {groups.map(({ GroupID, Teams }) => (
          <Grid item key={GroupID} xs={12} sm={6} md={4} lg={3} >
            <MaterialTable
              title={"Group-" + GroupID}
              data={Teams.sort((a, b) => a.Score < b.Score ? 1 : -1)}
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
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Groups;
