import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateSaveStaffList = {
  saveStaffList: { data: null, loading: false, error: null },
};

export const saveStaffList = createAsyncThunk('employee/saveStaffList', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .post(`${process.env.REACT_APP_SERVER_API}/staff`, data)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerSaveStaffList = {
  [saveStaffList.pending]: (state) => {
    state.saveStaffList.loading = true;
  },
  [saveStaffList.fulfilled]: (state, action) => {
    state.saveStaffList.loading = false;
    state.saveStaffList.data = action.payload;
    state.saveStaffList.error = null;
  },
  [saveStaffList.rejected]: (state, action) => {
    state.saveStaffList.loading = false;
    state.saveStaffList.error = action.payload;
  },
};
