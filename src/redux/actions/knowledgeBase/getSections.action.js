import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetSections = {
    getSections: { data: null, loading: false, error: null }
}

export const getSections = createAsyncThunk('section/list', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/section/list`)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetSections = {
    [getSections.pending]: (state) => {
      state.getSections.loading = true;
    },
    [getSections.fulfilled]: (state, action) => {
      state.getSections.loading = false;
      state.getSections.data = action.payload;
      state.getSections.error = null;
    },
    [getSections.rejected]: (state, action) => {
      state.getSections.loading = false;
      state.getSections.error = action.payload;
    },
  };