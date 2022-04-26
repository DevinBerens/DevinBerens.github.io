import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { bigImagePath, imagePath } from "../global/utils";
import { findIndex } from "lodash";

let MoviePopover = (props) => {
  const { closePopover, clickedMovie, toggleFavorite, favoriteMovies } = props;

  return (
    <div
      className="moviePopover"
      style={{
        top: `${window.innerHeight / 8}px`,
        left:
          window.innerWidth >= 1000
            ? `${window.innerWidth / 2 - 500}px`
            : `25px`,
        width:
          window.innerWidth >= 1000 ? `1000px` : `${window.innerWidth - 50}px`,
        height: `${window.innerHeight - window.innerHeight / 4}px`,
      }}
    >
      <div className="popoverWrapper">
        <FontAwesomeIcon
          className="closePopover"
          onClick={closePopover}
          icon={solid("x")}
        />
        <div className="posterWrapper">
          <img
            className="moviePoster"
            src={`${window.innerWidth >= 1000 ? bigImagePath : imagePath}${
              clickedMovie.poster_path
            }`}
            alt="movie poster"
          />
        </div>
        <div className="popoverBody">
          <h2 className="movieTitle">{clickedMovie.title}</h2>
          <div className="popoverFooter">
            <button
              className="footerButton"
              style={{
                width: window.innerWidth >= 1000 ? "30%" : "50%",
              }}
              onClick={toggleFavorite.bind(this, clickedMovie)}
            >
              <FontAwesomeIcon
                icon={
                  findIndex(favoriteMovies, (m) => m.id === clickedMovie.id) >
                  -1
                    ? solid("heart")
                    : regular("heart")
                }
                className="favoritesHeart"
              />
              <div>
                {findIndex(favoriteMovies, (m) => m.id === clickedMovie.id) > -1
                  ? "Remove "
                  : "Add "}
                Movie
              </div>
            </button>
            <button
              className="footerButton"
              style={{
                width: window.innerWidth >= 1000 ? "30%" : "45%",
              }}
            >
              <a
                href={`https://www.youtube.com/watch?v=${clickedMovie.trailer?.key}`}
                className="trailerLink"
                target="_blank"
                rel="noreferrer"
              >
                Watch Trailer
              </a>
            </button>
          </div>
          <div className="ft18">
            <b>Directed by:</b> {clickedMovie.director?.name}
          </div>
          <div className="ft18">
            <b>Genre:</b>{" "}
            {clickedMovie.genres.map(
              (genre, i) =>
                `${genre.name}${i + 1 < clickedMovie.genres.length ? ", " : ""}`
            )}
          </div>
          <div className="ft18">
            <b>Rating:</b> {clickedMovie.vote_average}
          </div>
          <div className="ft18">
            <b>Release Date:</b> {clickedMovie.release_date}
          </div>
          <div className="ft18">
            <b>Overview:</b> {clickedMovie.overview}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePopover;
