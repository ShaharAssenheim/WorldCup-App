import React, { useEffect, useState } from "react";
import "../App/App.css";
import Game from "../Game/Game";
import Box from "@material-ui/core/Box";

const Home = ({ UserID, UserTeams }) => {
  const [AllGames, setAllGames] = useState([]);
  const [UserGames, setUserGames] = useState([]);
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
    });
 
  };

  const GetUserGames = async () => {
    if (UserID === ""){
      setIsLoading(false);
      return;
    } 
    const API =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_Server_ADDRESS_Production
        : process.env.REACT_APP_Server_ADDRESS;

    await fetch(API + "/games/" + UserID, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        setUserGames(responseJSON);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    GetGames();
    GetUserGames();
  }, [UserID]);

  return isLoading ? <div>wait</div> : (
    <Box mt={15} mr={1} ml={1}>
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
          Score1,
          ScoreX,
          Score2,
          Res1,
          Res2
        }) => (
          <Game
            key={GameID}
            Game_Id={GameID}
            UserID={UserID}
            Team1={Team1}
            Team2={Team2}
            Team1_img={Team1_img}
            Team2_img={Team2_img}
            Time={Time}
            Date={Date}
            Location={Location}
            Score1={Score1}
            ScoreX={ScoreX}
            Score2={Score2}
            UserVal1={UserGames.length===0 || UserGames.find(x=>x.GameID===GameID).Team1 === null ? '' : UserGames.find(x=>x.GameID===GameID).Team1}
            UserVal2={UserGames.length===0 || UserGames.find(x=>x.GameID===GameID).Team2 === null ? '' : UserGames.find(x=>x.GameID===GameID).Team2}
            UserScore={UserGames.length===0 || UserGames.find(x=>x.GameID===GameID).Score === null ? 0 : UserGames.find(x=>x.GameID===GameID).Score}
            RealVal1={Res1}
            RealVal2={Res2}
            UserTeams={UserTeams}
          />
        )
      )}
    </Box>
  );
};

export default Home;
