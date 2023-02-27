import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetArticles = {
    getArticles: { data: [], loading: false, error: null },
  };

  export const getArticles = createAsyncThunk('article/list', async (data, { rejectWithValue, fulfillWithValue }) => {
    return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/article/list`)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});
  

  export const reducerGetArticles = {
    [getArticles.pending]: (state) => {
      state.getArticles.loading = true;
    },
    [getArticles.fulfilled]: (state, action) => {
      state.getArticles.loading = false;
      state.getArticles.data = action.payload.list;
      state.getArticles.count = action.payload.count;
  
      state.getArticles.error = null;
    },
    [getArticles.rejected]: (state, action) => {
      state.getArticles.loading = false;
      state.getArticles.error = action.payload;
    },
  };