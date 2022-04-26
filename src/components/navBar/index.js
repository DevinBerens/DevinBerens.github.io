import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { apiKey, moviePath, smallImagePath } from "../global/utils";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

let NavBar = (props) => {
  const { movieClick } = props;
  let [showSearch, setShowSearch] = useState(false);
  let [isSearch, setIsSearch] = useState(false);
  let [searchResults, setSearchResults] = useState([]);

  let handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (e.target[0].value) {
      fetch(
        `${moviePath}search/movie?api_key=${apiKey}&language=en-US&page=1&include_adult=false&query=${e.target[0].value}`
      )
        .then((response) => response.json())
        .then((data) => {
          setSearchResults(data.results);
          setIsSearch(true);
        })
        .catch((err) => console.log(err));
    } else {
      setSearchResults([]);
      setIsSearch(true);
    }
  }, []);

  let toggleSearch = useCallback(() => {
    setShowSearch(!showSearch);
    setSearchResults([]);
    setIsSearch(false);
  }, [showSearch]);

  let clickMovie = useCallback(
    (movie) => {
      movieClick(movie);
      setShowSearch(false);
      setIsSearch(false);
      setSearchResults([]);
    },
    [movieClick]
  );

  return (
    <div className="navBar">
      <Link
        to="/"
        className="navItem"
        style={{
          borderBottom:
            window.location.pathname === "/" ? "2px solid #5a18c9" : "none",
        }}
      >
        Home
      </Link>
      <Link
        to="/favorites"
        className="navItem"
        style={{
          borderBottom:
            window.location.pathname === "/favorites"
              ? "2px solid #5a18c9"
              : "none",
        }}
      >
        Favorite Movies
      </Link>
      <Link
        to="/popular"
        className="navItem"
        style={{
          borderBottom:
            window.location.pathname === "/popular"
              ? "2px solid #5a18c9"
              : "none",
        }}
      >
        Popular Movies
      </Link>
      <Link
        to="/upcoming"
        className="navItem"
        style={{
          borderBottom:
            window.location.pathname === "/upcoming"
              ? "2px solid #5a18c9"
              : "none",
        }}
      >
        Upcoming Movies
      </Link>
      <div className="rightNav">
        <FontAwesomeIcon
          className="search"
          onClick={toggleSearch}
          icon={faSearch}
        />
      </div>
      {showSearch && (
        <div className="searchPopover">
          <form onSubmit={handleSubmit}>
            <input className="searchInput" placeholder="Find a Movie" />
            <button className="searchSubmit" type="submit">
              Search
            </button>
          </form>
          {searchResults.length ? (
            <div className="searchResults">
              {searchResults.map((movie, i) => (
                <div
                  className="searchResult"
                  onClick={clickMovie.bind(this, movie)}
                  key={i}
                >
                  <img
                    className="moviePoster"
                    src={`${smallImagePath}${movie.poster_path}`}
                    alt="movie poster"
                  />
                  <div>
                    <div className="resultTitle">{movie.title}</div>
                    <div className="resultRating">
                      <FontAwesomeIcon
                        className="movieRatingIcon"
                        icon={solid("star")}
                      />{" "}
                      {movie.vote_average}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : isSearch ? (
            <div className="searchResults">No Movies Found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default NavBar;
