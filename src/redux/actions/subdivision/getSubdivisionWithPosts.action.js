import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetSubdivisionsWithPosts = {
  getSubdivisionsWithPosts: { data: [], loading: false, error: null },
};

export const getSubdivisionsWithPosts = createAsyncThunk('newsType/getSubdivisionsWithPosts', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/subdivision/${data?.id}`)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetSubdivisionsWithPosts = {
  [getSubdivisionsWithPosts.pending]: (state) => {
    state.getSubdivisionsWithPosts.loading = true;
  },
  [getSubdivisionsWithPosts.fulfilled]: (state, action) => {
    state.getSubdivisionsWithPosts.loading = false;
    state.getSubdivisionsWithPosts.data = action.payload;
    state.getSubdivisionsWithPosts.error = null;
  },
  [getSubdivisionsWithPosts.rejected]: (state, action) => {
    state.getSubdivisionsWithPosts.loading = false;
    state.getSubdivisionsWithPosts.error = action.payload;
  },
};
