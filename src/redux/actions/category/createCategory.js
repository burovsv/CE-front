import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateCreateCategory = {
  createCategory: { data: null, loading: false, error: null },
};

export const createCategory = createAsyncThunk('category/createCategory', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .post(`${process.env.REACT_APP_SERVER_API}/category/create`, data)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerCreateCategory = {
  [createCategory.pending]: (state) => {
    state.createCategory.loading = true;
  },
  [createCategory.fulfilled]: (state, action) => {
    state.createCategory.loading = false;
    state.createCategory.data = action.payload;
    state.createCategory.error = null;
  },
  [createCategory.rejected]: (state, action) => {
    state.createCategory.loading = false;
    state.createCategory.error = action.payload;
  },
};
