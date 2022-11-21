import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStategetNewsFilters = {
  getNewsFilters: { data: [], loading: false, error: null },
};

export const getNewsFilters = createAsyncThunk('newsFilter/getNewsFilters', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/news-filter/list`)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducergetNewsFilters = {
  [getNewsFilters.pending]: (state) => {
    state.getNewsFilters.loading = true;
  },
  [getNewsFilters.fulfilled]: (state, action) => {
    state.getNewsFilters.loading = false;
    state.getNewsFilters.data = action.payload;
    state.getNewsFilters.error = null;
  },
  [getNewsFilters.rejected]: (state, action) => {
    state.getNewsFilters.loading = false;
    state.getNewsFilters.error = action.payload;
  },
};
