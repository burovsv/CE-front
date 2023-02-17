import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetSectionGroups = {
  getSectionGroups: { data: [], loading: false, error: null }
}

// export const getSectionGroups = () => {
//     return initStateGetSectionGroups.getSectionGroups;
// }

export const getSectionGroups = createAsyncThunk('sectionGroup/list', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/sectionGroup/list`)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetSectionGroups = {
    [getSectionGroups.pending]: (state) => {
      state.getSectionGroups.loading = true;
    },
    [getSectionGroups.fulfilled]: (state, action) => {
      state.getSectionGroups.loading = false;
      state.getSectionGroups.data = action.payload;
      state.getSectionGroups.error = null;
    },
    [getSectionGroups.rejected]: (state, action) => {
      state.getSectionGroups.loading = false;
      state.getSectionGroups.error = action.payload;
    },
  };