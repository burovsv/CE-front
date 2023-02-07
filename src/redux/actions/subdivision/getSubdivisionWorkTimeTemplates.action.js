import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetSubdivisionWorkTimeTemplates = {
  getSubdivisionWorkTimeTemplates: { data: [], loading: false, error: null },
};

export const getSubdivisionWorkTimeTemplates = createAsyncThunk('newsType/getSubdivisionWorkTimeTemplates', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/subdivision-worktime-template`, {
      params: {
        subdivision: data,
      },
    })
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetSubdivisionWorkTimeTemplates = {
  [getSubdivisionWorkTimeTemplates.pending]: (state) => {
    state.getSubdivisionWorkTimeTemplates.loading = true;
  },
  [getSubdivisionWorkTimeTemplates.fulfilled]: (state, action) => {
    state.getSubdivisionWorkTimeTemplates.loading = false;
    state.getSubdivisionWorkTimeTemplates.data = action.payload;
    state.getSubdivisionWorkTimeTemplates.error = null;
  },
  [getSubdivisionWorkTimeTemplates.rejected]: (state, action) => {
    state.getSubdivisionWorkTimeTemplates.loading = false;
    state.getSubdivisionWorkTimeTemplates.error = action.payload;
  },
};
