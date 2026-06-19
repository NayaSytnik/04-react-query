import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import css from './App.module.css';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.trim().length > 0,
    placeholderData: (prev) => prev,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  const handleSearch = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      toast.error('Please enter search query');
      return;
    }

    setQuery(trimmed);
    setPage(1);
  };

  return (
    <div>
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isError && query && movies.length === 0 && (
        <p>No movies found</p>
      )}

      {!isLoading && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      <Toaster />
    </div>
  );
}