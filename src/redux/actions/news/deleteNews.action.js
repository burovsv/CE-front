import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateDeleteNews = {
  deleteNews: { data: null, loading: false, error: null },
};

export const deleteNews = createAsyncThunk('news/deleteNews', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .post(`${process.env.REACT_APP_SERVER_API}/news/delete`, data)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerDeleteNews = {
  [deleteNews.pending]: (state) => {
    state.deleteNews.loading = true;
  },
  [deleteNews.fulfilled]: (state, action) => {
    state.deleteNews.loading = false;
    state.deleteNews.data = action.payload;
    state.deleteNews.error = null;
  },
  [deleteNews.rejected]: (state, action) => {
    state.deleteNews.loading = false;
    state.deleteNews.error = action.payload;
  },
};
