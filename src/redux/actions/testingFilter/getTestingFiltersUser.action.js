import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStategetTestingFiltersUser = {
  getTestingFiltersUser: { data: [], loading: false, error: null },
};

export const getTestingFiltersUser = createAsyncThunk('testingFilter/getTestingFiltersUser', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/testing-filter/user/list`)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducergetTestingFiltersUser = {
  [getTestingFiltersUser.pending]: (state) => {
    state.getTestingFiltersUser.loading = true;
  },
  [getTestingFiltersUser.fulfilled]: (state, action) => {
    state.getTestingFiltersUser.loading = false;
    state.getTestingFiltersUser.data = action.payload;
    state.getTestingFiltersUser.error = null;
  },
  [getTestingFiltersUser.rejected]: (state, action) => {
    state.getTestingFiltersUser.loading = false;
    state.getTestingFiltersUser.error = action.payload;
  },
};
