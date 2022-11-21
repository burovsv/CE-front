import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetSubdivisions = {
  getSubdivisions: { data: [], loading: false, error: null },
};

export const getSubdivisions = createAsyncThunk('newsType/getSubdivisions', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/subdivision/list`)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetSubdivisions = {
  [getSubdivisions.pending]: (state) => {
    state.getSubdivisions.loading = true;
  },
  [getSubdivisions.fulfilled]: (state, action) => {
    state.getSubdivisions.loading = false;
    state.getSubdivisions.data = action.payload;
    state.getSubdivisions.error = null;
  },
  [getSubdivisions.rejected]: (state, action) => {
    state.getSubdivisions.loading = false;
    state.getSubdivisions.error = action.payload;
  },
};
