import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStategetCatsByPostAndSubdiv = {
  getCatsByPostAndSubdiv: { data: [], loading: false, error: null },
};

export const getCatsByPostAndSubdiv = createAsyncThunk('category/getCatsByPostAndSubdiv', async ({ subdivisionId, postId }, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/category/${subdivisionId}/${postId}`)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducergetCatsByPostAndSubdiv = {
  [getCatsByPostAndSubdiv.pending]: (state) => {
    state.getCatsByPostAndSubdiv.loading = true;
  },
  [getCatsByPostAndSubdiv.fulfilled]: (state, action) => {
    state.getCatsByPostAndSubdiv.loading = false;
    state.getCatsByPostAndSubdiv.data = action.payload;
    state.getCatsByPostAndSubdiv.error = null;
  },
  [getCatsByPostAndSubdiv.rejected]: (state, action) => {
    state.getCatsByPostAndSubdiv.loading = false;
    state.getCatsByPostAndSubdiv.error = action.payload;
  },
};
