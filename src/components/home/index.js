import React, { useCallback } from "react";
import { imagePath } from "../global/utils";
import "./home.css";
import { findIndex } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid, regular } from "@fortawesome/fontawesome-svg-core/import.macro";

let Home = (props) => {
  const { popularMovies, favoriteMovies, setFavoriteMovies } = props;

  console.log(props);

  let toggleFavorite = useCallback(
    (movie) => {
      console.log(movie, favoriteMovies);
      let i = findIndex(favoriteMovies, (m) => {
        return m.id === movie.id;
      });
      console.log(i);
      localStorage.removeItem("favoriteMovies");
      if (i > -1) {
        let favList = [
          ...favoriteMovies.slice(0, i),
          ...favoriteMovies.slice(i + 1),
        ];
        localStorage.setItem("favoriteMovies", JSON.stringify(favList));
        setFavoriteMovies(favList);
      } else {
        let favList = [...favoriteMovies.slice(), movie];
        localStorage.setItem("favoriteMovies", JSON.stringify(favList));
        setFavoriteMovies(favList);
      }
    },
    [favoriteMovies, setFavoriteMovies]
  );
  return (
    <div className="homeWrapper">
      {[
        ["Favorite Movies", ...(favoriteMovies || [])],
        ["Popular Movies", ...(popularMovies || [])],
      ].map(
        (category, index) =>
          category?.length > 1 && (
            <div className="categoryWrapper" key={index}>
              <h2 className="categoryTitle">{category[0]}</h2>
              <div className="movieWrapper">
                {category.map(
                  (movie, i) =>
                    i !== 0 && (
                      <div className="movieBody" key={i}>
                        <img
                          className="moviePoster"
                          src={`${imagePath}${movie.poster_path}`}
                          alt="movie poster"
                        />
                        <FontAwesomeIcon
                          icon={
                            findIndex(
                              favoriteMovies,
                              (m) => m.id === movie.id
                            ) > -1
                              ? solid("heart")
                              : regular("heart")
                          }
                          onClick={toggleFavorite.bind(this, movie)}
                          className="favoritesButton"
                        />
                        <div className="movieTitle">{movie.title}</div>
                        <div>
                          <FontAwesomeIcon
                            className="movieRatingIcon"
                            icon={solid("star")}
                          />{" "}
                          {movie.vote_average}
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default Home;
