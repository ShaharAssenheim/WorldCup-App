import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="main-footer">
      <p className="col-sm">
        &copy; All right reserved | Developed By{" "}
        <a href="https://shahar-protfolio.herokuapp.com/" target="_blank">Shahar Assenheim</a> | {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default Footer;
