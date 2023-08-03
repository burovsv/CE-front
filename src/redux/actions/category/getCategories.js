import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetCategories = {
  getCategories: { data: [], loading: false, error: null },
};

export const getCategories = createAsyncThunk('category/getCategories', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/category/list`)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetCategories = {
  [getCategories.pending]: (state) => {
    state.getCategories.loading = true;
  },
  [getCategories.fulfilled]: (state, action) => {
    state.getCategories.loading = false;
    state.getCategories.data = action.payload;
    state.getCategories.error = null;
  },
  [getCategories.rejected]: (state, action) => {
    state.getCategories.loading = false;
    state.getCategories.error = action.payload;
  },
};
