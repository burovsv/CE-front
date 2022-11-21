import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateCreateNews = {
  createNews: { data: null, loading: false, error: null },
};

export const createNews = createAsyncThunk('news/createNews', async (formData, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .post(`${process.env.REACT_APP_SERVER_API}/news/create`, formData)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerCreateNews = {
  [createNews.pending]: (state) => {
    state.createNews.loading = true;
  },
  [createNews.fulfilled]: (state, action) => {
    state.createNews.loading = false;
    state.createNews.data = action.payload;
    state.createNews.error = null;
  },
  [createNews.rejected]: (state, action) => {
    state.createNews.loading = false;
    state.createNews.error = action.payload;
  },
};
