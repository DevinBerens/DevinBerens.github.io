import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import loadable from "@loadable/component";
import Header from "./components/header";
import "./App.css";
import { moviePath, apiKey } from "./components/global/utils";

let Home = loadable(() => import("./components/home"));

function App() {
  let [popularMovies, setPopularMovies] = useState([]);
  let [favoriteMovies, setFavoriteMovies] = useState([]);

  useEffect(() => {
    let myPopularMovies = localStorage.getItem("popularMovies");
    let myFavoriteMovies = localStorage.getItem("favoriteMovies");
    myPopularMovies = JSON.parse(myPopularMovies);
    myFavoriteMovies = JSON.parse(myFavoriteMovies);
    console.log(myFavoriteMovies, myPopularMovies);
    (myFavoriteMovies || []).length && setFavoriteMovies(myFavoriteMovies);
    (myPopularMovies || []).length && setPopularMovies(myPopularMovies);
    if (!(myPopularMovies || []).length) {
      console.log("calling fetch");
      fetch(`${moviePath}movie/popular?api_key=${apiKey}&language=en-US&page=1`)
        .then((response) => response.json())
        .then((data) => {
          localStorage.removeItem("popularMovies");
          localStorage.setItem("popularMovies", JSON.stringify(data.results));
          console.log("setting data", data.results);
          setPopularMovies(data.results);
        })
        .catch((err) => {
          console.log(err, "error calling backend API");
        });
    }
  }, [setPopularMovies, setFavoriteMovies]);

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
              setFavoriteMovies={setFavoriteMovies}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
