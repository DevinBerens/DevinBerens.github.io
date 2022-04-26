import React from "react";
import { Link } from "react-router-dom";
import "./header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

let Header = (props) => {
  return (
    <div className="header">
      <Link className="leftNav" to="/">
        <FontAwesomeIcon className="logo" icon={faHome} />
      </Link>
      <div className="title">Movie List</div>
    </div>
  );
};

export default Header;
