import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  movies: [],
  loading: false,
  error: null,
};

// Thunk for searching movies using Axios
export const searchMovies = createAsyncThunk(
  'searchMovies/searchMovies',
  async (params, { rejectWithValue }) => {
    try {
      // Construct the URL with proper query params
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: params?.api_key,
          query: params?.query,  // Assuming 'query' is the movie name or keyword
        },
      });
      return response.data;  // Return the data which contains 'results'
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return rejectWithValue(error.message || 'An error occurred');  // Returning error message to reject action
    }
  }
);

const searchMoviesSlice = createSlice({
  name: 'searchMovies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload?.results || [];  // Save results from API response
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;  // Store the error message in state
      });
  },
});

export default searchMoviesSlice.reducer;
