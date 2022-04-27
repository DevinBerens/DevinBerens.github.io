import React from "react";
import { imagePath } from "../global/utils";
import { findIndex } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid, regular } from "@fortawesome/fontawesome-svg-core/import.macro";
import MoviePopover from "./moviePopover";
import NavBar from "../navBar";

let Home = (props) => {
  const {
    popularMovies,
    favoriteMovies,
    upcomingMovies,
    movieClick,
    moviePopover,
    clickedMovie,
    toggleFavorite,
    closePopover,
    showMore,
  } = props;

  return (
    <div className="homeWrapper">
      <NavBar movieClick={movieClick} />
      {[
        ["Favorite Movies", ...(favoriteMovies || [])],
        ["Popular Movies", ...(popularMovies || [])],
        ["Upcoming Movies", ...(upcomingMovies || [])],
      ].map((category, index) => (
        <div className="categoryWrapper" key={index}>
          <h2 className="categoryTitle">{category[0]}</h2>
          {category?.length > 1 ? (
            <div className="movieWrapper">
              {category.map(
                (movie, i) =>
                  i !== 0 && (
                    <div
                      className="movieBody"
                      onClick={movieClick.bind(this, movie)}
                      key={i}
                    >
                      <img
                        className="moviePoster"
                        src={`${imagePath}${movie.poster_path}`}
                        alt="movie poster"
                      />
                      <FontAwesomeIcon
                        icon={
                          findIndex(favoriteMovies, (m) => m.id === movie.id) >
                          -1
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
              {category[0] !== "Favorite Movies" && (
                <div
                  onClick={showMore.bind(this, category[0])}
                  className="showMore"
                >
                  Show More...
                </div>
              )}
            </div>
          ) : (
            <div className="noneFound">No movies found</div>
          )}
        </div>
      ))}
      {moviePopover && (
        <MoviePopover
          closePopover={closePopover}
          clickedMovie={clickedMovie}
          toggleFavorite={toggleFavorite}
          favoriteMovies={favoriteMovies}
        />
      )}
    </div>
  );
};

export default Home;
