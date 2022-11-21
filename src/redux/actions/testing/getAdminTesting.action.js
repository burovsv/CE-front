import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetAdminTesting = {
  getAdminTesting: { data: [], loading: false, error: null },
};

export const getAdminTesting = createAsyncThunk('testing/getAdminTesting', async ({ page = 1, search = '' }, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(
      `${process.env.REACT_APP_SERVER_API}/testing/list`,

      {
        params: { page, search },
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

export const reducerGetAdminTesting = {
  [getAdminTesting.pending]: (state) => {
    state.getAdminTesting.loading = true;
  },
  [getAdminTesting.fulfilled]: (state, action) => {
    state.getAdminTesting.loading = false;
    state.getAdminTesting.data = action.payload.list;
    state.getAdminTesting.count = action.payload.count;
    // if (current(state.getAdminTesting.data)?.length !== 0) {
    //   state.getAdminTesting.data = [...current(state.getAdminTesting.data), ...action.payload];
    // } else {
    //   state.getAdminTesting.data = action.payload;
    // }

    state.getAdminTesting.error = null;
  },
  [getAdminTesting.rejected]: (state, action) => {
    state.getAdminTesting.loading = false;
    state.getAdminTesting.error = action.payload;
  },
};
