import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSearch } from "@fortawesome/free-solid-svg-icons";

let Header = (props) => {
  let [showSearch, setShowSearch] = useState(false);

  return (
    <div className="header">
      <Link className="leftNav" to="/">
        <FontAwesomeIcon className="logo" icon={faHome} />
      </Link>
      <div className="title">Movie List</div>
      <div className="rightNav">
        <FontAwesomeIcon className="search" icon={faSearch} />
      </div>
    </div>
  );
};

export default Header;
