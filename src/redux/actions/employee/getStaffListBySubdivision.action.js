import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetStaffListBySubdivision = {
  getStaffListBySubdivision: { data: null, loading: false, error: null },
};

export const getStaffListBySubdivision = createAsyncThunk('employee/getStaffListBySubdivision', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/staff-by-subdivision`, {
      params: {
        subdivisionId: data?.subdivisionId,
      },
    })
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetStaffListBySubdivision = {
  [getStaffListBySubdivision.pending]: (state) => {
    state.getStaffListBySubdivision.loading = true;
  },
  [getStaffListBySubdivision.fulfilled]: (state, action) => {
    state.getStaffListBySubdivision.loading = false;
    state.getStaffListBySubdivision.data = action.payload;
    state.getStaffListBySubdivision.error = null;
  },
  [getStaffListBySubdivision.rejected]: (state, action) => {
    state.getStaffListBySubdivision.loading = false;
    state.getStaffListBySubdivision.error = action.payload;
  },
};
