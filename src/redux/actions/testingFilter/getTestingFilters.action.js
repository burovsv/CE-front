import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStategetTestingFilters = {
  getTestingFilters: { data: [], loading: false, error: null },
};

export const getTestingFilters = createAsyncThunk('testingFilter/getTestingFilters', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/testing-filter/list`)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducergetTestingFilters = {
  [getTestingFilters.pending]: (state) => {
    state.getTestingFilters.loading = true;
  },
  [getTestingFilters.fulfilled]: (state, action) => {
    state.getTestingFilters.loading = false;
    state.getTestingFilters.data = action.payload;
    state.getTestingFilters.error = null;
  },
  [getTestingFilters.rejected]: (state, action) => {
    state.getTestingFilters.loading = false;
    state.getTestingFilters.error = action.payload;
  },
};
