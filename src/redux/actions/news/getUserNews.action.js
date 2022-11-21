import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetUserNews = {
  getUserNews: { data: null, loading: false, error: null },
};

export const getUserNews = createAsyncThunk('news/getUserNews', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/news/user/${data?.newsFilterId}`, {
      params: { newsTypeId: data?.newsTypeId, page: data?.page },
    })
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      console.log(res);
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetUserNews = {
  [getUserNews.pending]: (state) => {
    state.getUserNews.loading = true;
  },
  [getUserNews.fulfilled]: (state, action) => {
    state.getUserNews.loading = false;
    state.getUserNews.data = action.payload.list;
    state.getUserNews.count = action.payload.count;

    state.getUserNews.error = null;
  },
  [getUserNews.rejected]: (state, action) => {
    state.getUserNews.loading = false;
    state.getUserNews.error = action.payload;
  },
};
