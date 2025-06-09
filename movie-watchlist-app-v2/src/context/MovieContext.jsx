// MovieContext.js
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const MovieContext = createContext();
const API_URL = "https://json-server-9c4h.onrender.com/movies";

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // 1. Fetch all movies on load
  useEffect(() => {
    fetchMovies();
  }, []);

  // 2. Update favorites whenever movies change
  useEffect(() => {
    setFavorites(movies.filter((movie) => movie.favorite));
  }, [movies]);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(API_URL);
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const addMovie = async (movie) => {
    try {
      const response = await axios.post(API_URL, movie);
      setMovies((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  const toggleWatched = async (id) => {
    const movie = movies.find((m) => m.id === id);
    if (!movie) return;
    try {
      const updated = { ...movie, watched: !movie.watched };
      await axios.put(`${API_URL}/${id}`, updated);
      setMovies((prev) => prev.map((m) => (m.id === id ? updated : m)));
    } catch (error) {
      console.error("Error toggling watched:", error);
    }
  };

  const toggleFavorite = async (id) => {
    const movie = movies.find((m) => m.id === id);
    if (!movie) return;
    try {
      const updated = { ...movie, favorite: !movie.favorite };
      await axios.put(`${API_URL}/${id}`, updated);
      setMovies((prev) => prev.map((m) => (m.id === id ? updated : m)));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const deleteMovie = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMovies((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        favorites,
        addMovie,
        toggleWatched,
        toggleFavorite,
        deleteMovie,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovie = () => useContext(MovieContext);
