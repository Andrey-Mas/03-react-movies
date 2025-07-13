import { useState } from "react";
import SearchBar from "./components/SearchBar/SearchBar";
import { fetchMovies } from "./services/movieService";
import type { Movie } from "./types/movie";
import toast, { Toaster } from "react-hot-toast";
import MovieGrid from "./components/MovieGrid/MovieGrid";
import Loader from "./components/Loader/Loader";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import MovieModal from "./components/MovieModal/MovieModal";
import styles from "./App.module.css";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(false);

    try {
      const results = await fetchMovies(query);

      if (results.length === 0) {
        toast.error("No movies found for your request.");
        setMovies([]);
        return;
      }

      setMovies(results);
    } catch {
      setError(true);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };
  console.log("selectedMovie:", selectedMovie);
  return (
    <>
      <div className={styles.app}></div>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {error && <ErrorMessage />}
      {!isLoading && !error && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
}

export default App;
