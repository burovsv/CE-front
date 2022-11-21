import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetAdminTestingSingle = {
  getAdminTestingSingle: { data: null, loading: false, error: null },
};

export const getAdminTestingSingle = createAsyncThunk('testing/getAdminTestingSingle', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/testing/admin/${data?.id}`)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      console.log(res);
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetAdminTestingSingle = {
  [getAdminTestingSingle.pending]: (state) => {
    state.getAdminTestingSingle.loading = true;
  },
  [getAdminTestingSingle.fulfilled]: (state, action) => {
    state.getAdminTestingSingle.loading = false;
    state.getAdminTestingSingle.data = action.payload;
    // if (current(state.getAdminTestingSingle.data)?.length !== 0) {
    //   state.getAdminTestingSingle.data = [...current(state.getAdminTestingSingle.data), ...action.payload];
    // } else {
    //   state.getAdminTestingSingle.data = action.payload;
    // }

    state.getAdminTestingSingle.error = null;
  },
  [getAdminTestingSingle.rejected]: (state, action) => {
    state.getAdminTestingSingle.loading = false;
    state.getAdminTestingSingle.error = action.payload;
  },
};
