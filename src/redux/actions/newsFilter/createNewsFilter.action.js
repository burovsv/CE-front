import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateCreateNewsFilter = {
  createNewsFilter: { data: null, loading: false, error: null },
};

export const createNewsFilter = createAsyncThunk('newsFilter/createNewsFilter', async ({ name, newsTypeId }, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .post(`${process.env.REACT_APP_SERVER_API}/news-filter/create`, { name, newsTypeId })
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerCreateNewsFilter = {
  [createNewsFilter.pending]: (state) => {
    state.createNewsFilter.loading = true;
  },
  [createNewsFilter.fulfilled]: (state, action) => {
    state.createNewsFilter.loading = false;
    state.createNewsFilter.data = action.payload;
    state.createNewsFilter.error = null;
  },
  [createNewsFilter.rejected]: (state, action) => {
    state.createNewsFilter.loading = false;
    state.createNewsFilter.error = action.payload;
  },
};
