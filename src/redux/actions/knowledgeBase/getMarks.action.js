import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

// export const initStateGetMarks = {
//     getMarks: { data: [
//         {
//             id: 'mark1',
//             name: 'физика-лирика'
//         },
//         {
//             id: 'mark2',
//             name: 'развлечения'
//         },
//         {
//             id: 'mark3',
//             name: 'купания'
//         }
//     ], loading: false, error: null }
// }

export const initStateGetMarks = {
  getMarks: { data: [], loading: false, error: null },
}

// export const getMarks = () => {
//     console.log('action-marks', initStateGetMarks.getMarks);
//     return initStateGetMarks.getMarks;
// }

export const getMarks = createAsyncThunk('mark/list', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/mark/list`)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});


export const reducerGetMarks = {
    [getMarks.pending]: (state) => {
      state.getMarks.loading = true;
    },
    [getMarks.fulfilled]: (state, action) => {
      state.getMarks.loading = false;
      state.getMarks.data = action.payload.list;
      state.getMarks.count = action.payload.count;
  
      state.getMarks.error = null;
    },
    [getMarks.rejected]: (state, action) => {
      state.getMarks.loading = false;
      state.getMarks.error = action.payload;
    },
  };