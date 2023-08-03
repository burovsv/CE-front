import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetArticlesUser = {
    getArticlesUser: { data: null, loading: false, error: null },
  };

  export const getArticlesUser = createAsyncThunk('article/user/list', async (data, { rejectWithValue, fulfillWithValue }) => {
    return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/article/user/list`)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});
  

  export const reducerGetArticlesUser = {
    [getArticlesUser.pending]: (state) => {
      state.getArticlesUser.loading = true;
    },
    [getArticlesUser.fulfilled]: (state, action) => {
      state.getArticlesUser.loading = false;
      state.getArticlesUser.data = action.payload;
      state.getArticlesUser.error = null;
    },
    [getArticlesUser.rejected]: (state, action) => {
      state.getArticlesUser.loading = false;
      state.getArticlesUser.error = action.payload;
    },
  };