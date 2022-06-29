import React from "react";
import * as ReactBootStrap from "react-bootstrap";
import "./Header.css";
import logo from "../../images/logo.png";

const Header = ({ name, Profile_img, Logout, email }) => {
  const Path = "/Users/" + name;

  return (
    <ReactBootStrap.Navbar collapseOnSelect expand="sm" fixed="top">
      <ReactBootStrap.Navbar.Brand href="/Home">
        <img
          src={logo}
          alt={""}
          style={{ width: 25, marginTop: -7, marginLeft: 5, marginRight: 5 }}
        />
        World Cup App
      </ReactBootStrap.Navbar.Brand>
      <ReactBootStrap.Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <ReactBootStrap.Navbar.Collapse id="responsive-navbar-nav">
        {email === "shacharassen3667@gmail.com" ? (
          <ReactBootStrap.Nav className="LeftSide">
            <ReactBootStrap.Nav.Link href="/Users">Users</ReactBootStrap.Nav.Link>
            <ReactBootStrap.Nav.Link href="/Teams">Teams</ReactBootStrap.Nav.Link>
            <ReactBootStrap.Nav.Link className="Link" href="/GamesUpdate">Games Update</ReactBootStrap.Nav.Link>
            <ReactBootStrap.NavDropdown title="Statistics" id="collasible-nav-dropdown">
              <ReactBootStrap.NavDropdown.Item href="/Groups">
                Groups Table
              </ReactBootStrap.NavDropdown.Item>
              <ReactBootStrap.NavDropdown.Item href="/Top-Scorrer">
                Top Scorrer
              </ReactBootStrap.NavDropdown.Item>
            </ReactBootStrap.NavDropdown>
            <ReactBootStrap.Nav.Link href="/Rules">Rules</ReactBootStrap.Nav.Link>
          </ReactBootStrap.Nav>
        ) : (
          <ReactBootStrap.Nav className="LeftSide">
             {name !== undefined ? (  <ReactBootStrap.Nav.Link href="/Teams">Teams</ReactBootStrap.Nav.Link>):null}
            <ReactBootStrap.NavDropdown title="Statistics" id="collasible-nav-dropdown">
              <ReactBootStrap.NavDropdown.Item href="/Groups">
                Groups Table
              </ReactBootStrap.NavDropdown.Item>
              <ReactBootStrap.NavDropdown.Item href="/Top-Scorrer">
                Top Scorrer
              </ReactBootStrap.NavDropdown.Item>
            </ReactBootStrap.NavDropdown>
            <ReactBootStrap.Nav.Link href="/Rules">Rules</ReactBootStrap.Nav.Link>
          </ReactBootStrap.Nav>
        )}
        {name === undefined ? (
          <ReactBootStrap.Nav className="rightSide">
            <ReactBootStrap.Nav.Link eventKey={2} href="/SignUp">
              SingUp
            </ReactBootStrap.Nav.Link>
            <ReactBootStrap.Nav.Link eventKey={2} href="/Login">
              Login
            </ReactBootStrap.Nav.Link>
          </ReactBootStrap.Nav>
        ) : (
          <ReactBootStrap.Nav className="rightSide">
            <ReactBootStrap.Nav.Link eventKey={2} href={Path}>
              <img
                src={Profile_img}
                alt={""}
                style={{
                  width: 35,
                  marginTop: -5,
                  marginLeft: 0,
                  marginRight: 7,
                  borderRadius: "50%",
                }}
              />
              {name}
            </ReactBootStrap.Nav.Link>
            <ReactBootStrap.Nav.Link
              className="logout"
              eventKey={2}
              href="/Home"
              onClick={() => Logout()}
            >
              Logout
            </ReactBootStrap.Nav.Link>
          </ReactBootStrap.Nav>
        )}
      </ReactBootStrap.Navbar.Collapse>
    </ReactBootStrap.Navbar>
  );
};

export default Header;
