import React, { useState, useEffect, useCallback } from "react";
import { Route, Routes } from "react-router-dom";
import loadable from "@loadable/component";
import Header from "./components/header";
import "./App.css";
import { moviePath, apiKey } from "./components/global/utils";
import { find, findIndex } from "lodash";

let Home = loadable(() => import("./components/home"));
let Favorites = loadable(() => import("./components/favorites"));
let Popular = loadable(() => import("./components/popular"));
let Upcoming = loadable(() => import("./components/upcoming"));

function App() {
  let [popularMovies, setPopularMovies] = useState([]);
  let [favoriteMovies, setFavoriteMovies] = useState([]);
  let [upcomingMovies, setUpcomingMovies] = useState([]);
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
  }, [setMoviePopover, setClickedMovie]);

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

  let fetchMovies = useCallback(() => {
    let urls = [
      `${moviePath}movie/popular?api_key=${apiKey}&language=en-US&page=1`,
      `${moviePath}movie/upcoming?api_key=${apiKey}&language=en-US&page=1`,
    ];
    Promise.all(urls.map((url) => fetch(url)))
      .then((responses) =>
        Promise.all(responses.map((response) => response.json()))
      )
      .then((data) => {
        localStorage.removeItem("popularMovies");
        localStorage.removeItem("upcomingMovies");
        localStorage.setItem("popularMovies", JSON.stringify(data[0].results));
        localStorage.setItem("upcomingMovies", JSON.stringify(data[1].results));
        setPopularMovies(data[0].results);
        setUpcomingMovies(data[1].results);
      })
      .catch((err) => {
        console.log(err, "error calling backend API");
      });
  }, []);

  let showMore = useCallback(
    (title) => {
      let category = title.split(" ")[0].toLowerCase();
      let page = 2;
      if (category === "popular") {
        page = popularMovies.length / 20 + 1;
      } else if (category === "upcoming") {
        page = upcomingMovies.length / 20 + 1;
      }
      fetch(
        `${moviePath}movie/${category}?api_key=${apiKey}&language=en-US&page=${page}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (category === "popular") {
            localStorage.removeItem("popularMovies");
            localStorage.setItem(
              "popularMovies",
              JSON.stringify([...popularMovies, ...data.results])
            );
            setPopularMovies([...popularMovies, ...data.results]);
          } else if (category === "upcoming") {
            localStorage.removeItem("upcomingMovies");
            localStorage.setItem(
              "upcomingMovies",
              JSON.stringify([...upcomingMovies, ...data.results])
            );
            setUpcomingMovies([...upcomingMovies, ...data.results]);
          }
        })
        .catch((err) => console.log(err));
    },
    [popularMovies, upcomingMovies]
  );

  useEffect(() => {
    let myPopularMovies = localStorage.getItem("popularMovies");
    let myFavoriteMovies = localStorage.getItem("favoriteMovies");
    let myUpcomingMovies = localStorage.getItem("upcomingMovies");
    myPopularMovies = JSON.parse(myPopularMovies);
    myFavoriteMovies = JSON.parse(myFavoriteMovies);
    myUpcomingMovies = JSON.parse(myUpcomingMovies);
    (myFavoriteMovies || []).length && setFavoriteMovies(myFavoriteMovies);
    (myPopularMovies || []).length && setPopularMovies(myPopularMovies);
    (myUpcomingMovies || []).length && setUpcomingMovies(myUpcomingMovies);
    if (!(myPopularMovies || myUpcomingMovies || []).length) {
      fetchMovies();
    }
  }, [fetchMovies]);

  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          exact={true}
          element={
            <Home
              popularMovies={popularMovies}
              favoriteMovies={favoriteMovies}
              upcomingMovies={upcomingMovies}
              movieClick={movieClick}
              moviePopover={moviePopover}
              clickedMovie={clickedMovie}
              toggleFavorite={toggleFavorite}
              closePopover={closePopover}
              showMore={showMore}
            />
          }
        />
        <Route
          path="/favorites"
          exact={true}
          element={
            <Favorites
              favoriteMovies={favoriteMovies}
              movieClick={movieClick}
              moviePopover={moviePopover}
              clickedMovie={clickedMovie}
              toggleFavorite={toggleFavorite}
              closePopover={closePopover}
            />
          }
        />
        <Route
          path="/popular"
          exact={true}
          element={
            <Popular
              popularMovies={popularMovies}
              favoriteMovies={favoriteMovies}
              movieClick={movieClick}
              moviePopover={moviePopover}
              clickedMovie={clickedMovie}
              toggleFavorite={toggleFavorite}
              closePopover={closePopover}
              showMore={showMore}
            />
          }
        />
        <Route
          path="/upcoming"
          exact={true}
          element={
            <Upcoming
              upcomingMovies={upcomingMovies}
              favoriteMovies={favoriteMovies}
              movieClick={movieClick}
              moviePopover={moviePopover}
              clickedMovie={clickedMovie}
              toggleFavorite={toggleFavorite}
              closePopover={closePopover}
              showMore={showMore}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
