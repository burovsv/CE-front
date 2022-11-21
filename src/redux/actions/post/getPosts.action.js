import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetPosts = {
  getPosts: { data: [], loading: false, error: null },
};

export const getPosts = createAsyncThunk('newsType/getPosts', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/post/list`)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetPosts = {
  [getPosts.pending]: (state) => {
    state.getPosts.loading = true;
  },
  [getPosts.fulfilled]: (state, action) => {
    state.getPosts.loading = false;
    state.getPosts.data = action.payload;
    state.getPosts.error = null;
  },
  [getPosts.rejected]: (state, action) => {
    state.getPosts.loading = false;
    state.getPosts.error = action.payload;
  },
};
