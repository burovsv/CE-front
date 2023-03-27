import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetOneArticle = {
    getOneArticle: { data: null, loading: false, error: null },
  };

  export const getOneArticle = createAsyncThunk('article/oneArticle', async (data, { rejectWithValue, fulfillWithValue }) => {
    return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/article/${data?.id}`)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});
  

  export const reducerGetOneArticle = {
    [getOneArticle.pending]: (state) => {
      state.getOneArticle.loading = true;
    },
    [getOneArticle.fulfilled]: (state, action) => {
      state.getOneArticle.loading = false;
      state.getOneArticle.data = action.payload;
      state.getOneArticle.error = null;
    },
    [getOneArticle.rejected]: (state, action) => {
      state.getOneArticle.loading = false;
      state.getOneArticle.error = action.payload;
    },
  };