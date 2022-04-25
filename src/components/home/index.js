import React, { useCallback, useState } from "react";
import { imagePath, moviePath, apiKey } from "../global/utils";
import "./home.css";
import { find, findIndex } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid, regular } from "@fortawesome/fontawesome-svg-core/import.macro";
import MoviePopover from "./moviePopover";

let Home = (props) => {
  const { popularMovies, favoriteMovies, setFavoriteMovies } = props;
  let [moviePopover, setMoviePopover] = useState(false);
  let [clickedMovie, setClickedMovie] = useState({});

  let movieClick = useCallback((movie) => {
    let urls = [
      `${moviePath}movie/${movie.id}?api_key=${apiKey}&language=en-US`,
      `${moviePath}movie/${movie.id}/credits?api_key=${apiKey}&language=en-US`,
      `${moviePath}movie/${movie.id}/videos?api_key=${apiKey}&language=en-US`,
    ];
    Promise.all(urls.map((url) => fetch(url)))
      .then((responses) =>
        Promise.all(responses.map((response) => response.json()))
      )
      .then((data) => {
        let director = find(data[1].crew, (item) => {
          return item.job === "Director";
        });
        let trailers = [];
        find(data[2].results, (item) => {
          if (item.type === "Trailer") {
            trailers.push(item);
          }
        });
        let movieDetails = {
          ...data[0],
          director: director,
          trailer: trailers[0],
        };
        console.log(movieDetails);
        setMoviePopover(true);
        setClickedMovie(movieDetails);
      })
      .catch((err) => {
        console.log(err, "error calling backend API");
      });
  }, []);

  let closePopover = useCallback(() => {
    setMoviePopover(false);
    setClickedMovie({});
  }, []);

  let toggleFavorite = useCallback(
    (movie, e) => {
      e.stopPropagation();
      let i = findIndex(favoriteMovies, (m) => {
        return m.id === movie.id;
      });
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
