import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetUserTestingSingle = {
  getUserTestingSingle: { data: null, loading: false, error: null },
};

export const getUserTestingSingle = createAsyncThunk('testing/getUserTestingSingle', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/testing/user/${data?.id}`)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      console.log(res);
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetUserTestingSingle = {
  [getUserTestingSingle.pending]: (state) => {
    state.getUserTestingSingle.loading = true;
  },
  [getUserTestingSingle.fulfilled]: (state, action) => {
    state.getUserTestingSingle.loading = false;
    state.getUserTestingSingle.data = action.payload;
    // if (current(state.getUserTestingSingle.data)?.length !== 0) {
    //   state.getUserTestingSingle.data = [...current(state.getUserTestingSingle.data), ...action.payload];
    // } else {
    //   state.getUserTestingSingle.data = action.payload;
    // }

    state.getUserTestingSingle.error = null;
  },
  [getUserTestingSingle.rejected]: (state, action) => {
    state.getUserTestingSingle.loading = false;
    state.getUserTestingSingle.error = action.payload;
  },
};
