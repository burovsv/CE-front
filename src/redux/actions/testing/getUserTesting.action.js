import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetUserTesting = {
  getUserTesting: { data: null, loading: false, error: null },
};

export const getUserTesting = createAsyncThunk('testing/getUserTesting', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/testing/${data?.id}`, {
      params: {
        page: data?.page,
      },
    })
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      console.log(res);
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetUserTesting = {
  [getUserTesting.pending]: (state) => {
    state.getUserTesting.loading = true;
  },
  [getUserTesting.fulfilled]: (state, action) => {
    state.getUserTesting.loading = false;
    state.getUserTesting.data = action.payload.list;
    state.getUserTesting.count = action.payload.count;
    // if (current(state.getUserTesting.data)?.length !== 0) {
    //   state.getUserTesting.data = [...current(state.getUserTesting.data), ...action.payload];
    // } else {
    //   state.getUserTesting.data = action.payload;
    // }

    state.getUserTesting.error = null;
  },
  [getUserTesting.rejected]: (state, action) => {
    state.getUserTesting.loading = false;
    state.getUserTesting.error = action.payload;
  },
};
