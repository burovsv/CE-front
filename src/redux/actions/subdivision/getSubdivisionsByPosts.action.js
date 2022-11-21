import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetSubdivisionsByPosts = {
  getSubdivisionsByPosts: { data: [], loading: false, error: null },
};

export const getSubdivisionsByPosts = createAsyncThunk('newsType/getSubdivisionsByPosts', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .post(`${process.env.REACT_APP_SERVER_API}/subdivision-by-posts/list`, { postIds: data })
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetSubdivisionsByPosts = {
  [getSubdivisionsByPosts.pending]: (state) => {
    state.getSubdivisionsByPosts.loading = true;
  },
  [getSubdivisionsByPosts.fulfilled]: (state, action) => {
    state.getSubdivisionsByPosts.loading = false;
    state.getSubdivisionsByPosts.data = action.payload;
    state.getSubdivisionsByPosts.error = null;
  },
  [getSubdivisionsByPosts.rejected]: (state, action) => {
    state.getSubdivisionsByPosts.loading = false;
    state.getSubdivisionsByPosts.error = action.payload;
  },
};
