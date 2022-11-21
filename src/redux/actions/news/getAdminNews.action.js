import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetAdminNews = {
  getAdminNews: { data: [], loading: false, error: null, count: 0 },
};

export const getAdminNews = createAsyncThunk('news/getAdminNews', async ({ page = 1, search = '', type }, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(
      `${process.env.REACT_APP_SERVER_API}/news/list`,

      {
        params: { page, search, type },
      },
    )
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      console.log(res);
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetAdminNews = {
  [getAdminNews.pending]: (state) => {
    state.getAdminNews.loading = true;
  },
  [getAdminNews.fulfilled]: (state, action) => {
    state.getAdminNews.loading = false;
    state.getAdminNews.data = action.payload.list;
    state.getAdminNews.count = action.payload.count;
    // if (current(state.getAdminNews.data)?.length !== 0) {
    //   state.getAdminNews.data = [...current(state.getAdminNews.data), ...action.payload];
    // } else {
    //   state.getAdminNews.data = action.payload;
    // }

    state.getAdminNews.error = null;
  },
  [getAdminNews.rejected]: (state, action) => {
    state.getAdminNews.loading = false;
    state.getAdminNews.error = action.payload;
  },
};
