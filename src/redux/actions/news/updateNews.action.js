import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateUpdateNews = {
  updateNews: { data: null, loading: false, error: null },
};

export const updateNews = createAsyncThunk('news/updateNews', async (formData, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .post(`${process.env.REACT_APP_SERVER_API}/news/update`, formData)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerUpdateNews = {
  [updateNews.pending]: (state) => {
    state.updateNews.loading = true;
  },
  [updateNews.fulfilled]: (state, action) => {
    state.updateNews.loading = false;
    state.updateNews.data = action.payload;
    state.updateNews.error = null;
  },
  [updateNews.rejected]: (state, action) => {
    state.updateNews.loading = false;
    state.updateNews.error = action.payload;
  },
};
