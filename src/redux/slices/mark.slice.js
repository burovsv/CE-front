import { createSlice } from '@reduxjs/toolkit';
import { initStateGetMarks, reducerGetMarks } from '../actions/knowledgeBase/getMarks.action';
import { initStateCreateMark, createMark } from '../actions/knowledgeBase/createMark.action';


export const initialState = {
    ...initStateGetMarks,

  };
  
export const markSlice = createSlice({
    name: 'mark',
    initialState,
    reducers: {
      resetGetMarks(state) {
        state.getMarks = initStateGetMarks.getMarks;
      },
      resetCreateMark(state) {
        state.createMark = initStateCreateMark.createMark;
      },
    },
  });
  export const markReducer = markSlice.reducer;