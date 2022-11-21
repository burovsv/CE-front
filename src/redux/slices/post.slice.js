import { createSlice } from '@reduxjs/toolkit';
import { initStateGetPosts, reducerGetPosts } from '../actions/post/getPosts.action';

export const initialState = {
  ...initStateGetPosts,
};

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    resetGetPosts(state) {
      state.getPosts = initStateGetPosts.getPosts;
    },
  },
  extraReducers: {
    ...reducerGetPosts,
  },
});
export const { resetGetPosts } = postSlice.actions;
export const postReducer = postSlice.reducer;
