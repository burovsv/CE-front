import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetNewsTypes = {
  getNewsTypes: { data: [], loading: false, error: null },
};

export const getNewsTypes = createAsyncThunk('newsType/getNewsTypes', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/news-type/list`)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetNewsTypes = {
  [getNewsTypes.pending]: (state) => {
    state.getNewsTypes.loading = true;
  },
  [getNewsTypes.fulfilled]: (state, action) => {
    state.getNewsTypes.loading = false;
    state.getNewsTypes.data = action.payload;
    state.getNewsTypes.error = null;
  },
  [getNewsTypes.rejected]: (state, action) => {
    state.getNewsTypes.loading = false;
    state.getNewsTypes.error = action.payload;
  },
};
