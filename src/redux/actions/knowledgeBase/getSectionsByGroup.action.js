import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetSectionsByGroup = {
    getSectionsByGroup: { data: [], loading: false, error: null }
}

export const getSectionsByGroup = createAsyncThunk('section/list', async (id, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/section/list/${id}`)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetSectionsByGroup = {
    [getSectionsByGroup.pending]: (state) => {
      state.getSectionsByGroup.loading = true;
    },
    [getSectionsByGroup.fulfilled]: (state, action) => {
      state.getSectionsByGroup.loading = false;
      state.getSectionsByGroup.data = action.payload;
      state.getSectionsByGroup.error = null;
    },
    [getSectionsByGroup.rejected]: (state, action) => {
      state.getSectionsByGroup.loading = false;
      state.getSectionsByGroup.error = action.payload;
    },
  };