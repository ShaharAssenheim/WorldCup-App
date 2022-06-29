import React, { useEffect, useState } from "react";
import "../App/App.css";
import GameUpdate from "../Game/GameUp";
import Box from "@material-ui/core/Box";

const GamesUpdate = () => {
  const [AllGames, setAllGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const GetGames = async () => {
    const API =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_Server_ADDRESS_Production
      : process.env.REACT_APP_Server_ADDRESS;

  await fetch(API + "/games/", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((responseJSON) => {
      setAllGames(responseJSON);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    GetGames();
  }, []);

  return isLoading ? <div>wait</div> : (
    <Box mt={10} mr={1} ml={1}>
      {AllGames.map(
        ({
          GameID,
          Team1,
          Team2,
          Team1_img,
          Team2_img,
          Time,
          Date,
          Location,
          Res1,
          Res2
        }) => (
          <GameUpdate
            key={GameID}
            Game_Id={GameID}
            Team1={Team1}
            Team2={Team2}
            Team1_img={Team1_img}
            Team2_img={Team2_img}
            Time={Time}
            Date={Date}
            Location={Location}
            RealVal1={Res1=== null? "" : Res1}
            RealVal2={Res2=== null? "" : Res2}
          />
        )
      )}
    </Box>
  );
};

export default GamesUpdate;
