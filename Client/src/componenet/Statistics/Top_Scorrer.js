import MaterialTable from "@material-table/core";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import CssBaseline from "@material-ui/core/CssBaseline";
import "./Statistics.css";
import Container from "@material-ui/core/Container";

const Top_Scorrer = ({ Email, Players }) => {

  const updateGoals = async (newData) => {
    const API =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_Server_ADDRESS_Production
        : process.env.REACT_APP_Server_ADDRESS;

    await fetch(API + "/stat/UpdatePlayers", {
      method: "PUT",
      body: JSON.stringify({
        Name: newData.Name,
        Goals: newData.Goals,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) window.location.reload(false);
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    {
      title: "",
      field: "Img",
      width: "0",
      editable: "never",
      render: (rowData) => (
        <img className="TableProfileImg" src={rowData.Img} alt="" />
      ),
    },
    { title: "Name", editable: "never", field: "Name" },
    { title: "Goals", field: "Goals" },
  ];

  return (
    <Box mt={13} display="flex" justifyContent="center" alignItems="center">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Container component="main">
          <CssBaseline />
          <MaterialTable
            title={"Top Scorrer"}
            data={Players.sort((a, b) => a.Goals < b.Goals ? 1 : -1)}
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
            editable={
              Email === "shacharassen3667@gmail.com"
                ? {
                    onRowUpdate: (newData, oldData) =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          updateGoals(newData);
                          resolve();
                        }, 1000);
                      }),
                  }
                : null
            }
          />
        </Container>
      </Grid>
    </Box>
  );
};

export default Top_Scorrer;
