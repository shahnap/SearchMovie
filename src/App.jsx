import axios from 'axios';
import React, { useEffect, useState } from 'react';

function App() {
  const [movies, setMovies] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      const options = {
        method: 'GET',
        url: 'https://moviesdatabase.p.rapidapi.com/titles',
        headers: {
          'X-RapidAPI-Key': 'db8afc12acmshda7ba777f250a17p1b02edjsnd6cabac8b3ea',
          'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        setMovies(response.data.results);
        console.log(response.data);
      } catch (error) {
        if (error.response && error.response.status === 429) {
          console.error('Rate limit exceeded. Retrying...');
          const retryAfter = error.response.headers['retry-after'] || 1;
          setTimeout(() => {
            setRetryCount(retryCount + 1);
          }, retryAfter * 1000); // Convert retryAfter to milliseconds
        } else {
          console.error(error);
        }
      }
    };

    fetchMovies();
  }, [retryCount]);


  const filteredMovies = movies.filter(movie =>
    movie.titleText.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='bg-black min-h-screen'>
      <div className='w-full justify-center flex'>
        <b className='text-2xl text-white'>Search Your Movie</b>
      </div>
      <div className='text-red-500'>
        <form className="max-w-md mt-5 mx-auto">
          <label 
            htmlFor="default-search" 
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg 
                className="w-4 h-4 text-gray-500 dark:text-gray-400" 
                aria-hidden="true" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 20 20"
              >
                <path 
                  stroke="currentColor" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input 
              type="search" 
              id="default-search" 
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              placeholder="Search Mockups, Logos..." 
              value={searchTerm} // Step 2: Set the value of the input field
              onChange={e => setSearchTerm(e.target.value)}
              required 
            />
            <button 
              type="submit" 
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      <div className='text-white flex flex-wrap justify-center mt-5'>
        {filteredMovies.map(movie => (
          <div key={movie.id} className='m-4'>
            <img src={movie.primaryImage ? movie.primaryImage.url : 'https://via.placeholder.com/226x300'} alt={movie.titleText.text} className='w-56 h-80 object-cover' />
            <p className='mt-2 text-center'>{movie.titleText.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
