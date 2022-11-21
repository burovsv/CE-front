import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateUploadAvatar = {
  uploadAvatar: { data: [], loading: false, error: null },
};

export const uploadAvatar = createAsyncThunk('employee/uploadAvatar', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .post(`${process.env.REACT_APP_SERVER_API}/employee/upload`, data)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerUploadAvatar = {
  [uploadAvatar.pending]: (state) => {
    state.uploadAvatar.loading = true;
  },
  [uploadAvatar.fulfilled]: (state, action) => {
    state.uploadAvatar.loading = false;
    state.uploadAvatar.data = action.payload;
    state.uploadAvatar.error = null;
  },
  [uploadAvatar.rejected]: (state, action) => {
    state.uploadAvatar.loading = false;
    state.uploadAvatar.error = action.payload;
  },
};
