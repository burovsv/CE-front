import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetCompetitionProducts = {
  getCompetitionProducts: { data: null, loading: false, error: null },
};

export const getCompetitionProducts = createAsyncThunk('employee/getCompetitionProducts', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/competition-products`, { params: data })
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetCompetitionProducts = {
  [getCompetitionProducts.pending]: (state) => {
    state.getCompetitionProducts.loading = true;
  },
  [getCompetitionProducts.fulfilled]: (state, action) => {
    state.getCompetitionProducts.loading = false;
    state.getCompetitionProducts.data = action.payload;
    state.getCompetitionProducts.error = null;
  },
  [getCompetitionProducts.rejected]: (state, action) => {
    state.getCompetitionProducts.loading = false;
    state.getCompetitionProducts.error = action.payload;
  },
};
