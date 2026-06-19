import axios from "axios";
import type { MoviesResponse } from "../types/movie";

const API_KEY = import.meta.env.VITE_TMDB_KEY;

export const fetchMovies = async (query: string, page: number) => {
  const { data } = await axios.get<MoviesResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        api_key: API_KEY,
        query,
        page,
      },
    }
  );

  return data;
};