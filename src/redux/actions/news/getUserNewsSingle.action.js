import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetUserNewsSingle = {
  getUserNewsSingle: { data: [], loading: false, error: null },
};

export const getUserNewsSingle = createAsyncThunk('news/getUserNewsSingle', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/news/user/single/${data?.newsId}`)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      console.log(res);
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetUserNewsSingle = {
  [getUserNewsSingle.pending]: (state) => {
    state.getUserNewsSingle.loading = true;
  },
  [getUserNewsSingle.fulfilled]: (state, action) => {
    state.getUserNewsSingle.loading = false;
    state.getUserNewsSingle.data = action.payload;

    state.getUserNewsSingle.error = null;
  },
  [getUserNewsSingle.rejected]: (state, action) => {
    state.getUserNewsSingle.loading = false;
    state.getUserNewsSingle.error = action.payload;
  },
};
