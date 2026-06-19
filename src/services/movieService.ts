import axios from 'axios';

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
}

export const fetchMovies = async (query: string, page: number) => {
  const { data } = await axios.get<MoviesResponse>(
    'https://api.themoviedb.org/3/search/movie',
    {
      params: {
        api_key: import.meta.env.VITE_TMDB_API_KEY,
        query,
        page,
      },
    }
  );

  return data;
};