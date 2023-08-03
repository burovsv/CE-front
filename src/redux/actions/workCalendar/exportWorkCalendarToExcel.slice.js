import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateExportWorkCalendarToExcel = {
  exportWorkCalendarToExcel: { data: null, loading: false, error: null },
};

export const exportWorkCalendarToExcel = createAsyncThunk('testingFilter/exportWorkCalendarToExcel', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .post(`${process.env.REACT_APP_SERVER_API}/work-calendar/excel`, data)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerExportWorkCalendarToExcel = {
  [exportWorkCalendarToExcel.pending]: (state) => {
    state.exportWorkCalendarToExcel.loading = true;
  },
  [exportWorkCalendarToExcel.fulfilled]: (state, action) => {
    state.exportWorkCalendarToExcel.loading = false;
    state.exportWorkCalendarToExcel.data = action.payload;
    state.exportWorkCalendarToExcel.error = null;
  },
  [exportWorkCalendarToExcel.rejected]: (state, action) => {
    state.exportWorkCalendarToExcel.loading = false;
    state.exportWorkCalendarToExcel.error = action.payload;
  },
};
