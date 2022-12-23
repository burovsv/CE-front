import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetMarks = {
    getMarks: { data: [
        {
            id: 'mark1',
            name: 'физика-лирика'
        },
        {
            id: 'mark2',
            name: 'развлечения'
        },
        {
            id: 'mark3',
            name: 'купания'
        }
    ], loading: false, error: null }
}

export const getMarks = () => {
    console.log('action-marks', initStateGetMarks.getMarks);
    return initStateGetMarks.getMarks;
}


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