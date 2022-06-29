import React, { useState, useEffect } from "react";
import "./App.css";
import Users from "../Users/Users";
import Header from "../Partials/Header";
import Footer from "../Partials/Footer";
import Home from "../Home/Home";
import SignUp from "../Home/SignUp";
import Login from "../Home/Login";
import Forgot from "../Home/Forgot";
import UserProfile from "../Users/UserProfile";
import GamesUpdate from "../Home/GamesUpdate";
import Groups from "../Statistics/Groups";
import UserTeams from "../Users/UserTeams";
import TopScorrer from "../Statistics/Top_Scorrer";
import Rules from "../Home/Rules";
import { HashLoader } from "react-spinners";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const App = () => {
  const [LoggedUser, setLoggedUser] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [Players, setPlayers] = useState([]);
  const [Teams, setTeams] = useState([]);

  const selectUserName = (user) => {
    setLoggedUser(user);
  };

  const Logout = () => {
    localStorage.setItem("token", "");
    setLoggedUser([]);
  };

  const GetPlayers = async () => {
    const API =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_Server_ADDRESS_Production
        : process.env.REACT_APP_Server_ADDRESS;

    await fetch(API + "/stat/Players", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJSON) => { setPlayers(responseJSON); });
  };

  const GetTeams = async () => {
    const API =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_Server_ADDRESS_Production
        : process.env.REACT_APP_Server_ADDRESS;

    await fetch(API + "/stat/Groups", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        var teams=[];
        responseJSON.forEach(element => {
          element.Teams.forEach(t=>{
            teams.push({"Team":t.Team, "Img_Url":t.Img_Url})
          })
        });
        setTeams(teams);
      });
  };

  const LoggedIn = async () => {
    let auth = localStorage.getItem("token");
    if (auth === null || auth.length < 10) {
      setLoading(false);
      return;
    }
    const API =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_Server_ADDRESS_Production
        : process.env.REACT_APP_Server_ADDRESS;

    fetch(API + "/auth/", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + auth,
      },
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((res) => {
            setLoggedUser(res);
            localStorage.setItem("token", res.data);
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    GetPlayers();
    GetTeams();
    LoggedIn();
    var x=0;
  }, []);

  return (
    <div className="Page-container">
      <div className="content-wrap">
        {Loading ? (
          <div className="spinner">
            <HashLoader loading size={100}/>
          </div>
        ) : (
          <Router>
            <Header name={LoggedUser.Name} Profile_img={LoggedUser.Profile_img} Logout={Logout} email={LoggedUser.Email}/>
            <Routes>
              <Route path="/" element={<Navigate replace to="/Home"/>}/>
              <Route path="/Home" element={<Home UserID={LoggedUser.Email} UserTeams={LoggedUser.UserTeams}/>}/>
              <Route path="/Users" element={<Users Email={LoggedUser.Email} Players={Players} Teams={Teams}/>}/>
              <Route path="/GamesUpdate" element={<GamesUpdate/>}/>
              <Route path="/SignUp" element={<SignUp Players={Players} Teams={Teams}/>}/>
              <Route path="/Login" element={<Login selectUserName={selectUserName}/>}/>
              <Route path="/Forgot" element={<Forgot/>}/>
              <Route path="/Users/:username" element={<UserProfile User={LoggedUser} Players={Players} Teams={Teams}/>}/>
              <Route path="/Groups" element={<Groups/>} />
              <Route path="/Top-Scorrer" element={<TopScorrer Email={LoggedUser.Email} Players={Players}/>}/>
              <Route path="/Teams" element={<UserTeams Email={LoggedUser.Email} UTeams={LoggedUser.UserTeams} Players={Players} Teams={Teams}/>}/>
              <Route path="/Rules" element={<Rules/>} />
            </Routes>
          </Router>
        )}
      </div>
      <Footer />
    </div>
  );
};
export default App;
